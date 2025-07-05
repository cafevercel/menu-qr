"use client"

import Image from "next/image"
import { useState } from "react"

interface CloudinaryImageProps {
  src?: string
  alt: string
  width: number
  height: number
  className?: string
  fallbackIcon?: string
}

export function CloudinaryImage({ src, alt, width, height, className = "", fallbackIcon = "🖼️" }: CloudinaryImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Si no hay src o hay error, mostrar fallback
  if (!src || imageError) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <span className="text-5xl opacity-50">{fallbackIcon}</span>
      </div>
    )
  }

  // Construir URL de Cloudinary optimizada
  const cloudinaryUrl = src.startsWith("http")
    ? src
    : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dqikq2ycg"}/image/upload/c_fill,w_${width},h_${height},g_center,f_auto,q_auto/${src}`

  return (
    <div className={`${className} relative overflow-hidden`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <span className="text-2xl opacity-50">⏳</span>
        </div>
      )}
      <Image
        src={cloudinaryUrl || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true)
          setIsLoading(false)
        }}
        priority={false}
      />
    </div>
  )
}
