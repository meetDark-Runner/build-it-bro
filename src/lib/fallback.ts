import type { Persona } from "@/types";

const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const num = (min: number, max: number) => Math.floor(min + Math.random() * (max - min));

const SUBJECTS = [
  { subject: "ഒരു ചായ ഗ്ലാസ്", emoji: "☕", name: "ചായ ചന്ദ്രൻ", job: "Emotional support beverage" },
  { subject: "A slightly tired banana", emoji: "🍌", name: "Bananettan", job: "Getting eaten professionally" },
  { subject: "A Wi-Fi router with trust issues", emoji: "📶", name: "Router Ravi", job: "Part-time signal, full-time drama" },
  { subject: "A suspiciously intelligent coconut", emoji: "🥥", name: "Coconut Kuttappan", job: "Freelance philosopher" },
  { subject: "A phone at 3% battery", emoji: "📱", name: "അപ്പു", job: "Professional procrastination device" },
  { subject: "One retired kitchen spoon", emoji: "🥄", name: "Spoon Soman", job: "Resigned from your kitchen" },
  { subject: "A cat that judges everyone", emoji: "🐱", name: "Meow Meenakshi", job: "Chief Judgement Officer" },
  { subject: "A left shoe with relationship problems", emoji: "👟", name: "Shoe Shaji", job: "Waiting for its partner" },
];

const THOUGHTS = [
  "“നീ എന്നെ upload ചെയ്തോ? 😐 എനിക്ക് consent ചോദിച്ചില്ലല്ലോ.”",
  "“ഞാൻ ഇപ്പോഴും ആലോചിക്കുന്നു... എന്തിനാ ഞാൻ ഇവിടെ?”",
  "“Bro respectfully, നിനക്ക് വേറെ പണിയില്ലേ?”",
  "“ഈ analysis എനിക്ക് വേണ്ടിയായിരുന്നില്ല. നിനക്ക് വേണ്ടിയായിരുന്നു.”",
  "“I am not lazy. I am energy efficient.”",
];

export function fallbackPersona(hint?: string): Persona {
  const s = pick(SUBJECTS);
  return {
    subject: hint ? `${hint} (offline reading)` : s.subject,
    emoji: s.emoji,
    name: s.name,
    age: `${num(2, 41)} ${pick(["days", "വർഷം", "months", "emotional years"])}`,
    mood: pick(["Mentally exhausted", "Dramatically calm", "സന്തോഷം ആണെന്ന് നടിക്കുന്നു", "Chaotic but polite"]),
    occupation: s.job,
    personality: "Overworked but still pretending everything is fine",
    traits: ["Dramatic", "Loyal-ish", "അധികം സംസാരിക്കും", "Low battery energy"],
    strengths: ["Existing", "Being ignored gracefully", "Vibes"],
    weaknesses: ["Attention", "Mondays", "Direct sunlight"],
    insecurity: "“ആരും എന്നെ serious ആയി എടുക്കുന്നില്ല.”",
    flex: "Has survived 3 house shifts without a single scratch.",
    backstory:
      "2019-ൽ ഒരു ordinary ദിവസം ഈ ലോകത്തിലേക്ക് വന്നു. പിന്നെ ജീവിതം മുഴുവൻ കാത്തിരിപ്പായി. ഇപ്പോൾ ഒരു AI-യുടെ മുന്നിൽ നിന്ന് personality test കൊടുക്കുന്നു — ഇത് ആരും പ്രതീക്ഷിച്ചിരുന്നില്ല.",
    secretLife: "രാത്രിയിൽ, ആരും നോക്കാത്തപ്പോൾ, ഇത് നിന്റെ screen time report വായിക്കുന്നു. എന്നിട്ട് ചിരിക്കുന്നു.",
    hiddenTalent: "Can predict rain 4 minutes before it happens. Never tells anyone.",
    fear: "വീണ്ടും upload ചെയ്യപ്പെടുന്നത്",
    lifeGoal: "Retire early. Do nothing. Get respected for it.",
    relationship: "Complicated (with the charger)",
    bestFriend: "The nearest plastic cover",
    enemy: "Monday morning",
    weekend: "Lying down. Aggressively.",
    innerThoughts: [pick(THOUGHTS), pick(THOUGHTS), pick(THOUGHTS)],
    wantsToTellYou: "“ഒന്ന് വെറുതെ വിടാമോ? അല്ലെങ്കിൽ ഒരു meme ഉണ്ടാക്കി വിട്ടേക്ക്.”",
    thinksAboutYou: "“നീ നല്ല ആളാണ്. പക്ഷേ decisions എടുക്കുന്നത് പേടിപ്പിക്കുന്നതാണ്.”",
    roast: "നീ ഇത് upload ചെയ്തതിന് ഒരു കാരണവുമില്ല. അതാണ് ഏറ്റവും വലിയ roast.",
    compliment: "But honestly? നിനക്ക് നല്ല taste ഉണ്ട്. ഈ upload ഒരു art form ആണ്.",
    memeTop: "AI: WHAT IS THIS",
    memeBottom: "ME: PERSONALITY കൊടുക്ക് 😤",
    oneLiner: "Absolutely unnecessary, emotionally important.",
    ifHuman: "If this were human, it would be the friend who says “ഞാൻ 5 മിനിറ്റിൽ എത്തും” and arrives after 2 hours.",
    reaction: "💀 BRO WHAT DID YOU JUST UPLOAD",
    verdict: "Absolutely unnecessary. / Scientifically questionable. / Emotionally important.",
    redFlags: num(2, 9),
    compatibility: num(41, 98),
    scores: {
      uselessness: num(88, 100),
      drama: num(60, 99),
      chaos: num(55, 99),
      mainCharacter: num(50, 99),
      trustworthiness: num(11, 60),
      attention: num(70, 100),
      intelligence: num(20, 95),
      laziness: num(50, 100),
    },
  };
}

