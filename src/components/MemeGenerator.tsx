import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useServerFn } from "@tanstack/react-start";
import { Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateExtra } from "@/lib/ai.functions";
import { personaSummary } from "@/components/ActionDeck";
import type { Persona } from "@/types";

const STYLES = [
  { id: "savage", label: "🔥 Savage" },
  { id: "dumb", label: "😂 Dumb" },
  { id: "dark but harmless", label: "💀 Dark-ish" },
  { id: "nerd", label: "🤓 Nerd" },
  { id: "cool", label: "😎 Cool" },
  { id: "emotional", label: "😭 Emotional" },
  { id: "malayali", label: "🇮🇳 Malayali" },
];

export function MemeGenerator({
  persona,
  imageUrl,
}: {
  persona: Persona;
  imageUrl?: string;
}) {
  const run = useServerFn(generateExtra);
  const [top, setTop] = useState(persona.memeTop);
  const [bottom, setBottom] = useState(persona.memeBottom);
  const [style, setStyle] = useState(STYLES[0].id);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const regenerate = async (styleId: string) => {
    setLoading(true);
    setStyle(styleId);
    try {
      const res = await run({
        data: { mode: "meme", persona: personaSummary(persona), memeStyle: styleId },
      });
      const [t, b] = res.text.split(/\s*\/\s*/);
      setTop((t ?? res.text).toUpperCase().slice(0, 70));
      setBottom((b ?? "").toUpperCase().slice(0, 70));
    } catch {
      setTop("AI TRIED ITS BEST");
      setBottom("IT WAS NOT ENOUGH 💀");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (img?: HTMLImageElement) => {
      const W = 900;
      const H = 900;
      canvas.width = W;
      canvas.height = H;
      ctx.fillStyle = "#151321";
      ctx.fillRect(0, 0, W, H);
      if (img) {
        const scale = Math.max(W / img.width, H / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
      } else {
        ctx.font = "320px serif";
        ctx.textAlign = "center";
        ctx.fillText(persona.emoji || "🧠", W / 2, H / 2 + 110);
      }
      ctx.textAlign = "center";
      ctx.lineWidth = 12;
      ctx.strokeStyle = "#000";
      ctx.fillStyle = "#fff";
      const write = (text: string, y: number) => {
        let size = 68;
        ctx.font = `900 ${size}px Impact, "Anton", sans-serif`;
        while (ctx.measureText(text).width > W - 60 && size > 26) {
          size -= 4;
          ctx.font = `900 ${size}px Impact, "Anton", sans-serif`;
        }
        ctx.strokeText(text, W / 2, y);
        ctx.fillText(text, W / 2, y);
      };
      if (top) write(top, 92);
      if (bottom) write(bottom, H - 48);
    };

    if (imageUrl) {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => draw(img);
      img.onerror = () => draw();
      img.src = imageUrl;
    } else {
      draw();
    }
  }, [top, bottom, imageUrl, persona.emoji]);

  const download = () => {
    const url = canvasRef.current?.toDataURL("image/png");
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `${persona.name || "meme"}-meme.png`;
    a.click();
  };

  return (
    <div className="glass rounded-3xl p-5 sm:p-7">
      <h3 className="font-display text-lg font-bold">😂 Meme generator</h3>
      <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <motion.div layout className="overflow-hidden rounded-2xl border border-border bg-muted">
          <canvas ref={canvasRef} className="h-auto w-full" />
        </motion.div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            meme personality
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {STYLES.map((s) => (
              <Button
                key={s.id}
                size="sm"
                variant={style === s.id ? "default" : "secondary"}
                onClick={() => void regenerate(s.id)}
                disabled={loading}
              >
                {s.label}
              </Button>
            ))}
          </div>
          <div className="mal mt-5 space-y-2 rounded-2xl border border-border bg-muted/40 p-4 text-sm">
            <p>
              <span className="text-muted-foreground">Top:</span> {top || "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Bottom:</span> {bottom || "—"}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={download}>
              <Download className="size-4" /> Download meme
            </Button>
            <Button variant="secondary" onClick={() => void regenerate(style)} disabled={loading}>
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Generate another
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
