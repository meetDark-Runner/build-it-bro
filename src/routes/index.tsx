import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { FloatingUniverse } from "@/components/FloatingUniverse";
import { Hero } from "@/components/Hero";
import { UploadZone, type PickedFile } from "@/components/UploadZone";
import { AnalysisLoader } from "@/components/AnalysisLoader";
import { ReactionCard } from "@/components/ReactionCard";
import { PersonalityCard } from "@/components/PersonalityCard";
import { ActionDeck } from "@/components/ActionDeck";
import { CharacterChat } from "@/components/CharacterChat";
import { MemeGenerator } from "@/components/MemeGenerator";
import { ExampleGallery, type Example } from "@/components/ExampleGallery";
import { Footer } from "@/components/Footer";
import { analyzeUpload, surpriseMe } from "@/lib/ai.functions";
import type { Persona, UploadKind } from "@/types";

const TITLE = "ഇതിന് എന്താ തോന്നുന്നത്? — Give anything a personality";
const DESC =
  "Upload any photo, video or voice note and an AI invents a full fictional personality for it: mood, backstory, secret life, memes and a chat. Gloriously useless.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Index,
});

type Phase = "idle" | "analyzing" | "result";

function Index() {
  const analyze = useServerFn(analyzeUpload);
  const surprise = useServerFn(surpriseMe);
  const [phase, setPhase] = useState<Phase>("idle");
  const [persona, setPersona] = useState<Persona | null>(null);
  const [kind, setKind] = useState<UploadKind>("image");
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [degraded, setDegraded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busyRef = useRef(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const finish = (p: Persona, isDegraded: boolean) => {
    setPersona(p);
    setDegraded(isDegraded);
    setPhase("result");
    window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  };

  const fail = () => {
    setError("😭 “The AI brain has temporarily left the building.” ഒന്ന് കൂടെ try ചെയ്യാമോ?");
    setPhase("idle");
  };

  const runAnalyze = async (p: PickedFile) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setError(null);
    setKind(p.kind);
    setPreviewUrl(p.kind === "image" ? p.dataUrl ?? p.previewUrl : undefined);
    setPhase("analyzing");
    try {
      const res = await analyze({
        data: {
          kind: p.kind,
          fileName: p.file.name,
          mimeType: p.file.type,
          size: p.file.size,
          dataUrl: p.dataUrl,
        },
      });
      finish(res.persona, res.degraded);
    } catch {
      fail();
    } finally {
      busyRef.current = false;
    }
  };

  const runSurprise = async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setError(null);
    setKind("image");
    setPreviewUrl(undefined);
    setPhase("analyzing");
    try {
      const res = await surprise({});
      finish(res.persona, res.degraded);
    } catch {
      fail();
    } finally {
      busyRef.current = false;
    }
  };

  const runExample = async (e: Example) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setError(null);
    setKind("image");
    setPreviewUrl(undefined);
    setPhase("analyzing");
    try {
      const res = await analyze({ data: { kind: "image", hint: e.hint } });
      finish({ ...res.persona, emoji: res.persona.emoji || e.emoji }, res.degraded);
    } catch {
      fail();
    } finally {
      busyRef.current = false;
    }
  };

  return (
    <div className="relative min-h-screen">
      <FloatingUniverse />

      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6">
        <Hero />

        <section className="mt-10">
          <AnimatePresence mode="wait">
            {phase === "analyzing" ? (
              <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AnalysisLoader />
              </motion.div>
            ) : (
              <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <UploadZone onAnalyze={runAnalyze} onSurprise={runSurprise} busy={false} />
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <p className="mal mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">
              {error}
              <Button size="sm" variant="secondary" onClick={runSurprise}>
                🔄 Try again
              </Button>
            </p>
          )}
        </section>

        {phase === "result" && persona && (
          <div ref={resultRef} className="mt-14 space-y-6 scroll-mt-6">
            <ReactionCard kind={kind} reaction={persona.reaction} />

            {degraded && (
              <p className="mal rounded-2xl border border-border bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
                🫠 AI brain busy ആയിരുന്നു — ഇത് ഞങ്ങളുടെ backup personality ആണ്. Equally useless,
                promise.
              </p>
            )}

            <PersonalityCard
              persona={persona}
              preview={
                previewUrl ? (
                  <img src={previewUrl} alt={`Your upload: ${persona.subject}`} className="h-full w-full object-cover" />
                ) : undefined
              }
            />

            <ActionDeck persona={persona} />

            <div className="grid gap-6 lg:grid-cols-2">
              <CharacterChat persona={persona} />
              <MemeGenerator persona={persona} {...(previewUrl ? { imageUrl: previewUrl } : {})} />
            </div>

            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <Button onClick={runSurprise}>🎲 Surprise me again</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setPhase("idle");
                  setPersona(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                🔄 Analyze something else
              </Button>
            </div>
          </div>
        )}

        <div className="mt-16">
          <ExampleGallery onPick={runExample} />
        </div>

        <Footer />
      </main>
    </div>
  );
}
