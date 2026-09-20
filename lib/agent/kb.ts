import type { KbEntry } from "../support-kit/types";
export type { KbEntry };

export const KB: KbEntry[] = [
  {
    id: "what",
    title: "What ColdMail AI does",
    keywords: ["ColdMail AI", "coldmail-ai", "what", "product", "about", "Personalized cold emails that actually get replies"],
    body: "Personalized cold emails that actually get replies. ColdMail AI writes research-backed, personalized cold emails for founders and freelancers reaching prospects on LinkedIn, X, or email — with tone presets and follow-up variants, plus CAN-SPAM hygiene reminders.",
    source: "ColdMail AI product definition",
    tags: [],
  },
  {
    id: "features",
    title: "ColdMail AI features",
    keywords: ["features", "feature", "can", "does", "4-step workflow: brief → draft → compliance QA → confirm", "CAN-SPAM compliant drafts (unsubscribe + no deceptive subject)", "Personalized greeting (no generic 'Hi there')", "Tone presets (founder / formal / casual) + subject variants"],
    body: "ColdMail AI includes: 4-step workflow: brief → draft → compliance QA → confirm; CAN-SPAM compliant drafts (unsubscribe + no deceptive subject); Personalized greeting (no generic 'Hi there'); Tone presets (founder / formal / casual) + subject variants. It does not add capabilities that are not listed here.",
    source: "ColdMail AI feature list",
    tags: [],
  },
  {
    id: "pricing",
    title: "ColdMail AI pricing",
    keywords: ["price", "pricing", "plan", "cost", "billing", "subscription", "monthly", "yearly"],
    body: "Listed prices for ColdMail AI: $19/month and $190/year. Checkout uses the in-app checkout route. This assistant cannot change a subscription or issue a refund.",
    source: "ColdMail AI pricing fields",
    tags: [],
  },
  {
    id: "howto",
    title: "How to use ColdMail AI",
    keywords: ["how", "start", "use", "tool", "run", "Generate your cold message"],
    body: "Open ColdMail AI and use Generate your cold message. The form asks for: Recipient / Company; Why you're reaching out; Tone; Channel.",
    source: "ColdMail AI tool fields",
    tags: [],
  },
  {
    id: "faq-1",
    title: "What is ColdMail AI?",
    keywords: ["What", "is", "ColdMail", "AI?"],
    body: "A tool that generates research-backed, personalized cold emails for outbound.",
    source: "ColdMail AI FAQ",
    tags: [],
  },
  {
    id: "faq-2",
    title: "How is it personalized?",
    keywords: ["How", "is", "it", "personalized?"],
    body: "It uses prospect context instead of a generic blast template.",
    source: "ColdMail AI FAQ",
    tags: [],
  },
  {
    id: "faq-3",
    title: "What tones are available?",
    keywords: ["What", "tones", "are", "available?"],
    body: "Founder, formal, and casual tones, with subject-line variants.",
    source: "ColdMail AI FAQ",
    tags: [],
  },
  {
    id: "honesty",
    title: "What this assistant will not claim",
    keywords: ["legal", "advice", "guarantee", "demo", "human", "refund", "support"],
    body: "Answers about ColdMail AI are decision support only, not legal, tax, accessibility-certification, or compliance sign-off. This assistant does not invent integrations, SSO, CSV export, or Slack connections unless they are already in the product description. If live AI is unavailable, the product must not pretend a demo result is live. Say you want a human and leave an email if you need a person.",
    source: "ColdMail AI support policy",
    tags: ["compliance"],
  },
];

function normalize(s: string): string {
  return (s || "").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ");
}
function toWords(s: string): string[] {
  return normalize(s).split(/\s+/).map((w) => w.trim()).filter(Boolean);
}
function cjkBigrams(s: string): string[] {
  const grams: string[] = [];
  const han = /[\u4e00-\u9fff]/;
  for (const w of toWords(s)) {
    if (han.test(w) && w.length >= 2) {
      for (let i = 0; i < w.length - 1; i++) grams.push(w.slice(i, i + 2));
    }
  }
  return grams;
}
function scoreEntry(entry: KbEntry, query: string): number {
  const q = normalize(query);
  const qWords = new Set(toWords(q));
  const qGrams = new Set(cjkBigrams(q));
  let s = 0;
  for (const kw of entry.keywords) {
    const k = kw.toLowerCase();
    if (q.includes(k)) s += 3;
  }
  for (const tw of toWords(entry.title)) {
    if (qWords.has(tw)) s += 2;
  }
  const idx = normalize(entry.keywords.join(" ") + " " + entry.title + " " + entry.body.slice(0, 400));
  for (const g of qGrams) if (idx.includes(g)) s += 0.5;
  return s;
}

export interface RetrieveResult {
  entries: KbEntry[];
  topScore: number;
}

export function retrieve(query: string, topK = 4, entries: KbEntry[] = KB): RetrieveResult {
  const scored = entries
    .map((e) => ({ e, s: scoreEntry(e, query) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, topK);
  return { entries: scored.map((x) => x.e), topScore: scored.length ? scored[0].s : 0 };
}

export function isComplianceRelated(entries: KbEntry[]): boolean {
  return entries.some((e) => e.tags.includes("compliance"));
}
