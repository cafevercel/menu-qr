import { Skeleton } from "@/components/ui/skeleton"
import { MenuHeader } from "./menu-header"

export function LoadingMenu() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MenuHeader />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Skeleton de barra de búsqueda */}
        <div className="mb-8">
          <Skeleton className="h-12 w-full max-w-md mx-auto rounded-full" />
        </div>

        {/* Skeleton del grid de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
              <Skeleton className="w-full h-72" />
              <div className="p-4 bg-white h-24 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
