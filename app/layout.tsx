import type React from "react"
import type { Metadata, Viewport } from "next"
import { Oswald, Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "AQW Forge Tracker",
  description:
    "Rastreie o progresso das quests de forja do AdventureQuest Worlds: reagentes, pre-requisitos e estimativa de farm.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#241a14",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`bg-background ${oswald.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
