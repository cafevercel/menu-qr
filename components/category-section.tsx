import { ProductCard } from "./product-card"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url?: string
  is_featured: boolean
  is_available: boolean
}

interface Category {
  id: number
  name: string
  description?: string
  products: Product[]
}

interface CategorySectionProps {
  category: Category
}

export function CategorySection({ category }: CategorySectionProps) {
  if (!category.products || category.products.length === 0) {
    return null
  }

  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h2>
        {category.description && <p className="text-gray-600">{category.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
