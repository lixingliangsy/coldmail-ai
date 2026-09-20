/**
 * Cold-outreach vertical rule pack (L3 moat).
 * Deterministic, rule-based checks that run on the LLM draft WITHOUT calling the model.
 * Based on CAN-SPAM Act requirements (FTC) and cold email best practices (reply.io, lemlist, Topo).
 */
export const RULESET_VERSION = '1.1.0'

export type RuleCategory = 'compliance' | 'personalization' | 'tone' | 'length' | 'deliverability'

export interface RuleResult {
  ruleId: string
  name: string
  passed: boolean
  message: string
  category: RuleCategory
}

export interface Rule {
  ruleId: string
  name: string
  category: RuleCategory
  check: (content: string, context?: Record<string, string>) => RuleResult
}

const wordCount = (s: string): number => s.trim().split(/\s+/).filter(Boolean).length

export const coldOutreachRules: Rule[] = [
  {
    ruleId: 'CANSPAM_UNSUBSCRIBE',
    name: 'CAN-SPAM unsubscribe mechanism',
    category: 'compliance',
    check: (content) => {
      const re = /\b(unsubscribe|opt[-\s]?out|remove me|manage preferences)\b/i
      const passed = re.test(content)
      return {
        ruleId: 'CANSPAM_UNSUBSCRIBE',
        name: 'CAN-SPAM unsubscribe mechanism',
        passed,
        message: passed
          ? 'Unsubscribe / opt-out language present (CAN-SPAM requirement).'
          : 'Missing unsubscribe / opt-out language required by CAN-SPAM Act §5.',
        category: 'compliance',
      }
    },
  },
  {
    ruleId: 'CANSPAM_PHYSICAL_ADDRESS',
    name: 'CAN-SPAM physical address',
    category: 'compliance',
    check: (content) => {
      const hasAddress = /(\d+\s+[A-Za-z][A-Za-z\s]*(Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Place|Pl|Suite|Ste|Unit|#)\b)/i.test(content) ||
        /(PO\s*Box\s*\d+)/i.test(content)
      const passed = hasAddress
      return {
        ruleId: 'CANSPAM_PHYSICAL_ADDRESS',
        name: 'CAN-SPAM physical address',
        passed,
        message: passed
          ? 'Valid physical postal address present (CAN-SPAM requirement).'
          : 'Missing physical address required by CAN-SPAM Act §4. Include street address, PO Box, or CMRA mailbox.',
        category: 'compliance',
      }
    },
  },
  {
    ruleId: 'CANSPAM_DECEPTIVE_HEADERS',
    name: 'No deceptive headers (From/Reply-To)',
    category: 'compliance',
    check: (content) => {
      const deceptiveSender = /\b(noreply|no[-_\s]?reply|do[-_\s]?not[-_\s]?reply|service|support|info|admin)\b/i.test(content)
      const passed = !deceptiveSender || /\b(From:|Sender:|Reply-To:)\s*[A-Za-z][A-Za-z\s]*<[^>]+>\b/i.test(content)
      return {
        ruleId: 'CANSPAM_DECEPTIVE_HEADERS',
        name: 'No deceptive headers (From/Reply-To)',
        passed,
        message: passed
          ? 'Sender identity appears legitimate and verifiable.'
          : 'From/Reply-To appears deceptive. Use a real sender name and verifiable address (CAN-SPAM Act §2).',
        category: 'compliance',
      }
    },
  },
  {
    ruleId: 'SUBJECT_PRESENT',
    name: 'Subject line present',
    category: 'deliverability',
    check: (content) => {
      const passed = /^\s*subject\s*:/im.test(content)
      return {
        ruleId: 'SUBJECT_PRESENT',
        name: 'Subject line present',
        passed,
        message: passed ? 'Subject line present.' : 'No "Subject:" line found.',
        category: 'deliverability',
      }
    },
  },
  {
    ruleId: 'SUBJECT_LENGTH',
    name: 'Subject line ≤ 50 characters',
    category: 'deliverability',
    check: (content) => {
      const match = content.match(/^\s*subject\s*:\s*(.+)$/im)
      const length = match ? match[1].length : 0
      const passed = length > 0 && length <= 50
      return {
        ruleId: 'SUBJECT_LENGTH',
        name: 'Subject line ≤ 50 characters',
        passed,
        message: passed ? `Subject length OK (${length} chars, ≤50).` : `Subject too long (${length} chars) — aim for ≤50 chars for mobile optimization.`,
        category: 'deliverability',
      }
    },
  },
  {
    ruleId: 'NO_DECEPTIVE_SUBJECT',
    name: 'No deceptive subject (Re:/Fwd: false prefixes)',
    category: 'compliance',
    check: (content) => {
      const deceptive = /^\s*subject\s*:\s*(re|fwd|fw)\b[:\s]/im.test(content)
      return {
        ruleId: 'NO_DECEPTIVE_SUBJECT',
        name: 'No deceptive subject (Re:/Fwd: false prefixes)',
        passed: !deceptive,
        message: deceptive
          ? 'Subject uses misleading "Re:/Fwd:" prefix (CAN-SPAM violation).'
          : 'Subject is not a misleading thread prefix.',
        category: 'compliance',
      }
    },
  },
  {
    ruleId: 'PERSONALIZATION_PLACEHOLDER',
    name: 'Personalized greeting (no generic "Hi there")',
    category: 'personalization',
    check: (content) => {
      const generic = /\bhi there\b/i.test(content)
      const hasName = /\b(hi|hello|dear)\s+[A-Z][a-z]+/i.test(content)
      const passed = !generic && hasName
      return {
        ruleId: 'PERSONALIZATION_PLACEHOLDER',
        name: 'Personalized greeting (no generic "Hi there")',
        passed,
        message: passed
          ? 'Greeting is personalized to a name.'
          : 'Generic greeting detected — personalize with the recipient name (reply.io best practice).',
        category: 'personalization',
      }
    },
  },
  {
    ruleId: 'AVOID_INEFFICIENT_OPENERS',
    name: 'Avoid inefficient openers',
    category: 'tone',
    check: (content) => {
      const inefficient = /\b(i hope this email finds you well|my name is|i wanted to reach out|i am writing to|just wanted to)/i.test(content)
      const passed = !inefficient
      return {
        ruleId: 'AVOID_INEFFICIENT_OPENERS',
        name: 'Avoid inefficient openers',
        passed,
        message: passed
          ? 'Direct, value-focused opener — respects recipient time.'
          : 'Inefficient opener detected. Start with a personalized observation or value statement (Topo research).',
        category: 'tone',
      }
    },
  },
  {
    ruleId: 'TONE_CONSISTENCY',
    name: 'Non-salesy, honest tone',
    category: 'tone',
    check: (content) => {
      const salesy = /\b(100%\s*(guaranteed|free)|act now|limited time|buy now|click here now|revolutionize|amazing|best ever|unlimited|instant)\b/i.test(content)
      const passed = !salesy
      return {
        ruleId: 'TONE_CONSISTENCY',
        name: 'Non-salesy, honest tone',
        passed,
        message: passed
          ? 'No spammy or over-promising phrasing detected.'
          : 'Contains salesy/over-promising language — keep tone honest and professional.',
        category: 'tone',
      }
    },
  },
  {
    ruleId: 'VALUE_FIRST_CTA',
    name: 'Offers value before asking for commitment',
    category: 'tone',
    check: (content) => {
      const directAsk = /\b(do you have (a|15|10|20|30)\s*min|hop on a call|grab a quick call|can we chat\?|schedule a demo|book a meeting)\b/i.test(content)
      const valueSignal = /\b(help|improve|solve|reduce|increase|save|idea|insight|resource)\b/i.test(content)
      const passed = !directAsk || (directAsk && valueSignal)
      return {
        ruleId: 'VALUE_FIRST_CTA',
        name: 'Offers value before asking for commitment',
        passed,
        message: passed
          ? 'Value proposition precedes or accompanies the CTA.'
          : 'Direct meeting/call request without prior value proposition — offer value first (lemlist best practice).',
        category: 'tone',
      }
    },
  },
  {
    ruleId: 'LENGTH_LIMIT',
    name: 'Cold email length 50-125 words',
    category: 'length',
    check: (content) => {
      const n = wordCount(content)
      const passed = n >= 50 && n <= 125
      return {
        ruleId: 'LENGTH_LIMIT',
        name: 'Cold email length 50-125 words',
        passed,
        message: passed ? `Length optimal (${n} words, 50-125).` : n < 50 ? `Too short (${n} words) — needs more value (50-125 words optimal).` : `Too long (${n} words) — trim to 50-125 words (Topo/Boomerang research).`,
        category: 'length',
      }
    },
  },
  {
    ruleId: 'NO_ALLCAPS_SPAM',
    name: 'Minimal ALL-CAPS words',
    category: 'deliverability',
    check: (content) => {
      const capsWords = (content.match(/\b[A-Z]{4,}\b/g) || []).length
      const passed = capsWords <= 2
      return {
        ruleId: 'NO_ALLCAPS_SPAM',
        name: 'Minimal ALL-CAPS words',
        passed,
        message: passed
          ? `ALL-CAPS words within limit (${capsWords}).`
          : `Too many ALL-CAPS words (${capsWords}) — triggers spam filters (Gmail/Yahoo).`,
        category: 'deliverability',
      }
    },
  },
]

export function runAllRules(content: string, context?: Record<string, string>): RuleResult[] {
  return coldOutreachRules.map(rule => rule.check(content, context))
}

export function getRulesByCategory(category: RuleCategory): Rule[] {
  return coldOutreachRules.filter(r => r.category === category)
}

// Sources reinforced 2026-07-20 — see SOURCES.md

export type RuleHit = { id: string; title: string; severity: 'low' | 'medium' | 'high'; passed: boolean; remediation?: string; ref?: string }
export function runDeterministicChecks(inputs: Record<string, string>): RuleHit[] {
  const blob = Object.values(inputs || {}).join('\n')
  return runAllRules(blob).map((r: any) => ({
    id: String(r.id || r.ruleId || 'R'),
    title: String(r.name || r.title || 'check'),
    severity: (r.severity as 'low' | 'medium' | 'high') || 'medium',
    passed: !!r.passed,
    remediation: r.message || r.remediation,
    ref: r.ref || r.source,
  }))
}
