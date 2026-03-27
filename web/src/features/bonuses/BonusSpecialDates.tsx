import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { DynamicCard } from "@/features/dynamics/DynamicCard"
import { dynamics } from "@/domain/dynamics"

function normalize(s: string): string {
  return (s ?? "")
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
}

const DEFAULT_DATE_KEYWORDS = [
  "natal",
  "pascoa",
  "maes",
  "congresso",
  "retiro",
  "especial",
]

function splitKeywords(input: string): string[] {
  return normalize(input)
    .split(/[\s,;]+/g)
    .map((x) => x.trim())
    .filter(Boolean)
}

function matchesAnyKeyword(dynamicText: string, keywords: string[]) {
  return keywords.some((k) => k && dynamicText.includes(k))
}

export function BonusSpecialDates({
  onPickDynamic,
}: {
  onPickDynamic: (slug: string) => void
}) {
  const [query, setQuery] = React.useState("")

  const list = React.useMemo(() => {
    const keywords = query.trim() ? splitKeywords(query) : DEFAULT_DATE_KEYWORDS

    const base = dynamics
      .map((d) => {
        const haystack = normalize(
          [d.title, d.summary, d.objective, d.verse, d.meetingType, d.audienceType, ...d.steps.map((s) => s.text)].join(" ")
        )
        const matched = matchesAnyKeyword(haystack, keywords)
        return { d, matched }
      })
      .filter((x) => x.matched)
      .map((x) => x.d)

    const sorted = base.sort(
      (a, b) => Number(b.isFeatured) - Number(a.isFeatured) || a.durationMinutes - b.durationMinutes
    )

    if (sorted.length >= 6) return sorted.slice(0, 12)

    // fallback: se a base temática não tiver bastante material, mostramos recomendações.
    const fallback = [...dynamics].filter((d) => d.isFeatured).sort((a, b) => a.durationMinutes - b.durationMinutes)
    return fallback.slice(0, 12)
  }, [query])

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-base font-semibold">Dinâmicas para Datas Especiais</h2>
        <p className="text-sm text-muted-foreground">
          Ideias que combinam com ocasiões que pedem algo mais temático.
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Temático</Badge>
              <Badge variant="outline">Natal/Páscoa/Retiro...</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Opcional: digite “Natal”, “Páscoa”, “Mães” etc.</p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-[360px]">
            <Input value={query} placeholder="Ex.: Natal, Páscoa, Congresso..." onChange={(e) => setQuery(e.target.value)} />
            <Button variant="outline" onClick={() => setQuery("")}>
              Usar sugestões
            </Button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {list.map((d) => (
            <DynamicCard key={d.slug} dynamic={d} onSelect={onPickDynamic} />
          ))}
        </div>
      </Card>
    </div>
  )
}

