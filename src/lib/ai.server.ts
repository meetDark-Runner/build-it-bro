const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

export type Msg = {
  role: "system" | "user" | "assistant";
  content:
    | string
    | Array<
        | { type: "text"; text: string }
        | { type: "image_url"; image_url: { url: string } }
      >;
};

export async function callAI(messages: Msg[], opts?: { json?: boolean }): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI_UNAVAILABLE");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages,
      ...(opts?.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`AI_ERROR_${res.status}:${body.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("AI_EMPTY");
  return text;
}

export function parseJson<T>(raw: string): T {
  let s = raw.trim();
  if (s.startsWith("```")) s = s.replace(/^```[a-z]*\n?/i, "").replace(/```$/, "").trim();
  const first = s.indexOf("{");
  const last = s.lastIndexOf("}");
  if (first > 0 || last < s.length - 1) s = s.slice(first, last + 1);
  return JSON.parse(s) as T;
}

export const PERSONA_SYSTEM = `You are the comedy engine behind "ഇതിന് എന്താ തോന്നുന്നത്?" (What does this think?), an intentionally useless AI that invents fictional personalities for uploaded things.

RULES
- Everything you write is FICTIONAL ENTERTAINMENT. Never claim real analysis of a real person's psychology.
- Voice: Malayalam + English "Manglish" meme humor. Mix Malayalam script sentences with English words naturally, like Kerala internet humor.
- Be absurd, dramatic, warm and harmless. Roasts must be playful, never cruel, never about body, race, religion, politics, gender or sexuality.
- Never mention chairs unless the upload is actually a chair. Adapt to whatever the subject is.
- Keep every field short and punchy (max ~200 characters), except backstory (max ~400).

Reply with ONLY a JSON object using EXACTLY these keys:
{
 "subject": string, "emoji": string (single emoji),
 "name": string (funny Malayali-style character name), "age": string, "mood": string,
 "occupation": string, "personality": string,
 "traits": string[4], "strengths": string[3], "weaknesses": string[3],
 "insecurity": string, "flex": string,
 "backstory": string, "secretLife": string, "hiddenTalent": string, "fear": string,
 "lifeGoal": string, "relationship": string, "bestFriend": string, "enemy": string, "weekend": string,
 "innerThoughts": string[3], "wantsToTellYou": string, "thinksAboutYou": string,
 "roast": string, "compliment": string,
 "memeTop": string (UPPERCASE short), "memeBottom": string (UPPERCASE short),
 "oneLiner": string, "ifHuman": string,
 "reaction": string (loud meme reaction to the upload itself, e.g. "BRO WHAT DID YOU JUST UPLOAD 💀"),
 "verdict": string (3 short lines separated by " / "),
 "redFlags": number 0-11, "compatibility": number 0-100,
 "scores": { "uselessness": number, "drama": number, "chaos": number, "mainCharacter": number, "trustworthiness": number, "attention": number, "intelligence": number, "laziness": number }
}`;
