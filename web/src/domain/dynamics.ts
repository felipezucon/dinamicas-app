import rawDynamics from "../../../dinamics.json"

export type DynamicMeetingType = string
export type DynamicAudienceType = string
export type DynamicEnergyLevel = string
export type DynamicDifficultyLevel = string

type DynamicRaw = {
  id: number
  title: string
  slug: string
  summary: string
  objective: string
  materials: string
  steps: string
  verse: string
  meeting_type: DynamicMeetingType
  audience_type: DynamicAudienceType
  min_people: number
  max_people: number
  duration_minutes: number
  energy_level: DynamicEnergyLevel
  difficulty_level: DynamicDifficultyLevel
  bonus_category_id: number | null
  is_emergency: boolean
  is_featured: boolean
  active: boolean
  created_at: string
  updated_at: string
}

export type DynamicStep = { n: number; text: string }

export type Dynamic = {
  id: number
  title: string
  slug: string
  summary: string
  objective: string
  materials: string[]
  steps: DynamicStep[]
  verse: string
  meetingType: DynamicMeetingType
  audienceType: DynamicAudienceType
  minPeople: number
  maxPeople: number
  durationMinutes: number
  energyLevel: DynamicEnergyLevel
  difficultyLevel: DynamicDifficultyLevel
  isEmergency: boolean
  isFeatured: boolean
}

function parseNumberedSteps(stepsRaw: string): DynamicStep[] {
  const normalized = stepsRaw.replace(/\r/g, "").trim()
  if (!normalized) return []

  // Captura blocos como: "1. texto ... 2. texto ..." (com suporte a quebras de linha).
  const re = /(\d+)\.\s*([\s\S]*?)(?=\n?\s*\d+\.\s*|$)/g
  const matches = Array.from(normalized.matchAll(re))
  return matches
    .map((m) => ({
      n: Number(m[1]),
      text: m[2].trim().replace(/\s+/g, " "),
    }))
    .filter((s) => Boolean(s.text))
}

function parseMaterials(materialsRaw: string): string[] {
  const normalized = (materialsRaw ?? "").trim()
  if (!normalized) return []
  if (/^nenhum$/i.test(normalized)) return ["Nenhum"]

  // A fonte parece vir como lista separada por vírgulas.
  const parts = normalized
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  return parts.length ? parts : [normalized]
}

export function normalizeDynamics(dynamics: DynamicRaw[]): Dynamic[] {
  return (dynamics ?? [])
    .filter((d) => d && d.active !== false)
    .map((d) => ({
      id: d.id,
      title: d.title,
      slug: d.slug,
      summary: d.summary,
      objective: d.objective,
      materials: parseMaterials(d.materials),
      steps: parseNumberedSteps(d.steps),
      verse: d.verse,
      meetingType: d.meeting_type,
      audienceType: d.audience_type,
      minPeople: d.min_people,
      maxPeople: d.max_people,
      durationMinutes: d.duration_minutes,
      energyLevel: d.energy_level,
      difficultyLevel: d.difficulty_level,
      isEmergency: d.is_emergency,
      isFeatured: d.is_featured,
    }))
}

export const dynamics: Dynamic[] = normalizeDynamics(rawDynamics as unknown as DynamicRaw[])

export function getDynamicBySlug(slug: string): Dynamic | undefined {
  return dynamics.find((d) => d.slug === slug)
}

export function getDynamicSlugs(): string[] {
  return dynamics.map((d) => d.slug)
}

export function getDynamicOptions() {
  const meetingTypes = Array.from(new Set(dynamics.map((d) => d.meetingType))).sort()
  const audienceTypes = Array.from(new Set(dynamics.map((d) => d.audienceType))).sort()
  const energyLevels = Array.from(new Set(dynamics.map((d) => d.energyLevel))).sort()
  const difficultyLevels = Array.from(
    new Set(dynamics.map((d) => d.difficultyLevel))
  ).sort()

  const durations = Array.from(new Set(dynamics.map((d) => d.durationMinutes)))
    .sort((a, b) => a - b)
    .filter((n) => Number.isFinite(n))

  return { meetingTypes, audienceTypes, energyLevels, difficultyLevels, durations }
}

