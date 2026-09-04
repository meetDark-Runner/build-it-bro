import { motion } from "motion/react";

export interface Example {
  emoji: string;
  hint: string;
  name: string;
  personality: string;
  line: string;
}

export const EXAMPLES: Example[] = [
  {
    emoji: "📱",
    hint: "a phone at 3% battery",
    name: "അപ്പു",
    personality: "Overworked, still pretending",
    line: "“Instagram തുറക്കാൻ മറക്കില്ലല്ലോ.”",
  },
  {
    emoji: "🍌",
    hint: "a 4-day-old banana",
    name: "Bananettan",
    personality: "Dramatic, worried",
    line: "“ആരും എന്നെ serious ആയി എടുത്തിട്ടില്ല.”",
  },
  {
    emoji: "🐱",
    hint: "a cat that judges everyone",
    name: "Meow Meenakshi",
    personality: "Silent judgement",
    line: "“നീ എന്നെ upload ചെയ്തോ? 😐”",
  },
  {
    emoji: "💻",
    hint: "a laptop with 47 open tabs",
    name: "Laptop Lathika",
    personality: "Burnt out but loyal",
    line: "“Fan ശബ്ദം എന്റെ കരച്ചിലാണ്.”",
  },
  {
    emoji: "👟",
    hint: "a left shoe with relationship problems",
    name: "Shoe Shaji",
    personality: "Hopeless romantic",
    line: "“പാർട്ട്ണർ എവിടെയോ പോയി.”",
  },
  {
    emoji: "☕",
    hint: "a glass of chai",
    name: "ചായ ചന്ദ്രൻ",
    personality: "Wise, slightly bitter",
    line: "“ആദ്യം ചായ. ബാക്കി പിന്നെ.”",
  },
  {
    emoji: "🚗",
    hint: "a car running on fumes",
    name: "Car Kunjumon",
    personality: "Anxious achiever",
    line: "“Petrol ഇടാൻ മറന്നോ? Again?”",
  },
  {
    emoji: "🎒",
    hint: "a school bag that has seen things",
    name: "Bag Bhaskaran",
    personality: "Carries everything, says nothing",
    line: "“ഞാൻ എല്ലാം ചുമക്കുന്നു. Thanks ഇല്ല.”",
  },
];

export function ExampleGallery({ onPick }: { onPick: (e: Example) => void }) {
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          Nothing to upload? ഇത് ഒന്ന് try ചെയ്യ്
        </h2>
        <p className="text-sm text-muted-foreground">Tap a card to run a full demo instantly.</p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {EXAMPLES.map((e, i) => (
          <motion.button
            key={e.emoji}
            type="button"
            onClick={() => onPick(e)}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -6, rotate: i % 2 ? 1.2 : -1.2 }}
            className="glass rounded-3xl p-4 text-left transition-shadow hover:glow-primary"
          >
            <span className="text-3xl">{e.emoji}</span>
            <p className="mal font-display mt-3 text-base font-bold">{e.name}</p>
            <p className="mal mt-1 text-xs text-muted-foreground">{e.personality}</p>
            <p className="mal mt-2 text-xs italic">{e.line}</p>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
