"use client"

import { useState, useEffect, useRef } from "react"
import { MenuHeader } from "@/components/menu-header"
import { SearchBar } from "@/components/search-bar"
import { SectionMenu } from "@/components/section-menu"
import { ProductGrid } from "@/components/product-grid"
import { LoadingMenu } from "@/components/loading-menu"
import { FloatingCartButton } from "@/components/floating-cart-button"
import { CartDialog } from "@/components/cart-dialog"
import { AlertCircle, Wifi, WifiOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
  has_parameters?: boolean
  parameters?: any[]
}

interface Section {
  name: string
  product_count: number
  sample_image?: string
}

interface SectionsData {
  sections: Section[]
  timestamp: string
  total_sections: number
}

export default function MenuPage() {
  const [sectionsData, setSectionsData] = useState<SectionsData | null>(null)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeSection, setActiveSection] = useState<string>("")
  const [isOnline, setIsOnline] = useState(true)
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  // Filtrar productos basado en la búsqueda
  const filteredProducts = allProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Agrupar productos por sección y ordenar alfabéticamente
  const productsBySection = filteredProducts.reduce(
    (acc, product) => {
      const section = product.section || "Sin categoría"
      if (!acc[section]) {
        acc[section] = []
      }
      acc[section].push(product)
      return acc
    },
    {} as { [key: string]: Product[] },
  )

  // Ordenar las secciones alfabéticamente
  const sortedSections = sectionsData
    ? sectionsData.sections
      .map(section => section.name)
      .filter(sectionName => productsBySection[sectionName]) // Solo secciones con productos
    : Object.keys(productsBySection).sort((a, b) => a.localeCompare(b)) // Fallback si no hay sectionsData

  // Función para cargar las secciones
  const fetchSections = async () => {
    try {
      setError(null)
      const response = await fetch("/api/sections")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error ${response.status}`)
      }

      const data = await response.json()
      // Ordenar las secciones alfabéticamente
      setSectionsData(data)
    } catch (err) {
      console.error("Error fetching sections:", err)
      setError(err instanceof Error ? err.message : "Error al cargar las secciones")
    }
  }

  // Función para cargar todos los productos
  const fetchAllProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/menu")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error ${response.status}`)
      }

      const data = await response.json()
      setAllProducts(data.products || [])
    } catch (err) {
      console.error("Error fetching products:", err)
      setError(err instanceof Error ? err.message : "Error al cargar los productos")
    } finally {
      setLoading(false)
    }
  }

  // Detectar estado de conexión
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Cargar datos iniciales
  useEffect(() => {
    fetchSections()
    fetchAllProducts()
  }, [])

  // Scroll spy para detectar sección activa
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200

      for (const sectionName of sortedSections) {
        const ref = sectionRefs.current[sectionName]
        if (ref && ref.offsetTop <= scrollPosition && ref.offsetTop + ref.offsetHeight > scrollPosition) {
          setActiveSection(sectionName)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sortedSections])

  // Función para scroll a sección
  const scrollToSection = (sectionName: string) => {
    const ref = sectionRefs.current[sectionName]
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  if (loading) {
    return <LoadingMenu />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MenuHeader />

      {/* Indicador de conexión - NO sticky */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-2">
          <div className="flex items-center justify-center">
            {isOnline ? (
              <div className="flex items-center gap-1 text-green-600">
                <Wifi className="h-4 w-4" />
                <span className="text-sm">En línea</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-600">
                <WifiOff className="h-4 w-4" />
                <span className="text-sm">Sin conexión</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barra de búsqueda y menú - STICKY como una unidad */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          {/* Barra de búsqueda más delgada */}
          <div className="py-3">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              totalProducts={allProducts.length}
              filteredCount={filteredProducts.length}
              placeholder="Buscar productos..."
            />
          </div>

          {/* Menu horizontal de secciones - sin espacio extra */}
          {sectionsData && (
            <div className="pb-2">
              <SectionMenu
                sections={sectionsData.sections}
                activeSection={activeSection}
                onSectionClick={scrollToSection}
              />
            </div>
          )}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Manejo de errores */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
              <button
                onClick={() => {
                  fetchSections()
                  fetchAllProducts()
                }}
                className="ml-2 underline hover:no-underline"
              >
                Reintentar
              </button>
            </AlertDescription>
          </Alert>
        )}

        {/* Grid de productos por sección - ordenado alfabéticamente */}
        {sortedSections.length > 0 ? (
          <div className="space-y-8">
            {sortedSections.map((sectionName) => (
              <div
                key={sectionName}
                ref={(el) => (sectionRefs.current[sectionName] = el)}
                className="section-container"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">{sectionName}</h2>
                <ProductGrid products={productsBySection[sectionName]} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">
              {searchTerm ? "No se encontraron productos" : "No hay productos disponibles"}
            </div>
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="text-orange-500 hover:text-orange-600 underline">
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}
      </main>

      {/* Componentes del carrito */}
      <FloatingCartButton />
      <CartDialog />
    </div>
  )
}
