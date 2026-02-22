"use client"

import { useEffect } from "react"

// URL del backend para registrar visitas
const API_URL_VISITAS = process.env.NEXT_PUBLIC_API_URL_VISITAS || "https://cafeteria-mitienda.vercel.app"

export const useRegistrarVisita = () => {
  useEffect(() => {
    const registrarVisita = async () => {
      try {
        // Obtener la URL actual del menú
        const menuUrl = window.location.origin + window.location.pathname
        
        await fetch(`${API_URL_VISITAS}/api/menu/visitas`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: menuUrl,
            user_agent: navigator.userAgent,
            referrer: document.referrer || undefined
          }),
        })
      } catch (error) {
        // No mostrar error al usuario, es solo para estadísticas
        console.error("Error registrando visita:", error)
      }
    }

    registrarVisita()
  }, [])
}
