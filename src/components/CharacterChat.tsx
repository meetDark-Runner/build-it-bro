import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useServerFn } from "@tanstack/react-start";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatWithCharacter } from "@/lib/ai.functions";
import { personaSummary } from "@/components/ActionDeck";
import type { ChatTurn, Persona } from "@/types";

const STARTERS = [
  "Why are you so lazy?",
  "Do you like me?",
  "What's your biggest secret?",
  "Who is your enemy?",
];

export function CharacterChat({ persona }: { persona: Persona }) {
  const send = useServerFn(chatWithCharacter);
  const [turns, setTurns] = useState<ChatTurn[]>([
    { role: "character", text: persona.wantsToTellYou },
  ]);
  const [value, setValue] = useState("");
  const [typing, setTyping] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, typing]);

  const ask = async (message: string) => {
    const text = message.trim();
    if (!text || typing) return;
    const history = turns.slice(-10);
    setTurns((t) => [...t, { role: "user", text }]);
    setValue("");
    setTyping(true);
    try {
      const res = await send({ data: { persona: personaSummary(persona), history, message: text } });
      setTurns((t) => [...t, { role: "character", text: res.text }]);
    } catch {
      setTurns((t) => [
        ...t,
        { role: "character", text: "🫠 “ഞാൻ ഇപ്പോൾ emotionally offline ആണ്. പിന്നെ ചോദിക്ക്.”" },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="glass rounded-3xl p-5 sm:p-7">
      <div className="flex items-center gap-3">
        <div className="grid size-11 place-items-center rounded-2xl bg-muted text-xl">
          {persona.emoji || "🧠"}
        </div>
        <div>
          <h3 className="font-display text-lg font-bold">🗣️ Talk to {persona.name}</h3>
          <p className="text-xs text-muted-foreground">
            {typing ? "typing... ആലോചിക്കുന്നു" : "online, unwillingly"}
          </p>
        </div>
      </div>

      <div ref={boxRef} className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {turns.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={t.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <p
                className={`mal max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  t.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-muted/60 text-foreground"
                }`}
              >
                {t.text}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <div className="flex justify-start">
            <div className="flex gap-1 rounded-2xl border border-border bg-muted/60 px-4 py-3">
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  className="size-2 rounded-full bg-muted-foreground"
                  animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {STARTERS.map((s) => (
          <Button key={s} size="sm" variant="secondary" onClick={() => void ask(s)} disabled={typing}>
            {s}
          </Button>
        ))}
      </div>

      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void ask(value);
        }}
      >
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="എന്തെങ്കിലും ചോദിക്ക്..."
          className="mal"
          maxLength={400}
        />
        <Button type="submit" disabled={typing || !value.trim()}>
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}
