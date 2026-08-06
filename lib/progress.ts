import {
  allQuests,
  categories,
  defaultDropsPerRun,
  questById,
  type Category,
  type Quest,
} from "./game-data"

/** Mapa bagId -> quantidade atual coletada. */
export type BagState = Record<string, number>
/** Mapa bagId -> drops por run definido pelo usuário (sobrescreve o padrão). */
export type DropsState = Record<string, number>

export type QuestProgress = {
  current: number
  max: number
  pct: number
  status: "done" | "partial" | "pending"
  /** true quando algum pré-requisito ainda não está 100%. */
  locked: boolean
  /** Quests de pré-requisito que ainda faltam. */
  missingReqs: Quest[]
  /** Estimativa de runs restantes somando todos os reagentes. */
  runsRemaining: number
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export function getBagCurrent(bags: BagState, bagId: string): number {
  return clamp(bags[bagId] ?? 0, 0, Number.MAX_SAFE_INTEGER)
}

export function getDropsPerRun(drops: DropsState, bagId: string): number {
  const v = drops[bagId]
  if (v && v > 0) return v
  return defaultDropsPerRun[bagId] ?? 1
}

/** Uma quest está concluída quando todos os seus reagentes atingem o máximo. */
export function isQuestComplete(quest: Quest, bags: BagState): boolean {
  return quest.bags.every((b) => getBagCurrent(bags, b.id) >= b.max)
}

export function getQuestProgress(
  quest: Quest,
  bags: BagState,
  drops: DropsState,
): QuestProgress {
  let totalMax = 0
  let totalCurrent = 0
  let runsRemaining = 0

  for (const bag of quest.bags) {
    const current = Math.min(bag.max, getBagCurrent(bags, bag.id))
    totalMax += bag.max
    totalCurrent += current
    const remaining = Math.max(0, bag.max - current)
    if (remaining > 0) {
      runsRemaining += Math.ceil(remaining / getDropsPerRun(drops, bag.id))
    }
  }

  const pct = totalMax > 0 ? Math.round((totalCurrent / totalMax) * 100) : 0

  const missingReqs = quest.requires
    .map((id) => questById.get(id))
    .filter((q): q is Quest => !!q && !isQuestComplete(q, bags))

  return {
    current: totalCurrent,
    max: totalMax,
    pct,
    status: pct >= 100 ? "done" : pct > 0 ? "partial" : "pending",
    locked: missingReqs.length > 0,
    missingReqs,
    runsRemaining,
  }
}

/** Progresso global do jogador em toda a forja (todos os reagentes). */
export function getGlobalProgress(bags: BagState) {
  let totalMax = 0
  let totalCurrent = 0
  let doneQuests = 0

  for (const quest of allQuests) {
    for (const bag of quest.bags) {
      totalMax += bag.max
      totalCurrent += Math.min(bag.max, getBagCurrent(bags, bag.id))
    }
    if (isQuestComplete(quest, bags)) doneQuests++
  }

  return {
    current: totalCurrent,
    max: totalMax,
    pct: totalMax > 0 ? Math.round((totalCurrent / totalMax) * 100) : 0,
    doneQuests,
    totalQuests: allQuests.length,
  }
}

/**
 * Ordenação inteligente: quests desbloqueadas e quase completas primeiro,
 * concluídas e bloqueadas por último.
 */
export function smartSortQuests(
  quests: Quest[],
  bags: BagState,
  drops: DropsState,
): Quest[] {
  return [...quests].sort((a, b) => {
    const pa = getQuestProgress(a, bags, drops)
    const pb = getQuestProgress(b, bags, drops)

    // rank: em andamento desbloqueado (0) < pendente desbloqueado (1) < bloqueado (2) < concluído (3)
    const rank = (p: QuestProgress) => {
      if (p.status === "done") return 3
      if (p.locked) return 2
      if (p.status === "partial") return 0
      return 1
    }

    const ra = rank(pa)
    const rb = rank(pb)
    if (ra !== rb) return ra - rb
    // dentro do mesmo grupo, maior % primeiro
    return pb.pct - pa.pct
  })
}

export type CategoryProgress = {
  category: Category
  pct: number
  done: boolean
}

export function getCategoriesProgress(bags: BagState): CategoryProgress[] {
  return categories.map((category) => {
    let max = 0
    let current = 0
    for (const q of category.quests) {
      for (const b of q.bags) {
        max += b.max
        current += Math.min(b.max, getBagCurrent(bags, b.id))
      }
    }
    const pct = max > 0 ? Math.round((current / max) * 100) : 0
    return { category, pct, done: pct >= 100 }
  })
}
