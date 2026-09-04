import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const MESSAGES = [
  "ഇത് എന്താണെന്ന് ആലോചിക്കുന്നു...",
  "Personality പരിശോധിക്കുന്നു...",
  "ഇത് നിങ്ങളെ judge ചെയ്യുന്നുണ്ടോ എന്ന് നോക്കുന്നു...",
  "അനാവശ്യമായ calculations നടത്തുന്നു...",
  "Backstory ഉണ്ടാക്കുന്നു...",
  "Secret life കണ്ടെത്തുന്നു...",
  "ഇത് മനുഷ്യനായിരുന്നെങ്കിൽ എന്തായേനെ എന്ന് ആലോചിക്കുന്നു...",
  "Almost useless...",
  "This analysis is completely unnecessary.",
];

export function AnalysisLoader() {
  const [i, setI] = useState(0);
  const [progress, setProgress] = useState(4);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % MESSAGES.length), 1900);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => (p >= 96 ? 96 : p + Math.random() * 9));
    }, 520);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="glass relative overflow-hidden rounded-3xl p-8 text-center sm:p-14">
      <motion.div
        className="bg-chaos pointer-events-none absolute -inset-24 opacity-15 blur-3xl"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative z-10 flex flex-col items-center gap-6">
        <motion.div
          className="text-6xl"
          animate={{ rotate: [0, 12, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          🧠
        </motion.div>

        <div className="h-14 w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
              transition={{ duration: 0.45 }}
              className="mal font-display text-lg font-semibold sm:text-2xl"
            >
              {MESSAGES[i]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="w-full max-w-md">
          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="bg-chaos h-full"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.5 }}
            />
          </div>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {Math.round(progress)}% unnecessary
          </p>
        </div>
      </div>
    </div>
  );
}
