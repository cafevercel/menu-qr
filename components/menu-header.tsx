"use client"

import { Clock, MapPin } from "lucide-react"
import Image from "next/image"

export function MenuHeader() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src="/logo-mercado.png"
              alt="Mercado Logo"
              width={200}
              height={80}
              className="h-16 w-auto"
              priority
            />
          </div>

          {/* Información del negocio */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>9AM a 11PM</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span className="text-center sm:text-left">Cienfuegos, Avenida Dorticos (48) entre 27 y 29 #2709</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
