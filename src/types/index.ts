export type UploadKind = "image" | "video" | "audio";

export interface PersonaScores {
  uselessness: number;
  drama: number;
  chaos: number;
  mainCharacter: number;
  trustworthiness: number;
  attention: number;
  intelligence: number;
  laziness: number;
}

export interface Persona {
  subject: string;
  emoji: string;
  name: string;
  age: string;
  mood: string;
  occupation: string;
  personality: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  insecurity: string;
  flex: string;
  backstory: string;
  secretLife: string;
  hiddenTalent: string;
  fear: string;
  lifeGoal: string;
  relationship: string;
  bestFriend: string;
  enemy: string;
  weekend: string;
  innerThoughts: string[];
  wantsToTellYou: string;
  thinksAboutYou: string;
  roast: string;
  compliment: string;
  memeTop: string;
  memeBottom: string;
  oneLiner: string;
  ifHuman: string;
  reaction: string;
  verdict: string;
  redFlags: number;
  compatibility: number;
  scores: PersonaScores;
}

export type ExtraMode =
  | "roast"
  | "compliment"
  | "secret"
  | "human"
  | "meme"
  | "courtroom"
  | "dating"
  | "linkedin"
  | "horoscope"
  | "resume";

export interface ChatTurn {
  role: "user" | "character";
  text: string;
}
