"use client"

import { useState, useEffect } from "react"
import { Plus, Minus, ShoppingCart, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCart } from "@/contexts/cart-context"

interface ProductParameter {
  name: string
  available_quantity: number
}

interface ProductAgrego {
  id: number
  name: string
  price: number
}

interface ProductCosto {
  id: number
  name: string
  price: number
}

interface Product {
  id: number
  name: string
  price: number
  image_url?: string
  has_parameters?: boolean
  has_agregos?: boolean
  has_costos?: boolean
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
  const [agregoQuantities, setAgregoQuantities] = useState<{ [key: string]: number }>({})
  const [isAnimating, setIsAnimating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [productDetails, setProductDetails] = useState<any>(null)

  // Cargar detalles del producto cuando se abre el diálogo
  useEffect(() => {
    if (showDialog && (product.has_agregos || product.has_costos)) {
      fetchProductDetails()
    }
  }, [showDialog])

  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/product/${product.id}`)
      if (response.ok) {
        const details = await response.json()
        setProductDetails(details)
      }
    } catch (error) {
      console.error('Error fetching product details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    setShowDialog(true)
  }

  const calculateTotalPrice = () => {
    let total = product.price * quantity

    // Agregar precio de agregos seleccionados
    if (productDetails?.agregos) {
      Object.entries(agregoQuantities).forEach(([agregoId, qty]) => {
        const agrego = productDetails.agregos.find((a: any) => a.id.toString() === agregoId)
        if (agrego && qty > 0) {
          total += agrego.price * qty
        }
      })
    }

    // Agregar costos adicionales (se multiplican por la cantidad del producto)
    if (productDetails?.costos) {
      const totalCostos = productDetails.costos.reduce((sum: number, costo: any) => sum + costo.price, 0)
      total += totalCostos * quantity
    }

    return total
  }

  const getTotalCostosAdicionales = () => {
    if (!productDetails?.costos) return 0
    return productDetails.costos.reduce((sum: number, costo: any) => sum + costo.price, 0)
  }

  const handleConfirmAddToCart = () => {
    if (product.has_parameters && product.parameters && product.parameters.length > 0) {
      const totalParameterQuantity = Object.values(parameterQuantities).reduce((sum, qty) => sum + qty, 0)

      if (totalParameterQuantity > 0) {
        addToCart(
          product,
          totalParameterQuantity,
          parameterQuantities,
          agregoQuantities,
          productDetails?.agregos || [], // Pasar los detalles de los agregos
          getTotalCostosAdicionales()
        )
        resetAndClose()
      }
    } else {
      if (quantity > 0) {
        addToCart(
          product,
          quantity,
          undefined,
          agregoQuantities,
          productDetails?.agregos || [], // Pasar los detalles de los agregos
          getTotalCostosAdicionales()
        )
        resetAndClose()
      }
    }
  }


  const resetAndClose = () => {
    triggerAnimation()
    setShowDialog(false)
    setParameterQuantities({})
    setAgregoQuantities({})
    setQuantity(1)
    setProductDetails(null)
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

  const updateAgregoQuantity = (agregoId: string, newQuantity: number) => {
    setAgregoQuantities((prev) => ({
      ...prev,
      [agregoId]: Math.max(0, newQuantity),
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
      <Button
        size="sm"
        onClick={handleAddToCart}
        className={`w-6 h-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white p-0 transition-all duration-300 ${isAnimating ? "scale-110 bg-green-500" : ""
          }`}
      >
        <ShoppingCart className="w-3 h-3" />
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Agregar al carrito
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="space-y-4 pb-4">
              {/* Información del producto */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">
                    Precio base: ${product.price.toFixed(2)} CUP
                  </p>
                </div>
              </div>

              {loading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Cargando opciones...</p>
                </div>
              )}

              {/* Cantidad (solo si no tiene parámetros) */}
              {(!product.has_parameters || !product.parameters || product.parameters.length === 0) && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Cantidad</label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 p-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Parámetros del producto */}
              {product.has_parameters && product.parameters && product.parameters.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Selecciona opciones</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {product.parameters.map((param) => (
                      <div key={param.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium truncate block">{param.name}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateParameterQuantity(param.name, (parameterQuantities[param.name] || 0) - 1)}
                            className="w-7 h-7 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-6 text-center text-sm">
                            {parameterQuantities[param.name] || 0}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateParameterQuantity(param.name, (parameterQuantities[param.name] || 0) + 1)}
                            className="w-7 h-7 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Agregos disponibles */}
              {productDetails?.agregos && productDetails.agregos.length > 0 && (
                <div className="space-y-3">
                  <Separator />
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-green-600" />
                    <label className="text-sm font-medium text-gray-700">Agregos disponibles</label>
                  </div>
                  <div className="space-y-2">
                    {productDetails.agregos.map((agrego: ProductAgrego) => (
                      <div key={agrego.id} className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium truncate block">{agrego.name}</span>
                          <p className="text-xs text-green-600">+${agrego.price.toFixed(2)} CUP c/u</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateAgregoQuantity(agrego.id.toString(), (agregoQuantities[agrego.id.toString()] || 0) - 1)}
                            className="w-7 h-7 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-6 text-center text-sm">
                            {agregoQuantities[agrego.id.toString()] || 0}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateAgregoQuantity(agrego.id.toString(), (agregoQuantities[agrego.id.toString()] || 0) + 1)}
                            className="w-7 h-7 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Costos adicionales */}
              {productDetails?.costos && productDetails.costos.length > 0 && (
                <div className="space-y-3">
                  <Separator />
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-amber-600" />
                    <label className="text-sm font-medium text-gray-700">Este producto incluye:</label>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {productDetails.costos.map((costo: ProductCosto) => (
                        <div key={costo.id} className="flex justify-between items-center py-1">
                          <span className="text-sm text-amber-800 truncate flex-1 mr-2">{costo.name}</span>
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800 flex-shrink-0">
                            +${costo.price.toFixed(2)} CUP
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center font-medium">
                      <span className="text-sm text-amber-800">Total costos adicionales:</span>
                      <span className="text-sm text-amber-800">
                        +${getTotalCostosAdicionales().toFixed(2)} CUP
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Resumen de precio - Fijo en la parte inferior con separación clara */}
          <div className="flex-shrink-0 mt-4 pt-4 border-t bg-white">
            <div className="space-y-4">
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex justify-between items-center font-semibold text-orange-800">
                  <span>Precio total:</span>
                  <span>${calculateTotalPrice().toFixed(2)} CUP</span>
                </div>
                <p className="text-xs text-orange-600 mt-1">
                  {getTotalQuantity()} {getTotalQuantity() === 1 ? 'unidad' : 'unidades'}
                </p>
              </div>

              <DialogFooter className="gap-2 px-0">
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmAddToCart}
                  disabled={getTotalQuantity() === 0}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Agregar al carrito
                </Button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
