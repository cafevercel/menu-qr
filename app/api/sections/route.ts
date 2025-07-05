import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

// Usar las variables de entorno que ya tienes configuradas
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL

if (!databaseUrl) {
  console.error("❌ No database URL found. Available env vars:", {
    DATABASE_URL: !!process.env.DATABASE_URL,
    POSTGRES_URL: !!process.env.POSTGRES_URL,
    NODE_ENV: process.env.NODE_ENV,
  })
}

const sql = databaseUrl ? neon(databaseUrl) : null

export async function GET() {
  // Verificar configuración de base de datos
  if (!sql) {
    console.error("❌ Database not configured. Missing DATABASE_URL or POSTGRES_URL environment variable")
    return NextResponse.json(
      {
        error: "Database not configured",
        message: "Missing DATABASE_URL environment variable",
        available_vars: {
          DATABASE_URL: !!process.env.DATABASE_URL,
          POSTGRES_URL: !!process.env.POSTGRES_URL,
        },
      },
      { status: 500 },
    )
  }

  try {
    console.log("🔍 Fetching sections from productos table with custom order...")

    // Verificar conexión a la base de datos
    await sql`SELECT 1 as test`
    console.log("✅ Database connection successful")

    // Obtener todas las secciones únicas con conteo de productos disponibles
    // ordenadas según la tabla orden_seccion
    const secciones = await sql`
      SELECT 
        p.seccion as name,
        COUNT(p.id) as product_count,
        MIN(p.foto) as sample_image,
        COALESCE(os.orden, 999) as orden
      FROM productos p
      JOIN usuario_productos up ON p.id = up.producto_id
      LEFT JOIN orden_seccion os ON p.seccion = os.seccion
      WHERE up.cantidad > 0 
        AND p.seccion IS NOT NULL 
        AND p.seccion != ''
      GROUP BY p.seccion, os.orden
      ORDER BY COALESCE(os.orden, 999) ASC, p.seccion ASC
    `

    console.log(`✅ Found ${secciones.length} sections total with custom order`)

    return NextResponse.json({
      sections: secciones.map((s) => ({
        name: s.name,
        product_count: Number.parseInt(s.product_count),
        sample_image: s.sample_image,
        orden: Number.parseInt(s.orden), // Incluir el orden para debug si necesitas
      })),
      timestamp: new Date().toISOString(),
      total_sections: secciones.length,
    })
  } catch (error) {
    console.error("❌ Error fetching sections:", error)

    return NextResponse.json(
      {
        error: "Error al cargar las secciones",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
