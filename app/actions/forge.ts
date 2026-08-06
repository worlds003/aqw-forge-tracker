"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { forgeState } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

export type ForgeStateData = {
  counts: Record<string, number>
  pinned: string[]
  dropRates: Record<string, number>
}

const EMPTY: ForgeStateData = { counts: {}, pinned: [], dropRates: {} }

export async function getForgeState(): Promise<ForgeStateData> {
  const userId = await getUserId()
  const rows = await db.select().from(forgeState).where(eq(forgeState.userId, userId)).limit(1)
  if (rows.length === 0) return EMPTY
  const row = rows[0]
  return {
    counts: (row.counts as Record<string, number>) ?? {},
    pinned: (row.pinned as string[]) ?? [],
    dropRates: (row.dropRates as Record<string, number>) ?? {},
  }
}

export async function saveForgeState(data: ForgeStateData): Promise<{ ok: true }> {
  const userId = await getUserId()

  // Server-side sanitization: counts and drop rates must be non-negative finite numbers.
  const counts: Record<string, number> = {}
  for (const [k, v] of Object.entries(data.counts ?? {})) {
    const n = Number(v)
    if (Number.isFinite(n) && n >= 0) counts[k] = Math.floor(n)
  }
  const dropRates: Record<string, number> = {}
  for (const [k, v] of Object.entries(data.dropRates ?? {})) {
    const n = Number(v)
    if (Number.isFinite(n) && n > 0) dropRates[k] = n
  }
  const pinned = Array.isArray(data.pinned) ? data.pinned.filter((p) => typeof p === "string").slice(0, 200) : []

  await db
    .insert(forgeState)
    .values({ userId, counts, pinned, dropRates, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: forgeState.userId,
      set: { counts, pinned, dropRates, updatedAt: new Date() },
    })

  return { ok: true }
}
