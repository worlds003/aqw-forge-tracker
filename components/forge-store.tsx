"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import type { ForgeStateData } from "@/app/actions/forge"
import { saveForgeState } from "@/app/actions/forge"

type SaveStatus = "idle" | "saving" | "saved" | "error"

type ForgeStore = {
  counts: Record<string, number>
  pinned: string[]
  dropRates: Record<string, number>
  saveStatus: SaveStatus
  canUndo: boolean
  setBag: (bagId: string, value: number) => void
  incrementBag: (bagId: string, delta: number, max: number) => void
  fillBag: (bagId: string, max: number) => void
  clearBag: (bagId: string) => void
  togglePin: (questId: string) => void
  isPinned: (questId: string) => boolean
  setDropRate: (bagId: string, value: number) => void
  undo: () => void
  importState: (data: ForgeStateData) => void
  exportState: () => ForgeStateData
}

const Ctx = createContext<ForgeStore | null>(null)

export function useForge() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useForge must be used within ForgeProvider")
  return ctx
}

type Snapshot = { counts: Record<string, number>; pinned: string[]; dropRates: Record<string, number> }

export function ForgeProvider({
  initial,
  children,
}: {
  initial: ForgeStateData
  children: React.ReactNode
}) {
  const [counts, setCounts] = useState<Record<string, number>>(initial.counts)
  const [pinned, setPinned] = useState<string[]>(initial.pinned)
  const [dropRates, setDropRates] = useState<Record<string, number>>(initial.dropRates)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")

  const history = useRef<Snapshot[]>([])
  const [canUndo, setCanUndo] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstRender = useRef(true)

  const pushHistory = useCallback(() => {
    history.current.push({ counts, pinned, dropRates })
    if (history.current.length > 50) history.current.shift()
    setCanUndo(true)
  }, [counts, pinned, dropRates])

  // Debounced autosave to the cloud whenever state changes.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    setSaveStatus("saving")
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      try {
        await saveForgeState({ counts, pinned, dropRates })
        setSaveStatus("saved")
        setTimeout(() => setSaveStatus((s) => (s === "saved" ? "idle" : s)), 1800)
      } catch {
        setSaveStatus("error")
      }
    }, 700)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [counts, pinned, dropRates])

  const setBag = useCallback(
    (bagId: string, value: number) => {
      pushHistory()
      setCounts((c) => ({ ...c, [bagId]: Math.max(0, Math.floor(value) || 0) }))
    },
    [pushHistory],
  )

  const incrementBag = useCallback(
    (bagId: string, delta: number, max: number) => {
      pushHistory()
      setCounts((c) => {
        const next = Math.max(0, Math.min(max, (c[bagId] ?? 0) + delta))
        return { ...c, [bagId]: next }
      })
    },
    [pushHistory],
  )

  const fillBag = useCallback(
    (bagId: string, max: number) => {
      pushHistory()
      setCounts((c) => ({ ...c, [bagId]: max }))
    },
    [pushHistory],
  )

  const clearBag = useCallback(
    (bagId: string) => {
      pushHistory()
      setCounts((c) => ({ ...c, [bagId]: 0 }))
    },
    [pushHistory],
  )

  const togglePin = useCallback(
    (questId: string) => {
      pushHistory()
      setPinned((p) => (p.includes(questId) ? p.filter((id) => id !== questId) : [...p, questId]))
    },
    [pushHistory],
  )

  const isPinned = useCallback((questId: string) => pinned.includes(questId), [pinned])

  const setDropRate = useCallback(
    (bagId: string, value: number) => {
      pushHistory()
      setDropRates((d) => {
        const next = { ...d }
        if (value > 0) next[bagId] = value
        else delete next[bagId]
        return next
      })
    },
    [pushHistory],
  )

  const undo = useCallback(() => {
    const last = history.current.pop()
    if (!last) return
    setCounts(last.counts)
    setPinned(last.pinned)
    setDropRates(last.dropRates)
    setCanUndo(history.current.length > 0)
  }, [])

  const importState = useCallback(
    (data: ForgeStateData) => {
      pushHistory()
      setCounts(data.counts ?? {})
      setPinned(data.pinned ?? [])
      setDropRates(data.dropRates ?? {})
    },
    [pushHistory],
  )

  const exportState = useCallback(
    (): ForgeStateData => ({ counts, pinned, dropRates }),
    [counts, pinned, dropRates],
  )

  const value: ForgeStore = {
    counts,
    pinned,
    dropRates,
    saveStatus,
    canUndo,
    setBag,
    incrementBag,
    fillBag,
    clearBag,
    togglePin,
    isPinned,
    setDropRate,
    undo,
    importState,
    exportState,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
