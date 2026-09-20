export interface InputField {
  key: string
  label: string
  type: 'input' | 'text' | 'textarea' | 'select'
  placeholder?: string
  options?: string[]
}

export const PRODUCT = {
  name: "ColdMail AI",
  slug: "coldmail-ai",
  productId: "PROD_2eUDf5ZCP4D55Z8EcFOXnP",
  priceMonthly: 19,
  yearlyProductId: "PROD_04KISdERjOj11hJ8oA6Rwr",
  priceYearly: 190,

  checkoutUrl: "https://pancake.waffo.ai/store/lixingliang-ai-tools-6cilbw8v/checkout/cs_87cd25b8-bc87-bddd-19cf-c4557658b776",
  tagline: "Personalized cold emails that actually get replies",
  description: "AI-generated, research-backed cold emails for founders and freelancers reaching out to prospects on LinkedIn, X, or email.",
  toolTitle: "Generate your cold message",
  resultLabel: "Your draft",
  ctaLabel: "Generate email",
  features: [
  "4-step workflow: brief → draft → compliance QA → confirm",
  "CAN-SPAM compliant drafts (unsubscribe + no deceptive subject)",
  "Personalized greeting (no generic 'Hi there')",
  "Tone presets (founder / formal / casual) + subject variants"
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
  definitionLead: "ColdMail AI writes research-backed, personalized cold emails for founders and freelancers reaching prospects on LinkedIn, X, or email — with tone presets and follow-up variants, plus CAN-SPAM hygiene reminders.",
  geoFaq: [
    { q: "What is ColdMail AI?", a: "A tool that generates research-backed, personalized cold emails for outbound." },
    { q: "How is it personalized?", a: "It uses prospect context instead of a generic blast template." },
    { q: "What tones are available?", a: "Founder, formal, and casual tones, with subject-line variants." },
    { q: "Does it help with follow-ups?", a: "Yes — reply and follow-up generators keep the thread consistent." },
    { q: "Which channels does it cover?", a: "LinkedIn, X, and email with channel-appropriate phrasing." },
    { q: "Who should use it?", a: "Founders and freelancers who want reply-worthy emails without writing every variant by hand." },
  ],
  systemPrompt: "You are an expert B2B cold-outreach copywriter. Write a short, personalized, non-salesy message based on the recipient info and context. Use the given tone and channel. Do NOT open with 'I hope this finds you well'. Do not ask for a meeting directly \u2014 offer value. Output only the message, no preamble.",
  rulesetId: "cold-outreach-1.0",
  pipelineId: "coldmail-4step",
  pricing: [
  {
    "tier": "Free",
    "price": "$0",
    "desc": "1 workflow run / day · watermarked export"
  },
  {
    "tier": "Pro",
    "price": "$19/mo",
    "desc": "300 workflow runs / mo · audit log · export"
  },
  {
    "tier": "Enterprise",
    "price": "Custom",
    "desc": "SSO (roadmap) · BYOK · higher caps · shared rulesets"
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
