import * as React from "react"

import { getDynamicBySlug } from "@/domain/dynamics"
import { GeneratorPage } from "@/features/generator/GeneratorPage"
import { DynamicDetail } from "@/features/dynamics/DynamicDetail"
import { BonusSpecialDates } from "@/features/bonuses/BonusSpecialDates"
import { BonusChecklist } from "@/features/bonuses/BonusChecklist"
import { BonusQuestions } from "@/features/bonuses/BonusQuestions"
import { BonusEmergency } from "@/features/bonuses/BonusEmergency"
import { BonusDifficultGroups } from "@/features/bonuses/BonusDifficultGroups"
import type { Dynamic } from "@/domain/dynamics"
import { Button } from "@/components/ui/button"

type MainView =
  | "generator"
  | "bonus-special"
  | "bonus-checklist"
  | "bonus-questions"
  | "bonus-emergency"
  | "bonus-difficult"

export default function App() {
  const [view, setView] = React.useState<MainView>("generator")
  const [selectedSlug, setSelectedSlug] = React.useState<string | null>(null)
  const selectedDynamic: Dynamic | undefined = React.useMemo(() => {
    if (!selectedSlug) return undefined
    return getDynamicBySlug(selectedSlug)
  }, [selectedSlug])

  const navItems: Array<{ id: MainView; label: string }> = [
    { id: "generator", label: "Gerador" },
    { id: "bonus-special", label: "Datas especiais" },
    { id: "bonus-checklist", label: "Checklist" },
    { id: "bonus-questions", label: "Perguntas" },
    { id: "bonus-emergency", label: "Emergência" },
    { id: "bonus-difficult", label: "Grupos difíceis" },
  ]

  const renderMainView = () => {
    if (view === "generator") return <GeneratorPage onOpenDetail={(slug) => setSelectedSlug(slug)} />
    if (view === "bonus-special") return <BonusSpecialDates onPickDynamic={(slug) => setSelectedSlug(slug)} />
    if (view === "bonus-checklist") return <BonusChecklist />
    if (view === "bonus-questions") return <BonusQuestions />
    if (view === "bonus-emergency") return <BonusEmergency onPickDynamic={(slug) => setSelectedSlug(slug)} />
    return <BonusDifficultGroups onPickDynamic={(slug) => setSelectedSlug(slug)} />
  }

  return (
    <div className="min-h-dvh bg-surface-page px-4 py-5 text-text-primary sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-6xl">
        {selectedSlug && selectedDynamic ? (
          <DynamicDetail dynamic={selectedDynamic} onBack={() => setSelectedSlug(null)} />
        ) : selectedSlug && !selectedDynamic ? (
          <div className="space-y-3">
            <div className="text-sm font-medium text-status-warning">Dinâmica não encontrada.</div>
            <button className="underline" onClick={() => setSelectedSlug(null)}>
              Voltar
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5 sm:gap-7">
            <header className="space-y-2">
              <h1 className="text-2xl font-semibold leading-tight sm:text-3xl">Gerador de Dinâmicas Cristãs</h1>
              <p className="text-base text-muted-foreground">
                Filtre e receba uma dinâmica pronta para aplicar, com bônus para situações do dia a dia.
              </p>
            </header>

            <nav
              aria-label="Seções do app"
              className="rounded-xl border border-border bg-card p-2"
            >
              <div className="-mx-1 overflow-x-auto overscroll-x-contain px-1 pb-1 [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]">
                <div className="flex w-max flex-nowrap items-center gap-2 py-1 sm:flex-wrap sm:gap-2">
                  {navItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={view === item.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setView(item.id)}
                      className="shrink-0 rounded-full"
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>

            </nav>

            <main>{renderMainView()}</main>
          </div>
        )}
      </div>
    </div>
  )
}
