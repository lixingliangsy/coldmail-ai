/**
 * Hand-rolled schema/validation for LLM pipeline output.
 * No external dependency (zod not installed in this product) — keeps typecheck green.
 * The spirit matches the Playbook L1/L3 contract: validate LLM JSON/text before
 * accepting it as a run artifact; never silently mock on invalid output.
 */

export interface StepValidation {
  ok: boolean
  error?: string
}

const MAX_WORDS = 4000

export function validateStepOutput(step: string, text: string): StepValidation {
  if (typeof text !== 'string') {
    return { ok: false, error: `Invalid output type for step "${step}"` }
  }
  const trimmed = text.trim()
  if (!trimmed) {
    return { ok: false, error: `Empty AI output for step "${step}"` }
  }
  const words = trimmed.split(/\s+/).length
  if (words > MAX_WORDS) {
    return { ok: false, error: `Output too long for step "${step}" (${words} words, max ${MAX_WORDS})` }
  }
  return { ok: true }
}

export interface FeedbackInput {
  runId: string
  type: 'thumbs_up' | 'thumbs_down' | 'correction'
  comment?: string
  approved?: boolean
}

export function validateFeedback(body: Partial<FeedbackInput>): StepValidation {
  if (!body.runId || typeof body.runId !== 'string') {
    return { ok: false, error: 'runId is required' }
  }
  const allowed = ['thumbs_up', 'thumbs_down', 'correction']
  if (!body.type || !allowed.includes(body.type)) {
    return { ok: false, error: 'type must be thumbs_up | thumbs_down | correction' }
  }
  return { ok: true }
}

// --- GEO JSON-LD helpers (server-side Head injection) ---
export interface FaqItem {
  question: string
  answer: string
}

export interface HowToStep {
  name: string
  text: string
}

export function buildFaqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.answer,
      },
    })),
  }
}

export function buildHowToJsonLd(name: string, steps: HowToStep[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  }
}
