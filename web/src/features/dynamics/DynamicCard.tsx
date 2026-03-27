import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Dynamic } from "@/domain/dynamics"

export function DynamicCard({
  dynamic,
  onSelect,
  highlight = false,
}: {
  dynamic: Dynamic
  onSelect?: (slug: string) => void
  highlight?: boolean
}) {
  const durationLabel = `${dynamic.durationMinutes} min`
  const peopleLabel = dynamic.minPeople === dynamic.maxPeople ? `${dynamic.minPeople}` : `${dynamic.minPeople}-${dynamic.maxPeople}`

  return (
    <Card
      className={[
        "flex flex-col gap-4",
        highlight ? "ring-2 ring-accent-primary/30" : "",
      ].join(" ")}
    >
      <div className="flex flex-wrap items-center gap-2">
        {dynamic.isFeatured ? (
          <Badge variant="secondary">Recomendado</Badge>
        ) : (
          <Badge variant="outline">Dinâmica</Badge>
        )}

        {dynamic.isEmergency ? <Badge variant="destructive">Emergência</Badge> : null}
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-lg font-semibold leading-tight">{dynamic.title}</div>
          <div className="mt-1.5 line-clamp-2 text-base text-muted-foreground">{dynamic.summary}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="ghost" className="bg-transparent">
          {dynamic.meetingType}
        </Badge>
        <Badge variant="ghost" className="bg-transparent">
          {durationLabel}
        </Badge>
        <Badge variant="ghost" className="bg-transparent">
          {peopleLabel} pessoas
        </Badge>
      </div>

      <div className="flex items-center justify-between gap-4 pt-1">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{dynamic.energyLevel}</Badge>
          <Badge variant="outline">{dynamic.difficultyLevel}</Badge>
        </div>

        {onSelect ? (
          <Button size="sm" onClick={() => onSelect(dynamic.slug)}>
            Ver detalhes
          </Button>
        ) : null}
      </div>
    </Card>
  )
}

