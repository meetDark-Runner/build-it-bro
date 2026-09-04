import { useCallback, useRef, useState } from "react";
import { motion } from "motion/react";
import { Image, Video, Mic, Trash2, Sparkles, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UploadKind } from "@/types";

const ACCEPT: Record<UploadKind, string> = {
  image: "image/jpeg,image/png,image/webp",
  video: "video/mp4,video/quicktime,video/webm",
  audio: "audio/mpeg,audio/wav,audio/mp4,audio/x-m4a,audio/webm",
};

export interface PickedFile {
  kind: UploadKind;
  file: File;
  previewUrl: string;
  dataUrl?: string;
}

function kindOf(file: File): UploadKind | null {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  return null;
}

async function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = () => reject(new Error("read failed"));
    fr.readAsDataURL(file);
  });
}

async function shrinkImage(file: File): Promise<string> {
  const dataUrl = await toDataUrl(file);
  try {
    const img = new window.Image();
    img.src = dataUrl;
    await img.decode();
    const max = 900;
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } catch {
    return dataUrl;
  }
}

export function UploadZone({
  onAnalyze,
  onSurprise,
  busy,
}: {
  onAnalyze: (p: PickedFile) => void;
  onSurprise: () => void;
  busy: boolean;
}) {
  const [picked, setPicked] = useState<PickedFile | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reading, setReading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [accept, setAccept] = useState<string>(Object.values(ACCEPT).join(","));

  const take = useCallback(async (file: File) => {
    const kind = kindOf(file);
    if (!kind) {
      setError("🫠 ഈ file എന്താണെന്ന് ഞങ്ങൾക്ക് മനസ്സിലായില്ല. Photo, video അല്ലെങ്കിൽ audio ഇടൂ.");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError("💀 ഈ file വളരെ വലുതാണ്. 25MB-ൽ താഴെ ഒന്ന് ഇടൂ.");
      return;
    }
    setError(null);
    setReading(true);
    try {
      const previewUrl = URL.createObjectURL(file);
      const dataUrl = kind === "image" ? await shrinkImage(file) : undefined;
      setPicked({ kind, file, previewUrl, dataUrl });
    } finally {
      setReading(false);
    }
  }, []);

  const openPicker = (kind?: UploadKind) => {
    setAccept(kind ? ACCEPT[kind] : Object.values(ACCEPT).join(","));
    window.setTimeout(() => inputRef.current?.click(), 0);
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void take(f);
          e.target.value = "";
        }}
      />

      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files?.[0];
          if (f) void take(f);
        }}
        animate={{
          scale: dragging ? 1.02 : 1,
          borderColor: dragging ? "var(--primary)" : "var(--border)",
        }}
        className="glass noise-grid relative overflow-hidden rounded-3xl border-2 border-dashed p-6 sm:p-10"
      >
        {!picked ? (
          <div className="relative z-10 flex flex-col items-center gap-5 text-center">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
              className="glow-primary grid size-16 place-items-center rounded-2xl bg-muted"
            >
              <UploadCloud className="size-7 text-primary" />
            </motion.div>
            <div>
              <p className="font-display text-lg font-semibold sm:text-xl">
                {dragging ? "വിട്ടേക്ക്. ഞാൻ പിടിക്കാം. 🫴" : "Drag & drop anything here"}
              </p>
              
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button size="lg" onClick={() => openPicker("image")} disabled={reading}>
                <Image className="size-4" /> 📸 Upload Photo
              </Button>
              <Button size="lg" variant="secondary" onClick={() => openPicker("video")} disabled={reading}>
                <Video className="size-4" /> 🎥 Upload Video
              </Button>
              <Button size="lg" variant="secondary" onClick={() => openPicker("audio")} disabled={reading}>
                <Mic className="size-4" /> 🎙️ Upload Audio
              </Button>
             
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center"
          >
            <div className="grid h-40 w-full shrink-0 place-items-center overflow-hidden rounded-2xl bg-muted sm:h-32 sm:w-44">
              {picked.kind === "image" && (
                <img src={picked.previewUrl} alt="Your upload preview" className="h-full w-full object-cover" />
              )}
              {picked.kind === "video" && (
                <video src={picked.previewUrl} className="h-full w-full object-cover" muted playsInline controls={false} />
              )}
              {picked.kind === "audio" && <span className="text-5xl">🎙️</span>}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-base font-semibold">{picked.file.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {picked.kind.toUpperCase()} · {picked.file.type || "unknown"} ·{" "}
                {(picked.file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              {picked.kind === "audio" && (
                <audio src={picked.previewUrl} controls className="mt-3 w-full max-w-xs" />
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={() => onAnalyze(picked)} disabled={busy || reading}>
                  <Sparkles className="size-4" /> Analyze it 🧠
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    URL.revokeObjectURL(picked.previewUrl);
                    setPicked(null);
                  }}
                  disabled={busy}
                >
                  <Trash2 className="size-4" /> Remove
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mal mt-3 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-foreground"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
