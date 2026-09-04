import { motion } from "motion/react";

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-border pb-12 pt-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <motion.span
          className="text-3xl"
          animate={{ rotate: [0, 14, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          🧠
        </motion.span>
        <p className="mal font-display text-lg font-bold">ഇതിന് എന്താ തോന്നുന്നത്?</p>
        <p className="mal max-w-xl text-xs text-muted-foreground">
          എല്ലാം AI ഉണ്ടാക്കിയ കഥകളാണ്. This is fictional AI-generated entertainment, not a real
          psychological assessment — especially for photos of real people. No file is stored after
          your visit.
        </p>
        <p className="text-xs text-muted-foreground">
          Built for absolutely no reason. Uselessness: 100%.
        </p>
      </div>
    </footer>
  );
}
