"use client"

import { useState } from "react"
import { X, ArrowLeft, ArrowRight, Trash2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { useCart, deliveryZones, type DeliveryZone } from "@/contexts/cart-context"
import { TimePicker } from "./time-picker"

export function CartDialog() {
  const { items, isOpen, step, toggleCart, setStep, removeFromCart, clearCart, getTotalPrice } = useCart()

  // Estados para el formulario
  const [customerName, setCustomerName] = useState("")
  const [phone, setPhone] = useState("")
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null)
  const [specificAddress, setSpecificAddress] = useState("")
  const [deliveryTime, setDeliveryTime] = useState<"now" | "later">("now")
  const [scheduledTime, setScheduledTime] = useState("18:00") // 6:00 PM por defecto

  const subtotal = getTotalPrice()
  const deliveryFee = selectedZone?.price || 0
  const total = subtotal + deliveryFee

  const handleNext = () => {
    if (step < 3) {
      setStep((step + 1) as 1 | 2 | 3)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3)
    }
  }

  const handleConfirmOrder = () => {
    // Crear mensaje para WhatsApp
    const itemsList = items
      .map((item) => {
        let itemText = `• ${item.name}`
        let itemPrice = item.price * item.quantity

        // Si tiene parámetros seleccionados, mostrarlos
        if (item.selectedParameters && Object.keys(item.selectedParameters).length > 0) {
          const parametersText = Object.entries(item.selectedParameters)
            .filter(([_, quantity]) => quantity > 0)
            .map(([paramName, quantity]) => `${paramName}: ${quantity}`)
            .join(", ")
          itemText += ` (${parametersText})`
        }

        // Si tiene agregos seleccionados, mostrarlos y sumar al precio
        if (item.selectedAgregos && Object.keys(item.selectedAgregos).length > 0) {
          const agregosText = Object.entries(item.selectedAgregos)
            .filter(([_, quantity]) => quantity > 0)
            .map(([agregoId, quantity]) => {
              // Buscar el nombre del agrego en los detalles del item
              const agregoName = item.agregosDetails?.find(a => a.id.toString() === agregoId)?.name || `Agrego ${agregoId}`
              return `${agregoName}: ${quantity}`
            })
            .join(", ")
          itemText += ` + Agregos: ${agregosText}`

          // Calcular precio real de agregos
          const agregosPrice = Object.entries(item.selectedAgregos).reduce((sum, [agregoId, qty]) => {
            const agrego = item.agregosDetails?.find(a => a.id.toString() === agregoId)
            return sum + (agrego ? agrego.price * qty : 0)
          }, 0)
          itemPrice += agregosPrice
        }

        // Si tiene costos adicionales, mostrarlos y sumar al precio
        if (item.costosAdicionales && item.costosAdicionales > 0) {
          itemText += ` + Costos adicionales`
          itemPrice += item.costosAdicionales * item.quantity
        }

        itemText += ` x${item.quantity} - $${itemPrice.toFixed(2)} CUP`
        return itemText
      })
      .join("\n")

    const formatTime12h = (time24: string) => {
      const [h, m] = time24.split(":")
      const hour24 = Number.parseInt(h)
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24
      const period = hour24 >= 12 ? "PM" : "AM"
      return `${hour12}:${m} ${period}`
    }

    const deliveryTimeText =
      deliveryTime === "now" ? "Lo antes posible (30-60 min)" : `Programado para las ${formatTime12h(scheduledTime)}`

    const message = `🛒 *NUEVO PEDIDO - MERCADO*

👤 *Cliente:* ${customerName}
📞 *Teléfono:* ${phone}

📦 *Productos:*
${itemsList}

📍 *Entrega:*
• Zona: ${selectedZone?.name} (${selectedZone?.distance})
• Dirección: ${specificAddress}
• Tiempo: ${deliveryTimeText}

💰 *Resumen:*
• Subtotal: $${subtotal.toFixed(2)} CUP
• Domicilio: $${deliveryFee.toFixed(2)} CUP
• *Total: $${total.toFixed(2)} CUP*
`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/55904070?text=${encodedMessage}`

    window.open(whatsappUrl, "_blank")

    // Limpiar carrito y cerrar diálogo
    clearCart()
    toggleCart()

    // Resetear formulario
    setCustomerName("")
    setPhone("")
    setSelectedZone(null)
    setSpecificAddress("")
    setDeliveryTime("now")
    setScheduledTime("12:00")
  }

  const renderEmptyCart = () => (
    <div className="text-center py-8 space-y-4">
      <div className="text-6xl">🛒</div>
      <h3 className="text-lg font-semibold text-gray-700">Tu carrito está vacío</h3>
      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
            1
          </span>
          <span>Navega por nuestros productos</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
            2
          </span>
          <span>Toca el botón 🛒 en la esquina de cada producto</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
            3
          </span>
          <span>Selecciona cantidad y confirma</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
            4
          </span>
          <span>¡Tus productos aparecerán aquí!</span>
        </div>
      </div>
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Productos seleccionados</h3>

      {items.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {items.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Cantidad: {item.quantity}</p>

                    {/* Mostrar parámetros seleccionados */}
                    {item.selectedParameters && Object.keys(item.selectedParameters).length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(item.selectedParameters)
                          .filter(([_, quantity]) => quantity > 0)
                          .map(([paramName, quantity]) => (
                            <Badge key={paramName} variant="secondary" className="text-xs">
                              {paramName}: {quantity}
                            </Badge>
                          ))}
                      </div>
                    )}

                    {/* Mostrar agregos seleccionados */}
                    {item.selectedAgregos && Object.keys(item.selectedAgregos).length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(item.selectedAgregos)
                          .filter(([_, quantity]) => quantity > 0)
                          .map(([agregoId, quantity]) => {
                            const agregoName = item.agregosDetails?.find(a => a.id.toString() === agregoId)?.name || `Agrego ${agregoId}`
                            return (
                              <Badge key={agregoId} variant="secondary" className="text-xs bg-green-100 text-green-700">
                                {agregoName}: {quantity}
                              </Badge>
                            )
                          })}
                      </div>
                    )}

                    {/* Mostrar costos adicionales */}
                    {item.costosAdicionales && item.costosAdicionales > 0 && (
                      <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700">
                        Costos adicionales: +${(item.costosAdicionales * item.quantity).toFixed(2)}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${((item.price * item.quantity) +
                      (item.selectedAgregos && item.agregosDetails ?
                        Object.entries(item.selectedAgregos).reduce((sum, [agregoId, qty]) => {
                          const agrego = item.agregosDetails?.find(a => a.id.toString() === agregoId)
                          return sum + (agrego ? agrego.price * qty : 0)
                        }, 0) : 0) +
                      ((item.costosAdicionales || 0) * item.quantity)
                    ).toFixed(2)} CUP
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between items-center font-semibold">
              <span>Subtotal:</span>
              <span className="text-orange-500">${subtotal.toFixed(2)} CUP</span>
            </div>
          </div>

          <Button onClick={handleNext} className="w-full bg-orange-500 hover:bg-orange-600">
            Siguiente <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </>
      )}
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-lg font-semibold">Datos de entrega</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nombre completo</Label>
          <Input
            id="name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Tu nombre completo"
          />
        </div>

        <div>
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+53 5555-1234" />
        </div>

        <div>
          <Label>Zona de entrega</Label>
          <Select
            value={selectedZone?.id || ""}
            onValueChange={(value) => {
              const zone = deliveryZones.find((z) => z.id === value)
              setSelectedZone(zone || null)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona tu zona" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {deliveryZones.map((zone) => (
                <SelectItem key={zone.id} value={zone.id}>
                  <div className="flex justify-between items-center w-full">
                    <span>{zone.name}</span>
                    <span className="text-orange-500 font-semibold ml-2">${zone.price} CUP</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="address">Dirección específica</Label>
          <Input
            id="address"
            value={specificAddress}
            onChange={(e) => setSpecificAddress(e.target.value)}
            placeholder="Calle, número, referencias..."
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label>Tiempo de entrega</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>El tiempo varía dependiendo si su producto es elaborado</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <RadioGroup value={deliveryTime} onValueChange={(value: "now" | "later") => setDeliveryTime(value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="now" id="now" />
              <Label htmlFor="now">Lo antes posible (30-60 min)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="later" id="later" />
              <Label htmlFor="later">Programar para más tarde</Label>
            </div>
          </RadioGroup>

          {deliveryTime === "later" && (
            <div className="mt-3">
              <TimePicker value={scheduledTime} onChange={setScheduledTime} />
            </div>
          )}
        </div>

        <Button
          onClick={handleNext}
          className="w-full bg-orange-500 hover:bg-orange-600"
          disabled={!customerName || !phone || !selectedZone || !specificAddress}
        >
          Siguiente <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-lg font-semibold">Confirmar pedido</h3>
      </div>

      <div className="space-y-4">
        {/* Resumen del cliente */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium mb-2">Datos del cliente</h4>
          <p className="text-sm">
            <strong>Nombre:</strong> {customerName}
          </p>
          <p className="text-sm">
            <strong>Teléfono:</strong> {phone}
          </p>
          <p className="text-sm">
            <strong>Zona:</strong> {selectedZone?.name} ({selectedZone?.distance})
          </p>
          <p className="text-sm">
            <strong>Dirección:</strong> {specificAddress}
          </p>
          <p className="text-sm">
            <strong>Entrega:</strong>{" "}
            {deliveryTime === "now" ? "Lo antes posible" : `Programado para las ${scheduledTime}`}
          </p>
        </div>

        {/* Resumen de productos */}
        <div className="space-y-3">
          <h4 className="font-medium">Productos</h4>
          {items.map((item, index) => {
            // Calcular precio base del producto
            const basePrice = item.price * item.quantity

            // Calcular precio de agregos
            const agregosPrice = item.selectedAgregos && item.agregosDetails
              ? Object.entries(item.selectedAgregos).reduce((sum, [agregoId, qty]) => {
                const agrego = item.agregosDetails?.find(a => a.id.toString() === agregoId)
                return sum + (agrego ? agrego.price * qty : 0)
              }, 0)
              : 0

            // Calcular costos adicionales
            const costosPrice = (item.costosAdicionales || 0) * item.quantity

            // Total del item
            const itemTotal = basePrice + agregosPrice + costosPrice

            return (
              <div key={`${item.id}-${index}`} className="bg-white p-3 rounded-lg border">
                <div className="space-y-2">
                  {/* Producto principal */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-600 ml-2">x{item.quantity}</span>

                      {/* Parámetros */}
                      {item.selectedParameters && Object.keys(item.selectedParameters).length > 0 && (
                        <div className="text-xs text-gray-600 mt-1">
                          Parámetros: {Object.entries(item.selectedParameters)
                            .filter(([_, quantity]) => quantity > 0)
                            .map(([paramName, quantity]) => `${paramName}: ${quantity}`)
                            .join(", ")}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium">${basePrice.toFixed(2)} CUP</span>
                  </div>

                  {/* Agregos */}
                  {item.selectedAgregos && Object.keys(item.selectedAgregos).length > 0 && (
                    <div className="ml-4 space-y-1">
                      {Object.entries(item.selectedAgregos)
                        .filter(([_, quantity]) => quantity > 0)
                        .map(([agregoId, quantity]) => {
                          const agrego = item.agregosDetails?.find(a => a.id.toString() === agregoId)
                          const agregoName = agrego?.name || `Agrego ${agregoId}`
                          const agregoPrice = agrego ? agrego.price * quantity : 0

                          return (
                            <div key={agregoId} className="flex justify-between text-xs text-green-700">
                              <span>+ {agregoName} x{quantity}</span>
                              <span>+${agregoPrice.toFixed(2)} CUP</span>
                            </div>
                          )
                        })}
                    </div>
                  )}

                  {/* Costos adicionales */}
                  {item.costosAdicionales && item.costosAdicionales > 0 && (
                    <div className="ml-4">
                      <div className="flex justify-between text-xs text-amber-700">
                        <span>+ Costos adicionales</span>
                        <span>+${costosPrice.toFixed(2)} CUP</span>
                      </div>
                    </div>
                  )}

                  {/* Total del item */}
                  <div className="flex justify-between font-semibold text-sm border-t pt-2">
                    <span>Subtotal item:</span>
                    <span>${itemTotal.toFixed(2)} CUP</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Resumen de costos */}
        <div className="border-t pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal productos:</span>
            <span>${subtotal.toFixed(2)} CUP</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Domicilio ({selectedZone?.name}):</span>
            <span>${deliveryFee.toFixed(2)} CUP</span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>Total:</span>
            <span className="text-orange-500">${total.toFixed(2)} CUP</span>
          </div>
        </div>

        <Button onClick={handleConfirmOrder} className="w-full bg-green-600 hover:bg-green-700">
          Confirmar pedido por WhatsApp
        </Button>
      </div>
    </div>
  )


  return (
    <Dialog open={isOpen} onOpenChange={toggleCart}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Carrito de compras</span>
            {items.length > 0 && step === 1 && (
              <Button variant="ghost" size="sm" onClick={clearCart} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </DialogContent>
    </Dialog>
  )
}
