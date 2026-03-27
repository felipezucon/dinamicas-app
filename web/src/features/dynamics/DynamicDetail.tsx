import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Dynamic } from "@/domain/dynamics"

function formatPeople(dynamic: Dynamic): string {
  if (dynamic.minPeople === dynamic.maxPeople) return `${dynamic.minPeople}`
  return `${dynamic.minPeople}-${dynamic.maxPeople}`
}

function buildSpiritualApplication(dynamic: Dynamic): string {
  // Geração simples baseada no objetivo e no versículo (mantém o app “gerador” sem exigir campo adicional no JSON).
  const objective = dynamic.objective.trim()
  const verse = dynamic.verse.trim()
  return `Com base em “${objective}”, convide o grupo a identificar 1 área prática da semana para viver essa verdade. Em seguida, leia ou cite ${verse} como reforço e finalize com 1 pergunta: “O que você vai colocar em prática a partir de hoje?”`
}

export function DynamicDetail({
  dynamic,
  onBack,
}: {
  dynamic: Dynamic
  onBack?: () => void
}) {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        {onBack ? (
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 size-4" />
            Voltar
          </Button>
        ) : (
          <span />
        )}

        <div className="flex flex-wrap items-center gap-2">
          {dynamic.isFeatured ? <Badge variant="secondary">Recomendado</Badge> : null}
          {dynamic.isEmergency ? <Badge variant="destructive">Emergência</Badge> : null}
          <Badge variant="outline">{dynamic.meetingType}</Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-semibold leading-tight">{dynamic.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{dynamic.summary}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Objetivo</CardTitle>
              <CardDescription>O que essa dinâmica quer produzir no coração do grupo</CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed">
              {dynamic.objective}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Materiais</CardTitle>
                <CardDescription>Separar antes evita atrasos</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 text-sm leading-relaxed">
                  {dynamic.materials.map((m, idx) => (
                    <li key={`${m}-${idx}`}>{m}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações rápidas</CardTitle>
                <CardDescription>Tempo, energia e público</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Tempo</span>
                  <span className="font-medium">{dynamic.durationMinutes} min</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Energia</span>
                  <span className="font-medium">{dynamic.energyLevel}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Dificuldade</span>
                  <span className="font-medium">{dynamic.difficultyLevel}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Pessoas</span>
                  <span className="font-medium">{formatPeople(dynamic)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Passo a passo</CardTitle>
              <CardDescription>Vai do começo ao fim, em ordem</CardDescription>
            </CardHeader>
            <CardContent>
              {dynamic.steps.length ? (
                <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed">
                  {dynamic.steps.map((s) => (
                    <li key={s.n}>
                      <span className="font-medium">Etapa {s.n}:</span> {s.text}
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="text-sm text-muted-foreground">Sem passos cadastrados.</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Versículo de apoio</CardTitle>
              <CardDescription>Um reforço bíblico para conectar a prática à fé</CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed">
              <div className="rounded-lg bg-muted/30 p-3">
                {dynamic.verse}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aplicação espiritual</CardTitle>
              <CardDescription>Uma sugestão pronta para fechar o momento</CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed">
              <div className="space-y-3">
                <p>{buildSpiritualApplication(dynamic)}</p>
                <Separator />
                <p className="text-muted-foreground">
                  Dica: adapte a pergunta final para a realidade do seu grupo (ansiedade, perdão, unidade, perseverança etc.).
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

