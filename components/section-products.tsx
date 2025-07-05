"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "./product-card"
import { SearchBar } from "./search-bar"
import { LoadingMenu } from "./loading-menu"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url?: string
  is_featured: boolean
  is_available: boolean
  stock_quantity?: number
  section?: string
}

interface SectionProductsProps {
  sectionName: string
  onBack: () => void
}

export function SectionProducts({ sectionName, onBack }: SectionProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Filtrar productos basado en la búsqueda
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Función para cargar productos de la sección
  const fetchSectionProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/menu?section=${encodeURIComponent(sectionName)}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error ${response.status}`)
      }

      const data = await response.json()
      setProducts(data.products || [])
    } catch (err) {
      console.error("Error fetching section products:", err)
      setError(err instanceof Error ? err.message : "Error al cargar los productos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSectionProducts()
  }, [sectionName])

  if (loading) {
    return <LoadingMenu />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header con botón de regreso */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2 hover:bg-orange-50 border-orange-200 bg-transparent"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{sectionName}</h1>
          <p className="text-gray-600">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""} disponible
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-8">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          totalProducts={products.length}
          filteredCount={filteredProducts.length}
          placeholder={`Buscar en ${sectionName}...`}
        />
      </div>

      {/* Manejo de errores */}
      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
            <button onClick={fetchSectionProducts} className="ml-2 underline hover:no-underline">
              Reintentar
            </button>
          </AlertDescription>
        </Alert>
      )}

      {/* Grid de productos */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">
            {searchTerm ? "No se encontraron productos" : "No hay productos disponibles en esta sección"}
          </div>
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="text-orange-500 hover:text-orange-600 underline">
              Limpiar búsqueda
            </button>
          )}
        </div>
      )}
    </div>
  )
}
