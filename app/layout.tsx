import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import { FloatingCartButton } from "@/components/floating-cart-button"
import { CartDialog } from "@/components/cart-dialog"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Menú - Mercado",
  description: "Menú digital de Mercado - Cafetería",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <CartProvider>
          {children}
          <FloatingCartButton />
          <CartDialog />
        </CartProvider>
      </body>
    </html>
  )
}
