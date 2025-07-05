"use client"

import { ProductCard } from "./product-card"

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

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
