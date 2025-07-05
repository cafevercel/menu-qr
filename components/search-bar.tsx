"use client"

import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  totalProducts: number
  filteredCount: number
  placeholder?: string
}

export function SearchBar({
  searchTerm,
  onSearchChange,
  totalProducts,
  filteredCount,
  placeholder = "Buscar productos...",
}: SearchBarProps) {
  return (
    <div className="relative max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10 h-9 rounded-full border-2 border-gray-200 focus:border-orange-500 focus:ring-orange-500 text-sm"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSearchChange("")}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100 rounded-full"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {searchTerm && (
        <div className="text-center mt-1 text-xs text-gray-600">
          {filteredCount} de {totalProducts} productos
        </div>
      )}
    </div>
  )
}
