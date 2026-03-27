import * as React from "react"
import { Shuffle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const QUESTIONS = [
  "O que Deus tem ensinado a você recentemente, mesmo em meio às dificuldades?",
  "Qual foi uma evidência clara de cuidado de Deus nesta semana?",
  "Em qual área você sente que precisa confiar mais e controlar menos?",
  "O que tem roubado sua paz e como você pode entregar isso a Deus?",
  "Que hábito te ajuda a permanecer perto de Deus (e como fortalecer isso)?",
  "Que versículo tem sido mais real para você agora? Por quê?",
  "O que você tem adiado e como isso afeta sua caminhada?",
  "Quem é uma pessoa que precisa da sua oração hoje? O que você pode fazer prático?",
  "Qual foi um momento em que você percebeu a graça de Deus agindo em você?",
  "O que você tem aprendido sobre unidade no grupo?",
  "Qual diálogo difícil você precisa ter com alguém? O que impediria você hoje?",
  "Onde você tem visto tendência ao medo? Qual seria a resposta da fé?",
  "Qual foi a última vez que você perdoou de verdade? O que o levou a isso?",
  "Como você define perdão na prática (não só como sentimento)?",
  "O que você precisa entregar a Deus para parar de carregar sozinho?",
  "Que tipo de “carga” você tem levado além do que Deus confiou?",
  "O que você sente que Deus quer restaurar no seu coração?",
  "Que oração você tem repetido ultimamente (e por que isso importa)?",
  "Qual é um passo pequeno que você pode dar ainda hoje para obedecer a Deus?",
  "Quando você mais tem se distraído? Como reduzir isso na próxima semana?",
  "O que você aprendeu sobre perseverança a partir de uma experiência recente?",
  "Que compromisso você quer renovar com Deus começando agora?",
  "O que tem atrapalhado sua intimidade com a Palavra?",
  "Qual parte da fé você acha mais desafiadora: confiar, obedecer ou perseverar?",
  "Como você tem lidado com frustração? O que precisa mudar?",
  "O que você faz quando falha? Você volta para Deus rápido ou se esconde?",
  "Como o seu jeito de falar reflete o que você crê?",
  "O que você tem buscado primeiro: resultado ou relacionamento com Deus?",
  "Qual é uma tentação que você tem enfrentado e como tem resistido?",
  "Onde você precisa de sabedoria prática, e não só de entendimento?",
  "Como você pode servir alguém na semana com intencionalidade?",
  "Que atitude demonstraria mais amor no seu cotidiano?",
  "Se Deus te orientasse com clareza hoje, qual seria o próximo passo?",
  "O que você quer deixar de repetir porque não está te aproximando de Deus?",
  "Que oração você gostaria de ouvir de outras pessoas por você?",
  "Como você percebe que sua fé está crescendo (ou estagnando)?",
  "O que te motiva a servir mesmo quando ninguém vê?",
  "Qual é o seu maior motivo para agradecer esta semana?",
  "O que você tem “escondido” e precisa trazer à luz?",
  "Como você se sente quando é corrigido? O que o coração precisa para receber?",
  "Que tipo de coragem você precisa hoje: dizer, pedir, perdoar ou recomeçar?",
  "Qual é um medo que você quer entregar agora a Deus?",
  "O que você quer que Deus transforme em você nos próximos 30 dias?",
  "Como você quer que o grupo ore por você esta semana, de forma bem específica?",
  "O que você aprendeu sobre ouvir a voz de Deus na prática?",
  "Qual compromisso você consegue manter por 7 dias sem desistir?",
]

function normalize(s: string): string {
  return (s ?? "")
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
}

function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr]
  const out: T[] = []
  while (copy.length && out.length < n) {
    const idx = Math.floor(Math.random() * copy.length)
    out.push(copy.splice(idx, 1)[0])
  }
  return out
}

export function BonusQuestions() {
  const [query, setQuery] = React.useState("")
  const [picked, setPicked] = React.useState<string[] | null>(null)

  const filtered = React.useMemo(() => {
    const q = normalize(query)
    if (!q) return QUESTIONS
    return QUESTIONS.filter((qq) => normalize(qq).includes(q))
  }, [query])

  function shufflePicked() {
    const count = Math.min(5, filtered.length)
    setPicked(pickRandom(filtered, count))
  }

  React.useEffect(() => {
    setPicked(null)
  }, [query])

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-base font-semibold">50 Perguntas Poderosas para Grupos</h2>
        <p className="text-sm text-muted-foreground">
          Use a pergunta certa para quebrar o gelo, aprofundar a reflexão e promover participação.
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Perguntas</Badge>
              <span className="text-sm text-muted-foreground">{filtered.length} disponíveis</span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-[360px]">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por palavra (ex.: perdão, fé, oração...)" />
            <Button variant="outline" onClick={shufflePicked}>
              <Shuffle className="mr-2 size-4" />
              Sortear 5
            </Button>
          </div>
        </div>

        {picked && picked.length ? (
          <div className="mt-4 space-y-2">
            <div className="text-sm font-semibold">Perguntas sugeridas agora</div>
            <div className="grid gap-3 md:grid-cols-2">
              {picked.map((q, idx) => (
                <div key={`${idx}-${q}`} className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="text-xs text-muted-foreground">Pergunta {idx + 1}</div>
                  <div className="mt-1 text-sm">{q}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-6">
          <div className="mb-3 text-sm font-semibold">Todas as perguntas (lista)</div>
          <ScrollArea className="h-[420px] rounded-xl border">
            <div className="space-y-2 p-3">
              {filtered.map((q, idx) => (
                <div key={`${idx}-${q}`} className="rounded-lg border border-border bg-background p-3">
                  <div className="text-xs text-muted-foreground">#{idx + 1}</div>
                  <div className="mt-1 text-sm">{q}</div>
                </div>
              ))}
              {!filtered.length ? <div className="text-sm text-muted-foreground">Nada encontrado.</div> : null}
            </div>
          </ScrollArea>
        </div>
      </Card>
    </div>
  )
}

