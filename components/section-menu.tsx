"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface Section {
  name: string
  product_count: number
  sample_image?: string
  order?: number
}


interface SectionMenuProps {
  sections: Section[]
  activeSection: string
  onSectionClick: (sectionName: string) => void
}

export function SectionMenu({ sections, activeSection, onSectionClick }: SectionMenuProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to active section
  useEffect(() => {
    if (activeSection && scrollContainerRef.current) {
      const activeButton = scrollContainerRef.current.querySelector(`[data-section="${activeSection}"]`)
      if (activeButton) {
        activeButton.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
      }
    }
  }, [activeSection])

  return (
    <div className="w-full">
      {/* Container scrolleable sin flechas */}
      <div
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-2 pb-1"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {sections.map((section) => (
          <Button
            key={section.name}
            data-section={section.name}
            variant={activeSection === section.name ? "default" : "outline"}
            size="sm"
            onClick={() => onSectionClick(section.name)}
            className={`whitespace-nowrap flex-shrink-0 h-8 text-xs ${activeSection === section.name
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "hover:bg-orange-50 border-orange-200"
              }`}
          >
            {section.name}
            <span className="ml-1 text-xs opacity-75">({section.product_count})</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
