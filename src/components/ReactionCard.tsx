import { motion } from "motion/react";
import type { UploadKind } from "@/types";

const BY_KIND: Record<UploadKind, string[]> = {
  image: ["😂 BRO WHAT DID YOU JUST UPLOAD?", "WHAT AM I LOOKING AT 💀", "ഇതിന് personality വേണമെന്നാണോ?"],
  video: ["💀 I WAS NOT READY FOR THIS.", "ഇത് analyze ചെയ്യേണ്ടി വന്നല്ലോ...", "Bro really uploaded this 😭"],
  audio: ["😭 ആരാടാ ഇത് അയച്ചത്?", "ഞാൻ resign ചെയ്യുന്നു.", "Why does this exist?"],
};

const STICKERS = ["💀", "😂", "😭", "🫠", "😳", "🔥", "🤡", "🧠"];

export function ReactionCard({ kind, reaction }: { kind: UploadKind; reaction?: string }) {
  const pool = BY_KIND[kind];
  const text = reaction?.trim() || pool[Math.floor(Math.random() * pool.length)];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 14 }}
      className="glass glow-accent relative overflow-hidden rounded-3xl p-6 sm:p-8"
    >
      <div className="pointer-events-none absolute inset-0 opacity-30">
        {STICKERS.map((s, i) => (
          <motion.span
            key={s}
            className="absolute text-3xl"
            style={{ left: `${(i * 12 + 4) % 92}%`, top: `${(i % 3) * 30 + 6}%` }}
            animate={{ y: [0, -14, 0], rotate: [0, 18, -12, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
          >
            {s}
          </motion.span>
        ))}
      </div>
      <div className="relative z-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
          instant reaction
        </p>
        <motion.p
          className="mal font-display mt-3 text-2xl font-extrabold uppercase leading-tight sm:text-4xl"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          {text}
        </motion.p>
      </div>
    </motion.div>
  );
}
