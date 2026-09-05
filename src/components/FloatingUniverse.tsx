import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const EMOJIS = [
  "🪑", "🌀", "🍌", "👟", "🐱", "🐶", "💻", "📱", "🎧", "🍕", "☕", "🧴",
  "🏀", "🚗", "🪴", "🎒", "🛵", "🕶️", "🧸", "🥤", "📷", "🎮", "⌚", "🧃",
];

const LINES: Record<string, string[]> = {
  "🪑": ["“എന്നെ ഒന്ന് വെറുതെ വിടാമോ?”", "“ഞാൻ ഇരിക്കാൻ മാത്രമുള്ളതല്ല bro.”"],
  "🍌": ["“എനിക്ക് എന്തിനാ ഇത്ര attention?”", "“3 ദിവസം ആയി ഞാൻ ഇവിടെ.”"],
  "🌀": ["“ഞാൻ ഇപ്പോഴും കറങ്ങിക്കൊണ്ടിരിക്കുകയാണ് bro.”"],
  "☕": ["“ആദ്യം ചായ. ബാക്കി പിന്നെ.”"],
  "🐱": ["“നീ എന്നെ upload ചെയ്തോ? 😐”"],
  "📱": ["“Battery 3% ആണ്. Respectfully, goodbye.”"],
  "🎧": ["“ഞാൻ കേട്ടത് ഞാൻ പറയില്ല.”"],
  "🍕": ["“ഒരു slice പോയി. ഞാൻ ഒന്നും മറന്നിട്ടില്ല.”"],
  "🚗": ["“Petrol രണ്ട് ദിവസം ആയി. Emotional support ഇല്ല.”"],
  "🧸": ["“ഞാൻ എല്ലാം അറിയാം. ഞാൻ പറയില്ല.”"],
};

const GENERIC = [
  "“ഇത് ഒരു website ആണോ അതോ ഒരു test ആണോ?”",
  "“Bro respectfully, scroll ചെയ്ത് പോ.”",
  "“I have no purpose here. Same as you.”",
  "“എനിക്ക് ഒരു personality വേണം. നീ തരുമോ?”",
  "“ഞാൻ ഒരു decoration മാത്രം ആണ്. അതും ok.”",
];

interface Floater {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  depth: number;
}

function makeFloaters(count: number): Floater[] {
  return Array.from({ length: count }, (_, i) => {
    const depth = 0.3 + Math.random() * 0.9;
    return {
      id: i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)] ?? "✨",
      x: Math.random() * 92 + 2,
      y: Math.random() * 92 + 2,
      size: Math.round(20 + depth * 34),
      duration: 14 + Math.random() * 18,
      delay: Math.random() * -20,
      drift: (Math.random() - 0.5) * 90,
      depth,
    };
  });
}

export function FloatingUniverse() {
  const reduced = useReducedMotion();
  const [mobile, setMobile] = useState(false);
  const [seed, setSeed] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [bubble, setBubble] = useState<{ id: number; text: string } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const floaters = useMemo(() => makeFloaters(mobile ? 9 : 18), [mobile, seed]);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setSeed((s) => s + 1), 45000);
    return () => clearInterval(t);
  }, [reduced]);

  useEffect(() => {
    if (reduced || mobile) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        setPointer({
          x: (e.clientX / window.innerWidth - 0.5) * 2,
          y: (e.clientY / window.innerHeight - 0.5) * 2,
        }),
      );
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [reduced, mobile]);

  const speak = (f: Floater) => {
    const pool = LINES[f.emoji] ?? GENERIC;
    const text = pool[Math.floor(Math.random() * pool.length)] ?? GENERIC[0]!;
    setBubble({ id: f.id, text });
    window.setTimeout(() => setBubble((b) => (b?.id === f.id ? null : b)), 2600);
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {floaters.map((f) => (
        <motion.button
          key={`${seed}-${f.id}`}
          type="button"
          tabIndex={-1}
          onClick={() => speak(f)}
          className="pointer-events-auto absolute cursor-pointer select-none opacity-70 transition-opacity hover:opacity-100"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            fontSize: f.size,
            filter: `blur(${f.depth < 0.5 ? 1.4 : 0}px)`,
            translate: `${pointer.x * 18 * f.depth}px ${pointer.y * 14 * f.depth}px`,
          }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={
            reduced
              ? { opacity: 0.5, scale: 1 }
              : {
                  opacity: [0, 0.75, 0.75, 0],
                  scale: [0.7, 1, 1, 0.8],
                  y: [0, -34, 12, -20],
                  x: [0, f.drift * 0.4, f.drift, f.drift * 0.5],
                  rotate: [0, f.drift > 0 ? 12 : -12, 0],
                }
          }
          transition={{
            duration: f.duration,
            delay: f.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileTap={{ scale: 1.35 }}
        >
          <span>{f.emoji}</span>
          {bubble?.id === f.id && (
            <span className="mal glass absolute left-1/2 top-full z-10 mt-2 w-max max-w-[16rem] -translate-x-1/2 rounded-2xl px-3 py-2 text-xs text-foreground">
              {bubble.text}
            </span>
          )}
        </motion.button>
      ))}
    </div>
  );
}
