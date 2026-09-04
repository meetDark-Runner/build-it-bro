import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Persona } from "@/types";
import { fallbackPersona, fallbackText } from "./fallback";
import { callAI, parseJson, PERSONA_SYSTEM, type Msg } from "./ai.server";

const analyzeInput = z.object({
  kind: z.enum(["image", "video", "audio"]),
  fileName: z.string().max(300).optional(),
  mimeType: z.string().max(120).optional(),
  size: z.number().optional(),
  dataUrl: z.string().optional(),
  hint: z.string().max(300).optional(),
});

function personaFrom(raw: string, fallbackHint?: string): Persona {
  const p = parseJson<Persona>(raw);
  const base = fallbackPersona(fallbackHint);
  return {
    ...base,
    ...p,
    traits: p.traits?.length ? p.traits : base.traits,
    strengths: p.strengths?.length ? p.strengths : base.strengths,
    weaknesses: p.weaknesses?.length ? p.weaknesses : base.weaknesses,
    innerThoughts: p.innerThoughts?.length ? p.innerThoughts : base.innerThoughts,
    scores: { ...base.scores, ...(p.scores ?? {}) },
  };
}

export const analyzeUpload = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => analyzeInput.parse(d))
  .handler(async ({ data }): Promise<{ persona: Persona; degraded: boolean }> => {
    const label = data.hint ?? data.fileName ?? data.kind;
    try {
      const content: Exclude<Msg["content"], string> = [];
      if (data.kind === "image" && data.dataUrl) {
        content.push({
          type: "text",
          text: `Look at this image. Identify what it actually is (anything at all — object, food, animal, place, screenshot, meme, person, vehicle...) and invent a full fictional personality for it. If it shows a real person, keep it about vibes/energy only and stay kind.`,
        });
        content.push({ type: "image_url", image_url: { url: data.dataUrl } });
      } else if (data.kind === "video") {
        content.push({
          type: "text",
          text: `A user uploaded a VIDEO (file name: "${data.fileName ?? "unknown"}", type: ${data.mimeType ?? "video"}, size: ${Math.round((data.size ?? 0) / 1024)}KB). You could not watch it properly, which is exactly on brand for a useless AI. Confidently invent the main character of this video, what is "happening" in it, and dramatic commentary. Put your dramatic interpretation of the "important frames" in backstory.`,
        });
      } else if (data.kind === "audio") {
        content.push({
          type: "text",
          text: `A user uploaded AUDIO (file name: "${data.fileName ?? "unknown"}", type: ${data.mimeType ?? "audio"}, size: ${Math.round((data.size ?? 0) / 1024)}KB). Pretend to "transcribe" it with a hilariously fake transcript inside backstory, then invent who/what this audio sounds like and its full personality.`,
        });
      } else {
        content.push({
          type: "text",
          text: `Invent a personality for: ${label}.`,
        });
      }

      const raw = await callAI(
        [
          { role: "system", content: PERSONA_SYSTEM },
          { role: "user", content },
        ],
        { json: true },
      );
      return { persona: personaFrom(raw, label), degraded: false };
    } catch {
      return { persona: fallbackPersona(data.kind === "image" ? undefined : label), degraded: true };
    }
  });

export const surpriseMe = createServerFn({ method: "POST" }).handler(
  async (): Promise<{ persona: Persona; degraded: boolean }> => {
    try {
      const raw = await callAI(
        [
          { role: "system", content: PERSONA_SYSTEM },
          {
            role: "user",
            content:
              "Nobody uploaded anything. Invent a completely random everyday thing (never a chair, never repeat the obvious) — like a Wi-Fi router with trust issues, a resigned spoon, a suspiciously intelligent coconut — and give it a full fictional personality. Be maximally random.",
          },
        ],
        { json: true },
      );
      return { persona: personaFrom(raw), degraded: false };
    } catch {
      return { persona: fallbackPersona(), degraded: true };
    }
  },
);

const modeInput = z.object({
  mode: z.enum([
    "roast",
    "compliment",
    "secret",
    "human",
    "meme",
    "courtroom",
    "dating",
    "linkedin",
    "horoscope",
    "resume",
  ]),
  persona: z.string().max(4000),
  memeStyle: z.string().max(40).optional(),
});

const MODE_PROMPT: Record<string, string> = {
  roast: "Write a fresh harmless roast of this thing (2-3 sentences, Manglish).",
  compliment: "Write an unnecessarily emotional compliment for this thing (2-3 sentences, Manglish).",
  secret: "Reveal a brand new ridiculous secret it does at night when nobody is watching. Start with a line like “At night, when nobody is watching...” then the secret.",
  human: "Describe what this thing would be like as a human: job, habits, group-chat behaviour, red flags. 3-4 sentences.",
  meme: "Write meme text as exactly two UPPERCASE lines separated by ' / ' (top / bottom). Nothing else.",
  courtroom: "Write a courtroom case: 'THE PEOPLE vs <name>'. Give CRIME, EVIDENCE, DEFENSE, VERDICT as 4 short labelled lines.",
  dating: "Write a ridiculous dating profile: bio, looking for, deal breakers, green flag. Short labelled lines.",
  linkedin: "Write a cringe fake LinkedIn profile: headline, about, skills, #hashtags. Short labelled lines.",
  horoscope: "Write an absurd horoscope for today for this thing: prediction, warning, lucky number, lucky snack. Short labelled lines.",
  resume: "Write a ridiculous resume: OBJECTIVE, EXPERIENCE, SKILLS, REFERENCES. Short labelled lines.",
};

export const generateExtra = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => modeInput.parse(d))
  .handler(async ({ data }): Promise<{ text: string; degraded: boolean }> => {
    try {
      const style = data.memeStyle ? ` Meme personality style: ${data.memeStyle}.` : "";
      const text = await callAI([
        { role: "system", content: PERSONA_SYSTEM.split("Reply with ONLY")[0] },
        {
          role: "user",
          content: `Here is the character:\n${data.persona}\n\nTask: ${MODE_PROMPT[data.mode]}${style}\nReply with plain text only, no JSON, no markdown.`,
        },
      ]);
      return { text: text.trim(), degraded: false };
    } catch {
      return { text: fallbackText(data.mode), degraded: true };
    }
  });

const chatInput = z.object({
  persona: z.string().max(4000),
  history: z
    .array(z.object({ role: z.enum(["user", "character"]), text: z.string().max(1200) }))
    .max(20),
  message: z.string().min(1).max(600),
});

export const chatWithCharacter = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => chatInput.parse(d))
  .handler(async ({ data }): Promise<{ text: string; degraded: boolean }> => {
    try {
      const msgs: Msg[] = [
        {
          role: "system",
          content: `${PERSONA_SYSTEM.split("Reply with ONLY")[0]}
You ARE this character now. Stay fully in character, never mention being an AI model. Reply in 1-3 short sentences of Manglish humour. Be dramatic, harmless, unhelpful.

CHARACTER:
${data.persona}`,
        },
        ...data.history.map<Msg>((t) => ({
          role: t.role === "user" ? "user" : "assistant",
          content: t.text,
        })),
        { role: "user", content: data.message },
      ];
      const text = await callAI(msgs);
      return { text: text.trim(), degraded: false };
    } catch {
      return { text: fallbackText("chat"), degraded: true };
    }
  });
