import { motion } from "motion/react";

const TICKER = [
  "🍌 banana got a job",
  "📱 phone went to court",
  "🐱 cat made a LinkedIn",
  "🥄 spoon resigned",
  "🎧 headphones have secrets",
  "☕ chai gave life advice",
];

export function Hero() {
  return (
    <header className="relative pt-14 sm:pt-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-3xl text-center"
      >
        <span className="glass mal inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium">
          🧠 AI-generated fictional entertainment · not a real personality test
        </span>
        <h1 className="mal text-chaos mt-6 text-4xl font-extrabold leading-tight sm:text-6xl">
          എനിക്ക് എന്താണ് തോന്നിയത്😏
        </h1>
        <p className="mal mt-5 text-base text-muted-foreground sm:text-lg">
          “ഒരു photo, video അല്ലെങ്കിൽ audio upload ചെയ്യൂ... അതിന് നിങ്ങളോട് പറയാനുള്ളത് കേൾക്കാം.”
        </p>
        <p className="font-display mt-3 text-lg font-semibold sm:text-xl">
          Upload anything. Give it a personality. Regret nothing.
        </p>
      </motion.div>

      <div className="relative mt-8 overflow-hidden">
        <div className="animate-marquee flex w-max gap-8 opacity-60">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="whitespace-nowrap text-sm uppercase tracking-[0.2em]">
              {t}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
