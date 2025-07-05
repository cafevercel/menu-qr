"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CloudinaryImage } from "./cloudinary-image"
import { AddToCartButton } from "./add-to-cart-button"
import { Eye, X } from "lucide-react"

interface ProductParameter {
  name: string
  available_quantity: number
}

interface ProductCardProps {
  product: {
    id: number
    name: string
    price: number
    image_url?: string
    has_parameters?: boolean
    parameters?: ProductParameter[]
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const [showImageModal, setShowImageModal] = useState(false)

  // Función para renderizar parámetros con límite de espacio
  const renderParameters = () => {
    if (!product.has_parameters || !product.parameters || product.parameters.length === 0) {
      return null
    }

    const parameters = product.parameters
    const maxVisible = 2 // Máximo 2 parámetros visibles para mantener el diseño

    if (parameters.length <= maxVisible) {
      // Si hay pocos parámetros, mostrar todos
      return (
        <div className="flex flex-wrap gap-1">
          {parameters.map((param, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-[10px] px-1 py-0 bg-orange-100 text-orange-700 leading-none"
            >
              {param.name}
            </Badge>
          ))}
        </div>
      )
    } else {
      // Si hay muchos parámetros, mostrar algunos y "+X"
      const visibleParams = parameters.slice(0, maxVisible - 1)
      const remainingCount = parameters.length - visibleParams.length

      return (
        <div className="flex flex-wrap gap-1">
          {visibleParams.map((param, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-[10px] px-1 py-0 bg-orange-100 text-orange-700 leading-none"
            >
              {param.name}
            </Badge>
          ))}
          <Badge
            variant="secondary"
            className="text-[10px] px-1 py-0 bg-orange-200 text-orange-800 leading-none font-semibold"
          >
            +{remainingCount}
          </Badge>
        </div>
      )
    }
  }

  return (
    <>
      {/* Tarjeta con altura fija y estructura consistente */}
      <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 h-64 flex flex-col">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Imagen del producto - altura fija */}
          <div className="relative bg-gray-100 h-40 flex-shrink-0">
            <CloudinaryImage
              src={product.image_url}
              alt={product.name}
              width={150}
              height={150}
              className="w-full h-full object-cover"
              fallbackIcon="🍽️"
            />

            {/* Botón de ojo para ver imagen completa */}
            <Button
              size="sm"
              onClick={() => setShowImageModal(true)}
              className="absolute top-1 left-1 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 text-white p-0 backdrop-blur-sm transition-all"
            >
              <Eye className="h-3 w-3" />
            </Button>
          </div>

          {/* Información del producto - altura fija de 96px (24 * 4) */}
          <div className="h-24 p-2 flex flex-col justify-between bg-white flex-shrink-0">
            <div className="flex-1 min-h-0">
              <h3 className="font-medium text-xs line-clamp-2 mb-1 text-gray-900 leading-tight">{product.name}</h3>

              {/* Mostrar parámetros con límite inteligente */}
              {renderParameters()}
            </div>

            {/* Precio y botón - siempre en la parte inferior */}
            <div className="flex items-center justify-between mt-auto pt-1">
              <p className="text-orange-500 font-bold text-xs">${product.price.toFixed(2)}</p>
              <AddToCartButton product={product} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de pantalla completa para mostrar imagen */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          {/* Botón de cerrar */}
          <Button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white p-0 z-10 backdrop-blur-sm"
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Contenedor scrolleable para la imagen */}
          <div className="w-full h-full overflow-auto flex flex-col items-center justify-start pt-16 pb-4">
            {/* Imagen en tamaño real */}
            <div className="max-w-full">
              <CloudinaryImage
                src={product.image_url}
                alt={product.name}
                width={800}
                height={800}
                className="max-w-full h-auto object-contain"
                fallbackIcon="🍽️"
              />
            </div>

            {/* Información del producto debajo de la imagen */}
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 mt-4 max-w-sm w-full mx-auto">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.name}</h3>
              <p className="text-orange-500 font-bold text-xl">${product.price.toFixed(2)}</p>

              {/* Mostrar parámetros si los tiene */}
              {product.has_parameters && product.parameters && product.parameters.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Opciones disponibles:</p>
                  <div className="flex flex-wrap gap-1">
                    {product.parameters.map((param, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs px-2 py-1 bg-orange-100 text-orange-700"
                      >
                        {param.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
