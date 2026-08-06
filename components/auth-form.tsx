"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === "sign-up"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await authClient.signUp.email({ email, password, name })
        if (error) throw new Error(error.message || "Falha ao criar conta")
      } else {
        const { error } = await authClient.signIn.email({ email, password })
        if (error) throw new Error(error.message || "E-mail ou senha inválidos")
      }
      router.push("/")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo deu errado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-2">
          <span className="font-serif text-3xl font-bold tracking-tight text-foreground">FORGE</span>
          <span className="rounded bg-primary px-2 py-0.5 font-mono text-xs font-bold text-primary-foreground">
            TRACKER
          </span>
        </div>
        <p className="text-pretty text-sm text-muted-foreground">
          {isSignUp
            ? "Crie sua conta para salvar o progresso da forja na nuvem."
            : "Entre para continuar rastreando sua forja."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-lg"
      >
        {isSignUp && (
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">Nome</span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-border bg-input px-3 py-2 text-foreground outline-none transition-colors focus:border-primary"
              placeholder="Seu nome de heroi"
            />
          </label>
        )}

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">E-mail</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-border bg-input px-3 py-2 text-foreground outline-none transition-colors focus:border-primary"
            placeholder="voce@exemplo.com"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">Senha</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-border bg-input px-3 py-2 text-foreground outline-none transition-colors focus:border-primary"
            placeholder="Minimo 8 caracteres"
          />
        </label>

        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Aguarde..." : isSignUp ? "Criar conta" : "Entrar"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        {isSignUp ? (
          <>
            Ja tem conta?{" "}
            <Link href="/sign-in" className="font-medium text-primary hover:underline">
              Entrar
            </Link>
          </>
        ) : (
          <>
            Nao tem conta?{" "}
            <Link href="/sign-up" className="font-medium text-primary hover:underline">
              Criar conta
            </Link>
          </>
        )}
      </p>
    </div>
  )
}
