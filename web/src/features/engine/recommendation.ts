import type { Dynamic } from "@/domain/dynamics"

export type GeneratorFilters = {
  meetingType?: string | null
  audienceType?: string | null
  timeAvailableMinutes?: number | null
  peopleCount?: number | null
  energyLevel?: string | null
  difficultyLevel?: string | null
  keyword?: string | null
}

function normalizeText(s: string): string {
  return (s ?? "")
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
}

function includesKeyword(dynamic: Dynamic, keywordRaw: string): boolean {
  const keyword = normalizeText(keywordRaw)
  if (!keyword) return true

  const haystack = [
    dynamic.title,
    dynamic.summary,
    dynamic.objective,
    dynamic.verse,
    dynamic.meetingType,
    dynamic.audienceType,
    ...dynamic.steps.map((s) => s.text),
    ...dynamic.materials,
  ]
    .map((x) => normalizeText(x))
    .join(" ")

  return haystack.includes(keyword)
}

type CandidateReason = {
  key: string
  label: string
  matched: boolean
}

function buildReasons(dynamic: Dynamic, filters: GeneratorFilters) {
  const reasons: CandidateReason[] = []

  const mt = filters.meetingType ?? null
  if (mt) reasons.push({ key: "meetingType", label: "tipo", matched: dynamic.meetingType === mt })

  const at = filters.audienceType ?? null
  if (at) reasons.push({ key: "audienceType", label: "público", matched: dynamic.audienceType === at })

  const time = filters.timeAvailableMinutes ?? null
  if (typeof time === "number" && Number.isFinite(time)) {
    reasons.push({
      key: "time",
      label: "tempo",
      matched: dynamic.durationMinutes <= time,
    })
  }

  const people = filters.peopleCount ?? null
  if (typeof people === "number" && Number.isFinite(people)) {
    reasons.push({
      key: "people",
      label: "pessoas",
      matched: dynamic.minPeople <= people && people <= dynamic.maxPeople,
    })
  }

  const energy = filters.energyLevel ?? null
  if (energy) reasons.push({ key: "energy", label: "energia", matched: dynamic.energyLevel === energy })

  const difficulty = filters.difficultyLevel ?? null
  if (difficulty)
    reasons.push({ key: "difficulty", label: "dificuldade", matched: dynamic.difficultyLevel === difficulty })

  const keyword = filters.keyword ?? null
  if (keyword) reasons.push({ key: "keyword", label: "tema/palavra", matched: includesKeyword(dynamic, keyword) })

  return reasons
}

function scoreCandidate(dynamic: Dynamic, filters: GeneratorFilters): number {
  let score = 0

  if (dynamic.isFeatured) score += 0.4

  const time = filters.timeAvailableMinutes ?? null
  if (typeof time === "number" && Number.isFinite(time)) {
    const gap = Math.max(0, time - dynamic.durationMinutes)
    const normalized = gap === 0 ? 1 : 1 / (1 + gap)
    score += 0.35 * normalized
  }

  const people = filters.peopleCount ?? null
  if (typeof people === "number" && Number.isFinite(people)) {
    if (dynamic.minPeople <= people && people <= dynamic.maxPeople) {
      const center = (dynamic.minPeople + dynamic.maxPeople) / 2
      const half = Math.max(1, (dynamic.maxPeople - dynamic.minPeople) / 2)
      const closeness = 1 - Math.min(1, Math.abs(people - center) / half)
      score += 0.2 * closeness
    }
  }

  if (filters.energyLevel && dynamic.energyLevel === filters.energyLevel) score += 0.15
  if (filters.difficultyLevel && dynamic.difficultyLevel === filters.difficultyLevel) score += 0.1

  const keyword = filters.keyword ?? null
  if (keyword) {
    const keywordN = normalizeText(keyword)
    if (normalizeText(dynamic.title).includes(keywordN)) score += 0.3
    else if (normalizeText(dynamic.objective).includes(keywordN)) score += 0.2
    else if (normalizeText(dynamic.summary).includes(keywordN)) score += 0.15
    else if (normalizeText(dynamic.steps.map((s) => s.text).join(" ")).includes(keywordN)) score += 0.1
    else if (normalizeText(dynamic.verse).includes(keywordN)) score += 0.05
  }

  return score
}

function applyHardFilters(dynamics: Dynamic[], filters: GeneratorFilters): Dynamic[] {
  return dynamics.filter((d) => {
    const mt = filters.meetingType ?? null
    if (mt && d.meetingType !== mt) return false

    const at = filters.audienceType ?? null
    if (at && d.audienceType !== at) return false

    const time = filters.timeAvailableMinutes ?? null
    if (typeof time === "number" && Number.isFinite(time) && time > 0) {
      if (d.durationMinutes > time) return false
    }

    const people = filters.peopleCount ?? null
    if (typeof people === "number" && Number.isFinite(people) && people > 0) {
      if (!(d.minPeople <= people && people <= d.maxPeople)) return false
    }

    const energy = filters.energyLevel ?? null
    if (energy && d.energyLevel !== energy) return false

    const difficulty = filters.difficultyLevel ?? null
    if (difficulty && d.difficultyLevel !== difficulty) return false

    const keyword = filters.keyword ?? null
    if (keyword && keyword.trim()) {
      if (!includesKeyword(d, keyword)) return false
    }

    return true
  })
}

function relaxFilters(filters: GeneratorFilters, step: number): GeneratorFilters {
  // Passos de relaxamento: keyword -> energia/dificuldade -> pessoas -> tempo -> tipo/público (por último)
  const f: GeneratorFilters = { ...filters }

  if (step >= 1) f.keyword = null
  if (step >= 2) {
    f.energyLevel = null
    f.difficultyLevel = null
  }
  if (step >= 3) f.peopleCount = null
  if (step >= 4) f.timeAvailableMinutes = null
  if (step >= 5) {
    f.meetingType = null
    f.audienceType = null
  }

  return f
}

export type RecommendationResult = {
  recommended: Dynamic | null
  alternatives: Dynamic[]
  explanation: CandidateReason[]
  debugAppliedFilters: Partial<GeneratorFilters>
}

export function recommendDynamic(dynamics: Dynamic[], filters: GeneratorFilters): RecommendationResult {
  const activeFilters = { ...filters }

  for (let step = 0; step <= 5; step++) {
    const relaxed = relaxFilters(activeFilters, step)
    const candidates = applyHardFilters(dynamics, relaxed)
    if (candidates.length > 0) {
      const sorted = [...candidates].sort((a, b) => scoreCandidate(b, relaxed) - scoreCandidate(a, relaxed))
      const recommended = sorted[0] ?? null
      const alternatives = sorted.slice(1, 5)
      const explanation = recommended ? buildReasons(recommended, filters) : []

      return {
        recommended,
        alternatives,
        explanation,
        debugAppliedFilters: relaxed,
      }
    }
  }

  return { recommended: null, alternatives: [], explanation: [], debugAppliedFilters: filters }
}

