import fs from 'fs'
import path from 'path'
import type { RunState } from './pipeline'

/**
 * Server-only run persistence for the coldmail-ai pipeline.
 * Kept separate from lib/pipeline.ts (which is imported by the client landing
 * page) so `fs`/`path` are never bundled into client code.
 */

function runsDir(): string {
  const dir = path.join(process.cwd(), '.data', 'runs')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  return dir
}

export function saveRun(state: RunState): void {
  const p = path.join(runsDir(), `${state.runId}.json`)
  fs.writeFileSync(p, JSON.stringify(state, null, 2), 'utf8')
}

export function loadRun(runId: string): RunState | null {
  const p = path.join(runsDir(), `${runId}.json`)
  try {
    const raw = fs.readFileSync(p, 'utf8')
    return JSON.parse(raw) as RunState
  } catch {
    return null
  }
}

export function listRuns(limit: number = 50): RunState[] {
  const dir = runsDir()
  try {
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.json'))
      .sort((a, b) => b.localeCompare(a))
      .slice(0, limit)

    return files.map((f) => {
      const p = path.join(dir, f)
      const raw = fs.readFileSync(p, 'utf8')
      return JSON.parse(raw) as RunState
    })
  } catch {
    return []
  }
}
