import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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

export function BonusDifficultGroups({
  onPickDynamic,
}: {
  onPickDynamic: (slug: string) => void
}) {
  const [query, setQuery] = React.useState("")

  const list = React.useMemo(() => {
    const base = dynamics
      .filter((d) => d.energyLevel === "baixo" || d.difficultyLevel === "fácil")
      .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || Number(b.isEmergency) - Number(a.isEmergency))

    const q = normalize(query)
    if (!q) return base.slice(0, 20)

    const filtered = base.filter((d) => {
      const haystack = normalize([d.title, d.summary, d.objective, d.verse].join(" "))
      return haystack.includes(q)
    })

    return filtered.slice(0, 20)
  }, [query])

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-base font-semibold">Dinâmicas para Grupos Difíceis</h2>
        <p className="text-sm text-muted-foreground">Estratégias para ajudar o grupo a destravar e participar.</p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Foco</Badge>
              <span className="text-sm font-medium">Energia baixa + prática fácil</span>
            </div>
            <p className="text-xs text-muted-foreground">{list.length} sugestões</p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-[360px]">
            <Input value={query} placeholder="Ex.: disperso, tímido, ansiedade..." onChange={(e) => setQuery(e.target.value)} />
            <Button variant="outline" onClick={() => setQuery("")}>
              Limpar
            </Button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {list.length ? (
            list.map((d) => <DynamicCard key={d.slug} dynamic={d} onSelect={onPickDynamic} />)
          ) : (
            <div className="text-sm text-muted-foreground">Nada encontrado com esse termo.</div>
          )}
        </div>
      </Card>
    </div>
  )
}

