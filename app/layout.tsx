import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { OrganismProvider } from "@/lib/organism-context"
import { ChatWidget } from "@/components/chat-widget"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Digital Arboretum",
  description:
    "AI-powered synthetic biology platform for designing life from code. Generate DNA blueprints, simulate planetary environments, and engineer organisms for extreme conditions.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        <OrganismProvider>
          {children}
          <ChatWidget />
        </OrganismProvider>
        <Analytics />
      </body>
    </html>
  )
}
