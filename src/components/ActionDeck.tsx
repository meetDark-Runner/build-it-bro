import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { generateExtra } from "@/lib/ai.functions";
import type { ExtraMode, Persona } from "@/types";

const ACTIONS: Array<{ mode: ExtraMode; label: string; title: string }> = [
  { mode: "roast", label: "🔥 Roast It", title: "🔥 The roast" },
  { mode: "compliment", label: "💖 Compliment It", title: "💖 The compliment" },
  { mode: "secret", label: "🕵️ Reveal Its Secret Life", title: "🕵️ Secret life" },
  { mode: "human", label: "🧑 If It Were Human", title: "🧑 As a human" },
  { mode: "courtroom", label: "⚖️ Courtroom Mode", title: "⚖️ The People vs This Thing" },
  { mode: "dating", label: "💘 Dating Profile", title: "💘 Dating profile" },
  { mode: "linkedin", label: "💼 LinkedIn Profile", title: "💼 Fake professional" },
  { mode: "horoscope", label: "🔮 Horoscope", title: "🔮 Today's nonsense" },
  { mode: "resume", label: "📄 Resume", title: "📄 Curriculum ridiculum" },
];

export function personaSummary(p: Persona): string {
  return [
    `Subject: ${p.subject}`,
    `Name: ${p.name} ${p.emoji}`,
    `Age: ${p.age}`,
    `Mood: ${p.mood}`,
    `Occupation: ${p.occupation}`,
    `Personality: ${p.personality}`,
    `Traits: ${p.traits.join(", ")}`,
    `Backstory: ${p.backstory}`,
    `Secret: ${p.secretLife}`,
    `Fear: ${p.fear}`,
    `Enemy: ${p.enemy}`,
    `Inner thoughts: ${p.innerThoughts.join(" | ")}`,
  ].join("\n");
}

export function ActionDeck({ persona }: { persona: Persona }) {
  const run = useServerFn(generateExtra);
  const [active, setActive] = useState<ExtraMode | null>(null);
  const [loading, setLoading] = useState<ExtraMode | null>(null);
  const [text, setText] = useState("");
  const [revealStage, setRevealStage] = useState(false);

  const go = async (mode: ExtraMode) => {
    setLoading(mode);
    setActive(mode);
    setText("");
    setRevealStage(mode === "secret");
    try {
      const res = await run({ data: { mode, persona: personaSummary(persona) } });
      if (mode === "secret") await new Promise((r) => setTimeout(r, 1500));
      setText(res.text);
    } catch {
      setText("😭 The AI brain has temporarily left the building. ഒന്ന് കൂടെ try ചെയ്യൂ.");
    } finally {
      setRevealStage(false);
      setLoading(null);
    }
  };

  const title = ACTIONS.find((a) => a.mode === active)?.title ?? "";

  return (
    <div className="glass rounded-3xl p-5 sm:p-7">
      <h3 className="font-display text-lg font-bold">🎮 Do something unnecessary</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {ACTIONS.map((a) => (
          <Button
            key={a.mode}
            size="sm"
            variant={active === a.mode ? "default" : "secondary"}
            onClick={() => void go(a.mode)}
            disabled={loading !== null}
          >
            {a.label}
          </Button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active + (loading ? "-l" : "-d")}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-5 overflow-hidden rounded-2xl border border-border bg-muted/40 p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">{title}</p>
            {loading ? (
              <div className="mal mt-3 text-sm text-muted-foreground">
                {revealStage ? (
                  <motion.p
                    className="font-display text-lg"
                    animate={{ opacity: [0.35, 1, 0.35] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  >
                    “At night, when nobody is watching...”
                  </motion.p>
                ) : (
                  <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.3, repeat: Infinity }}>
                    ആലോചിക്കുന്നു... ഇത് ഒട്ടും അവശ്യമല്ല.
                  </motion.p>
                )}
              </div>
            ) : (
              <p className="mal mt-3 whitespace-pre-line text-sm leading-relaxed">{text}</p>
            )}
            {!loading && text && (
              <Button size="sm" variant="ghost" className="mt-4" onClick={() => void go(active)}>
                🎲 Generate another
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
