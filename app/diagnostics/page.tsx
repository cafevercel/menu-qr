"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Server, Database } from "lucide-react"

interface DiagnosticResult {
  name: string
  status: "success" | "error" | "warning"
  message: string
  details?: any
}

export default function DiagnosticsPage() {
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [loading, setLoading] = useState(false)

  const runDiagnostics = async () => {
    setLoading(true)
    const diagnostics: DiagnosticResult[] = []

    // 1. Verificar variables de entorno del cliente
    diagnostics.push({
      name: "Variables de entorno públicas",
      status: "success", // Ya no necesitamos Cloudinary para funcionar
      message: "Configuración básica completada",
      details: {
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        NEXT_PUBLIC_API_URL: !!process.env.NEXT_PUBLIC_API_URL,
        note: "Cloudinary es opcional para el funcionamiento básico",
      },
    })

    // 2. Verificar conexión a la API
    try {
      const response = await fetch("/api/menu", { method: "HEAD" })
      const headers = Object.fromEntries(response.headers.entries())

      if (response.ok) {
        diagnostics.push({
          name: "Conexión a la base de datos",
          status: "success",
          message: "Base de datos conectada correctamente",
          details: {
            status: response.status,
            database_status: headers["x-database-status"],
            menu_stats: headers["x-menu-stats"] ? JSON.parse(headers["x-menu-stats"]) : null,
          },
        })
      } else {
        diagnostics.push({
          name: "Conexión a la base de datos",
          status: "error",
          message: headers["x-error"] || "Error de conexión",
          details: {
            status: response.status,
            error: headers["x-error"],
          },
        })
      }
    } catch (error) {
      diagnostics.push({
        name: "Conexión a la API",
        status: "error",
        message: "No se puede conectar a la API",
        details: { error: error.message },
      })
    }

    // 3. Verificar estructura de la base de datos
    try {
      const response = await fetch("/api/menu")
      const data = await response.json()

      if (response.ok) {
        const totalProducts = data.categories?.reduce((sum, cat) => sum + (cat.products?.length || 0), 0) || 0

        diagnostics.push({
          name: "Estructura de la base de datos",
          status: "success",
          message: "Tabla 'productos' encontrada y accesible",
          details: {
            total_products_in_db: data.total_products,
            products_in_menu: totalProducts,
            categories_created: data.categories?.length || 0,
            table_structure: "Usando tabla 'productos' existente",
          },
        })

        diagnostics.push({
          name: "Datos del menú",
          status: totalProducts > 0 ? "success" : "warning",
          message:
            totalProducts > 0
              ? `Menú generado: ${data.categories?.length || 0} categorías, ${totalProducts} productos`
              : "No hay productos con stock disponible",
          details: {
            categories: data.categories?.length || 0,
            total_products: totalProducts,
            featured_products: data.featured?.length || 0,
            timestamp: data.timestamp,
          },
        })
      } else {
        diagnostics.push({
          name: "Datos del menú",
          status: "error",
          message: data.error || "Error al cargar el menú",
          details: data,
        })
      }
    } catch (error) {
      diagnostics.push({
        name: "Datos del menú",
        status: "error",
        message: "Error al obtener datos del menú",
        details: { error: error.message },
      })
    }

    setResults(diagnostics)
    setLoading(false)
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
              <Database className="h-8 w-8" />
              Diagnóstico del Sistema
            </h1>
            <p className="text-gray-600">Verificación del menú digital de Mi Tienda Cuba</p>
          </div>

          <div className="mb-6 text-center">
            <Button onClick={runDiagnostics} disabled={loading} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Ejecutando diagnóstico..." : "Ejecutar diagnóstico"}
            </Button>
          </div>

          <div className="grid gap-6">
            {results.map((result, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <span>{result.name}</span>
                    </div>
                    <Badge className={getStatusColor(result.status)}>{result.status.toUpperCase()}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{result.message}</p>

                  {result.details && (
                    <details className="bg-gray-50 p-4 rounded-lg">
                      <summary className="cursor-pointer font-medium text-gray-600 mb-2">Ver detalles técnicos</summary>
                      <pre className="text-xs text-gray-600 overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {results.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Resumen del estado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {results.filter((r) => r.status === "success").length}
                    </div>
                    <div className="text-sm text-gray-600">Exitosos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {results.filter((r) => r.status === "warning").length}
                    </div>
                    <div className="text-sm text-gray-600">Advertencias</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">
                      {results.filter((r) => r.status === "error").length}
                    </div>
                    <div className="text-sm text-gray-600">Errores</div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">ℹ️ Información importante:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• El menú usa tu tabla 'productos' existente</li>
                    <li>• Las categorías se generan automáticamente por nombre de producto</li>
                    <li>• Solo se muestran productos con stock {">"} 0</li>
                    <li>• Los productos destacados son aquellos con stock {">"} 10</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 text-center space-x-4">
            <Button variant="outline" asChild>
              <a href="/">Volver al menú</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/api/menu" target="_blank" rel="noreferrer">
                Ver API JSON
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