export function fallbackText(mode: string): string {
  const map: Record<string, string[]> = {
    roast: [
      "നിന്റെ gallery-ൽ ഇതിനേക്കാൾ നല്ല file ഇല്ലായിരുന്നോ? 💀",
      "Bro uploaded this with full confidence. That is the roast.",
    ],
    compliment: [
      "സത്യം പറഞ്ഞാൽ ഇത് ഒരു masterpiece ആണ്. ആർക്കും മനസ്സിലാകില്ല, അതാണ് art.",
      "You have main character taste. Questionable, but main character.",
    ],
    secret: [
      "രാത്രി 2 മണിക്ക് ഇത് നിന്റെ പഴയ chat-കൾ വായിക്കുന്നു. Judgement silent ആണ്.",
      "This thing has been planning its escape since Tuesday. It even has a bag ready.",
    ],
    human: [
      "മനുഷ്യനായിരുന്നെങ്കിൽ: group-ൽ ഒന്നും പറയാതെ എല്ലാം വായിക്കുന്ന ആ ഒരാൾ.",
      "As a human: would post gym stories but never go to the gym.",
    ],
    courtroom: [
      "THE PEOPLE vs THIS THING — Crime: existing loudly. Evidence: this upload. Defense: “ഞാൻ ഒന്നും ചെയ്തില്ല.” Verdict: Guilty, but adorable.",
    ],
    dating: [
      "27, emotionally unavailable, loves long charging sessions. Looking for someone who won't upload me to random websites.",
    ],
    linkedin: [
      "Results-driven professional | 5+ years of sitting still | Passionate about synergy and doing absolutely nothing | #blessed #openToWork",
    ],
    horoscope: [
      "ഇന്ന് നിന്റെ energy low ആണ്. Mercury retrograde അല്ല, നീ തന്നെയാണ് പ്രശ്നം. Lucky number: 3%.",
    ],
    resume: [
      "OBJECTIVE: To be left alone. EXPERIENCE: Professional existence (lifetime). SKILLS: Waiting, gravity, mild judgement. REFERENCES: The kitchen table.",
    ],
    meme: ["AI SAID: NO COMMENT / ME: ANALYZE IT ANYWAY 😤"],
    chat: [
      "“Angry അല്ല bro... ഞാൻ emotionally unavailable ആണ്. Difference മനസ്സിലാക്കണം.”",
      "“ആ ചോദ്യത്തിന് ഉത്തരം ഉണ്ട്. പക്ഷേ ഞാൻ പറയില്ല. Drama വേണം.”",
    ],
  };
  return pick(map[mode] ?? map.chat);
}
