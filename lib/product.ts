export interface InputField {
  key: string
  label: string
  type: 'input' | 'textarea' | 'select'
  placeholder?: string
  options?: string[]
}

export const PRODUCT = {
  name: "ColdMail AI",
  slug: "coldmail-ai",
  tagline: "Personalized cold emails that actually get replies",
  description: "AI-generated, research-backed cold emails for founders and freelancers reaching out to prospects on LinkedIn, X, or email.",
  toolTitle: "Generate your cold message",
  resultLabel: "Your draft",
  ctaLabel: "Generate email",
  features: [
  "Research-backed personalization",
  "Multiple tones (founder / formal / casual)",
  "Subject line variants",
  "Reply & follow-up generators"
],
  inputs: [
  {
    "key": "recipient",
    "label": "Recipient / Company",
    "type": "input",
    "placeholder": "e.g. Acme Corp \u2014 YC-backed dev-tools startup"
  },
  {
    "key": "context",
    "label": "Why you're reaching out",
    "type": "textarea",
    "placeholder": "e.g. I built an onboarding tool, want to offer a pilot to their growth team"
  },
  {
    "key": "tone",
    "label": "Tone",
    "type": "select",
    "options": [
      "Founder",
      "Formal",
      "Casual"
    ]
  },
  {
    "key": "channel",
    "label": "Channel",
    "type": "select",
    "options": [
      "Email",
      "LinkedIn DM",
      "X/Twitter DM"
    ]
  }
] as InputField[],
  systemPrompt: "You are an expert B2B cold-outreach copywriter. Write a short, personalized, non-salesy message based on the recipient info and context. Use the given tone and channel. Do NOT open with 'I hope this finds you well'. Do not ask for a meeting directly \u2014 offer value. Output only the message, no preamble.",
  pricing: [
  {
    "tier": "Free",
    "price": "$0",
    "desc": "3 emails/day, founder tone"
  },
  {
    "tier": "Starter",
    "price": "$19/mo",
    "desc": "300 emails, all tones, subject variants"
  },
  {
    "tier": "Pro",
    "price": "$49/mo",
    "desc": "Unlimited, follow-ups, API access"
  }
],
  mock: (inputs: Record<string, string>): string => {
  const r = inputs['recipient'] || 'your prospect'
  const c = inputs['context'] || 'your offer'
  const t = inputs['tone'] || 'Founder'
  const ch = inputs['channel'] || 'Email'
  return `Subject: quick idea for ${r}

Hi there,

I came across ${r} and really like how you're approaching the space. ${c}

I put together something small that might help — happy to send over a 2-min demo, no pitch attached.

Best,
[Your name]

---
(Tone: ${t} | Channel: ${ch} | This is a mock demo. Add OPENAI_API_KEY for real generation.)`
}
}
