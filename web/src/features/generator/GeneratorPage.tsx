import * as React from "react"
import { Sparkles, CheckCircle2, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"

import { DynamicCard } from "@/features/dynamics/DynamicCard"
import { dynamics, getDynamicOptions } from "@/domain/dynamics"
import { recommendDynamic, type GeneratorFilters } from "@/features/engine/recommendation"

function OptionOrNull({
  value,
  allowNull = true,
}: {
  value: string | null
  allowNull?: boolean
}) {
  return value ?? (allowNull ? null : "")
}

function toNumberOrNull(v: string): number | null {
  const n = Number(v)
  if (!Number.isFinite(n)) return null
  if (n <= 0) return null
  return n
}

export function GeneratorPage({
  onOpenDetail,
}: {
  onOpenDetail: (slug: string) => void
}) {
  const opts = React.useMemo(() => getDynamicOptions(), [])

  const [filters, setFilters] = React.useState<GeneratorFilters>({
    meetingType: null,
    audienceType: null,
    timeAvailableMinutes: null,
    peopleCount: null,
    energyLevel: null,
    difficultyLevel: null,
    keyword: null,
  })

  const [result, setResult] = React.useState<ReturnType<typeof recommendDynamic> | null>(null)

  function runRecommendation() {
    const r = recommendDynamic(dynamics, filters)
    setResult(r)
  }

  return (
    <div className="flex w-full flex-col gap-7">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold leading-tight sm:text-3xl">Gerador de Dinâmicas Cristãs</h1>
        <p className="text-base text-muted-foreground">
          Filtre em 30 segundos e receba uma dinâmica pronta para aplicar.
        </p>
      </div>

      <div className="grid gap-7 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5" />
                <h2 className="text-base font-semibold">Seus filtros</h2>
              </div>
              <p className="text-base text-muted-foreground">Escolha o cenário e deixe o app sugerir.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-5">
            <div className="grid gap-2">
              <label className="text-base font-medium" htmlFor="meetingType">
                Tipo de encontro
              </label>
              <Select
                value={filters.meetingType ?? "any"}
                onValueChange={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    meetingType: OptionOrNull({ value: v === "any" ? null : v }),
                  }))
                }
              >
                <SelectTrigger id="meetingType">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Qualquer</SelectItem>
                  {opts.meetingTypes.map((mt) => (
                    <SelectItem key={mt} value={mt}>
                      {mt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label className="text-base font-medium" htmlFor="audienceType">
                Público
              </label>
              <Select
                value={filters.audienceType ?? "any"}
                onValueChange={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    audienceType: OptionOrNull({ value: v === "any" ? null : v }),
                  }))
                }
              >
                <SelectTrigger id="audienceType">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Qualquer</SelectItem>
                  {opts.audienceTypes.map((at) => (
                    <SelectItem key={at} value={at}>
                      {at}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label className="text-base font-medium" htmlFor="timeAvailableMinutes">
                Tempo disponível (min)
              </label>
              <Select
                value={filters.timeAvailableMinutes == null ? "any" : String(filters.timeAvailableMinutes)}
                onValueChange={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    timeAvailableMinutes: v === "any" ? null : Number(v),
                  }))
                }
              >
                <SelectTrigger id="timeAvailableMinutes">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Qualquer</SelectItem>
                  {opts.durations.map((d) => (
                    <SelectItem key={d} value={String(d)}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label className="text-base font-medium" htmlFor="peopleCount">
                Quantidade de pessoas
              </label>
              <Input
                id="peopleCount"
                inputMode="numeric"
                placeholder="Ex.: 12"
                value={filters.peopleCount == null ? "" : String(filters.peopleCount)}
                onChange={(e) => {
                  const n = toNumberOrNull(e.target.value)
                  setFilters((prev) => ({ ...prev, peopleCount: n }))
                }}
              />
              <p className="text-sm text-muted-foreground">A dinâmica precisa “caber” no intervalo min–max.</p>
            </div>

            <Separator />

            <Accordion type="single" collapsible>
              <AccordionItem value="advanced">
                <AccordionTrigger>Opções avançadas</AccordionTrigger>
                <AccordionContent>
                  <div className="mt-3 grid gap-4">
                    <div className="grid gap-2">
                      <label className="text-base font-medium" htmlFor="energyLevel">
                        Energia
                      </label>
                      <Select
                        value={filters.energyLevel ?? "any"}
                        onValueChange={(v) =>
                          setFilters((prev) => ({
                            ...prev,
                            energyLevel: v === "any" ? null : v,
                          }))
                        }
                      >
                        <SelectTrigger id="energyLevel">
                          <SelectValue placeholder="Qualquer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Qualquer</SelectItem>
                          {opts.energyLevels.map((el) => (
                            <SelectItem key={el} value={el}>
                              {el}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <label className="text-base font-medium" htmlFor="difficultyLevel">
                        Dificuldade
                      </label>
                      <Select
                        value={filters.difficultyLevel ?? "any"}
                        onValueChange={(v) =>
                          setFilters((prev) => ({
                            ...prev,
                            difficultyLevel: v === "any" ? null : v,
                          }))
                        }
                      >
                        <SelectTrigger id="difficultyLevel">
                          <SelectValue placeholder="Qualquer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Qualquer</SelectItem>
                          {opts.difficultyLevels.map((dl) => (
                            <SelectItem key={dl} value={dl}>
                              {dl}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <label className="text-base font-medium" htmlFor="keyword">
                        Palavra-chave (opcional)
                      </label>
                      <Input
                        id="keyword"
                        placeholder="Ex.: unidade, confiança, luz, perdão..."
                        value={filters.keyword ?? ""}
                        onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value || null }))}
                      />
                      <p className="text-sm text-muted-foreground">A busca procura em título, resumo, objetivo e versículo.</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button onClick={runRecommendation}>
              Gerar recomendação
            </Button>
          </div>
        </Card>

        <div className="flex flex-col gap-5">
          <Card className="p-5 sm:p-6">
            <h2 className="text-base font-semibold">Recomendação</h2>
            <p className="mt-1 text-base text-muted-foreground">
              {result ? "Veja a dinâmica sugerida e as alternativas." : "Preencha os filtros e clique em “Gerar recomendação”."}
            </p>

            {result?.recommended ? (
              <div className="mt-4 space-y-4">
                <DynamicCard
                  dynamic={result.recommended}
                  highlight
                  onSelect={(slug) => onOpenDetail(slug)}
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold">Por que essa dinâmica</div>
                    <Badge variant="outline">Aderência</Badge>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {result.explanation.map((r) => (
                      <div key={r.key} className="flex items-center justify-between gap-3 rounded-lg border border-subtle px-3 py-2">
                        <span className="text-sm text-muted-foreground">{r.label}</span>
                        <span className={r.matched ? "text-status-success" : "text-muted-foreground"}>
                          {r.matched ? <CheckCircle2 className="inline size-4" /> : <XCircle className="inline size-4" />}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-semibold">Alternativas</div>
                  <div className="grid gap-3">
                    {result.alternatives.map((alt) => (
                      <DynamicCard key={alt.slug} dynamic={alt} onSelect={(slug) => onOpenDetail(slug)} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-2">
                <Badge variant="secondary">Dica</Badge>
                <p className="text-sm text-muted-foreground">
                  Se você não definir tudo, o app relaxa critérios na ordem: palavra-chave, energia/dificuldade, pessoas, tempo e tipo/público.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

