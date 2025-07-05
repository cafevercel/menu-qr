"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CloudinaryImage } from "./cloudinary-image"
import { ChevronRight } from "lucide-react"

interface Section {
  name: string
  product_count: number
  sample_image?: string
  order?: number
}



interface SectionCardProps {
  section: Section
  onClick: () => void
}

export function SectionCard({ section, onClick }: SectionCardProps) {
  return (
    <Card
      className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] shadow-lg border-0 cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="p-0 h-32 flex">
        <div className="w-32 h-32 flex-shrink-0 relative">
          <CloudinaryImage
            src={section.sample_image}
            alt={section.name}
            width={128}
            height={128}
            className="w-full h-full object-cover"
            fallbackIcon="📦"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
        </div>

        <div className="flex-1 p-4 flex items-center justify-between bg-white">
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-orange-500 transition-colors">
              {section.name}
            </h3>
            <p className="text-sm text-gray-600">
              {section.product_count} producto{section.product_count !== 1 ? "s" : ""}
            </p>
          </div>

          <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-orange-500 transition-colors" />
        </div>
      </CardContent>
    </Card>
  )
}
