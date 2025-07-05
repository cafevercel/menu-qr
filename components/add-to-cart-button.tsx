"use client"

import { useState } from "react"
import { Plus, Minus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useCart } from "@/contexts/cart-context"

interface ProductParameter {
  name: string
  available_quantity: number
}

interface Product {
  id: number
  name: string
  price: number
  image_url?: string
  has_parameters?: boolean
  parameters?: ProductParameter[]
}

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const [showDialog, setShowDialog] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [parameterQuantities, setParameterQuantities] = useState<{ [key: string]: number }>({})
  const [isAnimating, setIsAnimating] = useState(false)

  // Siempre abrir el diálogo
  const handleAddToCart = () => {
    setShowDialog(true)
  }

  const handleConfirmAddToCart = () => {
    if (product.has_parameters && product.parameters && product.parameters.length > 0) {
      // Calcular cantidad total de parámetros
      const totalParameterQuantity = Object.values(parameterQuantities).reduce((sum, qty) => sum + qty, 0)

      if (totalParameterQuantity > 0) {
        addToCart(product, totalParameterQuantity, parameterQuantities)
        triggerAnimation()
        setShowDialog(false)
        setParameterQuantities({})
      }
    } else {
      // Producto sin parámetros
      if (quantity > 0) {
        addToCart(product, quantity)
        triggerAnimation()
        setShowDialog(false)
        setQuantity(1)
      }
    }
  }

  const triggerAnimation = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 600)
  }

  const updateParameterQuantity = (paramName: string, newQuantity: number) => {
    setParameterQuantities((prev) => ({
      ...prev,
      [paramName]: Math.max(0, newQuantity),
    }))
  }

  const getTotalParameterQuantity = () => {
    return Object.values(parameterQuantities).reduce((sum, qty) => sum + qty, 0)
  }

  const getTotalQuantity = () => {
    return product.has_parameters && product.parameters && product.parameters.length > 0
      ? getTotalParameterQuantity()
      : quantity
  }

  return (
    <>
      {/* Botón circular más pequeño */}
      <Button
        size="sm"
        onClick={handleAddToCart}
        className={`w-6 h-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white p-0 transition-all duration-300 ${
          isAnimating ? "scale-110 bg-green-500" : ""
        }`}
      >
        <ShoppingCart className="h-3 w-3" />
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-lg">{product.name}</DialogTitle>
            <p className="text-orange-500 font-bold text-xl">${product.price.toFixed(2)}</p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            {product.has_parameters && product.parameters && product.parameters.length > 0 ? (
              <>
                <p className="text-sm text-gray-600 mb-4">Selecciona las cantidades por parámetro:</p>

                <div className="space-y-3">
                  {product.parameters.map((param, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <span className="font-medium text-sm">{param.name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateParameterQuantity(param.name, (parameterQuantities[param.name] || 0) - 1)
                          }
                          className="h-8 w-8 p-0"
                          disabled={(parameterQuantities[param.name] || 0) <= 0}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>

                        <span className="w-8 text-center text-sm font-medium">
                          {parameterQuantities[param.name] || 0}
                        </span>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateParameterQuantity(param.name, (parameterQuantities[param.name] || 0) + 1)
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-4">Selecciona la cantidad:</p>

                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 p-0"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <span className="text-xl font-bold w-12 text-center">{quantity}</span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}

            {getTotalQuantity() > 0 && (
              <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">Total:</span>
                  <div className="text-right">
                    <div className="font-bold text-orange-600">
                      {getTotalQuantity()} unidad{getTotalQuantity() !== 1 ? "es" : ""}
                    </div>
                    <div className="text-sm text-gray-600">${(product.price * getTotalQuantity()).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowDialog(false)} className="flex-1">
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmAddToCart}
              disabled={getTotalQuantity() === 0}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              Agregar al carrito
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
