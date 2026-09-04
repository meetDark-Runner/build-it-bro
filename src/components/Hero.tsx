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
        
        <h1 className="mal text-chaos mt-6 text-4xl font-extrabold leading-tight sm:text-6xl">
          എനിക്ക് തോന്നിയത് ഞൻ പറയാം 
        </h1>
        
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
