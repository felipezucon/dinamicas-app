import * as React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

type CheckItem = { id: string; text: string; hint?: string }

const BEFORE: CheckItem[] = [
  { id: "before-1", text: "Conferir o ambiente: cadeiras, som e iluminação" },
  { id: "before-2", text: "Separar materiais com antecedência (mão rápida na hora é ouro)" },
  { id: "before-3", text: "Deixar um caminho claro para a dinâmica: quem explica, quem inicia e quem media" },
  { id: "before-4", text: "Orar pelo grupo: abertura, liberdade para participar e sensibilidade à Palavra" },
  { id: "before-5", text: "Combinar com voluntários papéis simples (tempo, dinâmica, acolhimento)" },
]

const DURING: CheckItem[] = [
  { id: "during-1", text: "Acolher com sorriso e uma pergunta leve de entrada" },
  { id: "during-2", text: "Explicar a dinâmica em 30 segundos (objetivo + o que fazer)" },
  { id: "during-3", text: "Garantir participação: direcionar quem está tímido sem constranger" },
  { id: "during-4", text: "Monitorar o tempo: parar antes de cansar e antes de “travarem”" },
  { id: "during-5", text: "Registrar 1 aprendizado do grupo (algo que “apareceu” durante o encontro)" },
]

const AFTER: CheckItem[] = [
  { id: "after-1", text: "Fechar com aplicação prática: 1 passo para a semana" },
  { id: "after-2", text: "Reforçar o versículo/tema em uma frase simples (para não perder o fio)" },
  { id: "after-3", text: "Orar brevemente por 1 ou 2 pedidos (sem prolongar, mas sem pular)" },
  { id: "after-4", text: "Agradecer e convidar o próximo encontro (data e horário bem claro)" },
]

export function BonusChecklist() {
  const all = React.useMemo(() => [...BEFORE, ...DURING, ...AFTER], [])
  const [checked, setChecked] = React.useState<Record<string, boolean>>({})

  function toggle(id: string, next: boolean) {
    setChecked((prev) => ({ ...prev, [id]: next }))
  }

  const total = all.length
  const done = all.filter((i) => checked[i.id]).length

  function reset() {
    setChecked({})
  }

  const renderList = (items: CheckItem[]) => {
    return (
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i.id} className="flex items-start gap-3">
            <input
              id={i.id}
              type="checkbox"
              checked={Boolean(checked[i.id])}
              onChange={(e) => toggle(i.id, e.target.checked)}
              className="mt-1 size-4 accent-primary"
            />
            <label htmlFor={i.id} className="text-sm leading-relaxed">
              {i.text}
              {i.hint ? <div className="mt-1 text-xs text-muted-foreground">{i.hint}</div> : null}
            </label>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-base font-semibold">Checklist do Líder de Sucesso</h2>
        <p className="text-sm text-muted-foreground">
          Um guia simples para lembrar o que importa antes, durante e depois do encontro.
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Organização</Badge>
            <Badge variant="outline">
              {done}/{total} marcados
            </Badge>
          </div>
          <Button variant="outline" onClick={reset}>
            Limpar marcações
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-dashed shadow-none lg:shadow-none lg:bg-transparent">
            <div className="p-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Antes</Badge>
              </div>
              <div className="mt-3">{renderList(BEFORE)}</div>
            </div>
          </Card>

          <Card className="border-dashed shadow-none lg:shadow-none lg:bg-transparent">
            <div className="p-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Durante</Badge>
              </div>
              <div className="mt-3">{renderList(DURING)}</div>
            </div>
          </Card>

          <Card className="border-dashed shadow-none lg:shadow-none lg:bg-transparent">
            <div className="p-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Depois</Badge>
              </div>
              <div className="mt-3">{renderList(AFTER)}</div>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  )
}

