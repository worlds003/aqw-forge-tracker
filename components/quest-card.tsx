"use client"

import { useState } from "react"
import { ExternalLink, Lock, Pin, PinOff, Minus, Plus, Check, Target, ChevronDown } from "lucide-react"
import type { Quest } from "@/lib/game-data"
import { getDropsPerRun, getQuestProgress, type BagState, type DropsState } from "@/lib/progress"
import { useForge } from "./forge-store"

export function QuestCard({ quest }: { quest: Quest }) {
  const { counts, dropRates, incrementBag, setBag, fillBag, clearBag, togglePin, isPinned, setDropRate } = useForge()
  const [showGuide, setShowGuide] = useState(false)

  const bags = counts as BagState
  const drops = dropRates as DropsState
  const progress = getQuestProgress(quest, bags, drops)
  const pinned = isPinned(quest.id)

  const statusColor =
    progress.status === "done"
      ? "var(--color-success)"
      : progress.status === "partial"
        ? "var(--color-primary)"
        : "var(--color-muted-foreground)"

  return (
    <article
      className={`flex flex-col gap-3 rounded-xl border bg-card p-4 transition-colors ${
        progress.locked ? "border-border/60 opacity-80" : "border-border"
      } ${pinned ? "ring-1 ring-primary" : ""}`}
    >
      <header className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-serif text-lg font-semibold leading-tight text-foreground text-balance">{quest.name}</h3>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">
            {quest.npc} - {quest.map}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => togglePin(quest.id)}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
            title={pinned ? "Desafixar farm" : "Fixar farm"}
            aria-label={pinned ? "Desafixar farm" : "Fixar farm"}
          >
            {pinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
          </button>
          <a
            href={quest.wiki}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
            title="Abrir na Wiki"
            aria-label="Abrir na Wiki"
          >
            <ExternalLink className="size-4" />
          </a>
        </div>
      </header>

      {/* Barra de progresso da quest */}
      <div className="flex items-center gap-2">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress.pct}%`, background: statusColor }}
          />
        </div>
        <span className="w-10 text-right font-mono text-xs font-semibold" style={{ color: statusColor }}>
          {progress.pct}%
        </span>
      </div>

      {progress.locked && (
        <div className="flex items-start gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
          <Lock className="mt-0.5 size-3.5 shrink-0 text-accent" />
          <span>
            Bloqueada ate concluir: <span className="text-foreground">{progress.missingReqs.map((q) => q.name).join(", ")}</span>
          </span>
        </div>
      )}

      {/* Reagentes */}
      <div className="flex flex-col gap-3">
        {quest.bags.map((bag) => {
          const current = Math.min(bag.max, bags[bag.id] ?? 0)
          const done = current >= bag.max
          const remaining = Math.max(0, bag.max - current)
          const perRun = getDropsPerRun(drops, bag.id)
          const runs = remaining > 0 ? Math.ceil(remaining / perRun) : 0

          return (
            <div key={bag.id} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-sm text-foreground">
                  {done && <Check className="size-3.5 text-success" />}
                  {bag.name}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {current}/{bag.max}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => incrementBag(bag.id, -1, bag.max)}
                  disabled={current <= 0}
                  className="flex size-7 items-center justify-center rounded-md border border-border bg-secondary text-foreground transition-colors hover:bg-muted disabled:opacity-40"
                  aria-label={`Remover 1 de ${bag.name}`}
                >
                  <Minus className="size-3.5" />
                </button>
                <input
                  type="number"
                  min={0}
                  max={bag.max}
                  value={current}
                  onChange={(e) => setBag(bag.id, Number(e.target.value))}
                  className="h-7 w-16 rounded-md border border-border bg-input px-2 text-center font-mono text-sm text-foreground outline-none focus:border-primary"
                  aria-label={`Quantidade de ${bag.name}`}
                />
                <button
                  onClick={() => incrementBag(bag.id, 1, bag.max)}
                  disabled={done}
                  className="flex size-7 items-center justify-center rounded-md border border-border bg-secondary text-foreground transition-colors hover:bg-muted disabled:opacity-40"
                  aria-label={`Adicionar 1 a ${bag.name}`}
                >
                  <Plus className="size-3.5" />
                </button>
                <button
                  onClick={() => fillBag(bag.id, bag.max)}
                  className="rounded-md border border-border bg-secondary px-2 py-1 text-xs text-foreground transition-colors hover:bg-muted"
                  title="Definir para o maximo"
                >
                  Max
                </button>
                <button
                  onClick={() => clearBag(bag.id)}
                  className="rounded-md border border-border bg-secondary px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted"
                  title="Zerar"
                >
                  0
                </button>
              </div>

              {/* Estimativa de farm */}
              {remaining > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Target className="size-3" />
                  <span>
                    ~<span className="font-semibold text-accent">{runs}</span> run{runs !== 1 ? "s" : ""} restante
                    {runs !== 1 ? "s" : ""}
                  </span>
                  <span className="text-border">|</span>
                  <label className="flex items-center gap-1">
                    <span>drops/run:</span>
                    <input
                      type="number"
                      min={1}
                      value={perRun}
                      onChange={(e) => setDropRate(bag.id, Number(e.target.value))}
                      className="h-5 w-12 rounded border border-border bg-input px-1 text-center font-mono text-xs text-foreground outline-none focus:border-primary"
                      aria-label={`Drops por run de ${bag.name}`}
                    />
                  </label>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {quest.guide && (
        <div>
          <button
            onClick={() => setShowGuide((s) => !s)}
            className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:opacity-80"
          >
            <ChevronDown className={`size-3.5 transition-transform ${showGuide ? "rotate-180" : ""}`} />
            {quest.guide.title}
          </button>
          {showGuide && (
            <p className="mt-2 text-pretty rounded-lg bg-secondary/50 p-3 text-xs leading-relaxed text-muted-foreground">
              {quest.guide.text}
            </p>
          )}
        </div>
      )}
    </article>
  )
}
