"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { CartDialog } from "./cart-dialog"

export function FloatingCartButton() {
  const { items, isOpen, toggleCart, getTotalItems } = useCart()
  const totalItems = getTotalItems()

  return (
    <>
      <Button
        onClick={toggleCart}
        className="floating-cart-button fixed bottom-6 right-6 w-16 h-16 rounded-full bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        size="lg"
      >
        <div className="relative">
          <ShoppingCart className="w-7 h-7 text-white" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
              {totalItems > 99 ? "99+" : totalItems}
            </Badge>
          )}
        </div>
      </Button>

      <CartDialog />
    </>
  )
}
