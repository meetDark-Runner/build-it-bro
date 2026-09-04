import { motion } from "motion/react";
import type { Persona } from "@/types";
import { ScoreRing, ScoreBar } from "@/components/ScoreRing";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-muted/40 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className="mal mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-3xl p-5 sm:p-7">
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function PersonalityCard({ persona, preview }: { persona: Persona; preview?: React.ReactNode }) {
  const s = persona.scores;
  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass glow-primary relative overflow-hidden rounded-3xl p-6 sm:p-9"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {preview ? (
            <div className="h-40 w-full shrink-0 overflow-hidden rounded-2xl bg-muted sm:size-36">{preview}</div>
          ) : (
            <motion.div
              className="grid h-40 w-full shrink-0 place-items-center rounded-2xl bg-muted text-6xl sm:size-36"
              animate={{ rotate: [0, 8, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              {persona.emoji || "🧠"}
            </motion.div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              detected: {persona.subject}
            </p>
            <h2 className="mal text-chaos mt-2 text-3xl font-extrabold sm:text-5xl">{persona.name}</h2>
            <p className="mal mt-2 text-sm text-muted-foreground">{persona.oneLiner}</p>
            <div className="mal mt-4 flex flex-wrap gap-2">
              {persona.traits.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Age" value={persona.age} />
          <Field label="Mood" value={persona.mood} />
          <Field label="Occupation" value={persona.occupation} />
          <Field label="Personality" value={persona.personality} />
        </div>
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <Section title="🏆 Uselessness Score">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <ScoreRing label="Uselessness" value={s.uselessness} tone="accent" size={150} />
            <p className="mal whitespace-pre-line text-sm text-muted-foreground">
              {persona.verdict.split(" / ").join("\n")}
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ScoreBar label="Drama" value={s.drama} />
            <ScoreBar label="Chaos" value={s.chaos} />
            <ScoreBar label="Main Character Energy" value={s.mainCharacter} />
            <ScoreBar label="Trustworthiness" value={s.trustworthiness} />
            <ScoreBar label="Need for Attention" value={s.attention} />
            <ScoreBar label="Intelligence" value={s.intelligence} />
            <ScoreBar label="Laziness" value={s.laziness} />
            <ScoreBar label="Compatibility with you" value={persona.compatibility} />
          </div>
          <p className="mt-5 rounded-2xl border border-border bg-muted/40 p-4 text-sm">
            🚩 Red flag detector: <strong>{persona.redFlags} red flags</strong> — still emotionally
            compatible at {persona.compatibility}%.
          </p>
        </Section>

        <Section title="🧠 Inner world">
          <div className="space-y-3">
            {persona.innerThoughts.map((t, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}
                className="mal rounded-2xl border border-border bg-muted/40 p-4 text-sm italic"
              >
                {t}
              </motion.p>
            ))}
          </div>
          <div className="mt-4 grid gap-3">
            <Field label="What it wants to tell you" value={persona.wantsToTellYou} />
            <Field label="What it thinks about you" value={persona.thinksAboutYou} />
          </div>
        </Section>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="🎭 Personality file">
          <div className="grid gap-3">
            <Field label="Strengths" value={persona.strengths.join(" · ")} />
            <Field label="Weaknesses" value={persona.weaknesses.join(" · ")} />
            <Field label="Biggest insecurity" value={persona.insecurity} />
            <Field label="Biggest flex" value={persona.flex} />
          </div>
        </Section>
        <Section title="📖 Completely unnecessary life story">
          <div className="grid gap-3">
            <Field label="Backstory" value={persona.backstory} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Hidden talent" value={persona.hiddenTalent} />
              <Field label="Biggest fear" value={persona.fear} />
              <Field label="Life goal" value={persona.lifeGoal} />
              <Field label="Relationship status" value={persona.relationship} />
              <Field label="Best friend" value={persona.bestFriend} />
              <Field label="Enemy" value={persona.enemy} />
              <Field label="Weekend activity" value={persona.weekend} />
              <Field label="If it were human" value={persona.ifHuman} />
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
