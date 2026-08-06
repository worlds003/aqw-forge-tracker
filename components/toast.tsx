"use client"

import type React from "react"
import { createContext, useCallback, useContext, useState } from "react"

type Toast = { id: number; message: string; kind: "info" | "success" | "error" }

const Ctx = createContext<(message: string, kind?: Toast["kind"]) => void>(() => {})

export function useToast() {
  return useContext(Ctx)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const notify = useCallback((message: string, kind: Toast["kind"] = "info") => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message, kind }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000)
  }, [])

  return (
    <Ctx.Provider value={notify}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-lg border px-4 py-2.5 text-sm font-medium shadow-lg ${
              t.kind === "success"
                ? "border-success/40 bg-card text-success"
                : t.kind === "error"
                  ? "border-destructive/40 bg-card text-destructive"
                  : "border-border bg-card text-foreground"
            }`}
            role="status"
          >
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
