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

export async function GET(request: Request) {
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
    // Obtener parámetros de la URL
    const { searchParams } = new URL(request.url)
    const section = searchParams.get("section")

    console.log(`🔍 Fetching products${section ? ` for section: ${section}` : " (all sections)"}...`)

    // Verificar conexión a la base de datos
    await sql`SELECT 1 as test`
    console.log("✅ Database connection successful")

    // Construir la consulta con filtro opcional de sección
    let productos
    if (section) {
      productos = await sql`
  SELECT 
    p.id,
    p.nombre as name,
    p.precio as price,
    up.cantidad as stock_quantity,
    p.foto as image_url,
    p.tiene_parametros,
    p.precio_compra,
    p.porcentaje_ganancia,
    p.seccion as section,
    p.tiene_costo,
    p.tiene_agrego
  FROM productos p
  JOIN usuario_productos up ON p.id = up.producto_id
  WHERE up.cantidad > 0 AND p.seccion = ${section}
  ORDER BY p.nombre ASC
      `
    } else {
      productos = await sql`
  SELECT 
    p.id,
    p.nombre as name,
    p.precio as price,
    up.cantidad as stock_quantity,
    p.foto as image_url,
    p.tiene_parametros,
    p.precio_compra,
    p.porcentaje_ganancia,
    p.seccion as section,
    p.tiene_costo,
    p.tiene_agrego
  FROM productos p
  JOIN usuario_productos up ON p.id = up.producto_id
  WHERE up.cantidad > 0
  ORDER BY p.nombre ASC
      `
    }

    // Para cada producto que tiene parámetros, obtener sus parámetros disponibles
    const productosConParametros = await Promise.all(
      productos.map(async (producto) => {
        let parametros = []

        if (producto.tiene_parametros) {
          // Obtener parámetros disponibles para este producto
          const parametrosDisponibles = await sql`
            SELECT 
              pp.nombre as parameter_name,
              upp.cantidad as available_quantity
            FROM producto_parametros pp
            JOIN usuario_producto_parametros upp ON pp.producto_id = upp.producto_id AND pp.nombre = upp.nombre
            WHERE pp.producto_id = ${producto.id} 
            AND upp.cantidad > 0
            ORDER BY pp.nombre ASC
          `

          parametros = parametrosDisponibles.map((param) => ({
            name: param.parameter_name,
            available_quantity: param.available_quantity,
          }))
        }

        return {
          id: producto.id,
          name: producto.name,
          description: `Disponible en stock`,
          price: Number.parseFloat(producto.price),
          image_url: producto.image_url,
          is_available: producto.stock_quantity > 0,
          is_featured: false,
          stock_quantity: producto.stock_quantity,
          display_order: 0,
          section: producto.section,
          has_parameters: producto.tiene_parametros,
          has_agregos: producto.tiene_agrego,
          has_costos: producto.tiene_costo,
          parameters: parametros,
        }
      }),
    )

    console.log(`✅ Found ${productos.length} products total`)

    return NextResponse.json({
      products: productosConParametros,
      section: section,
      timestamp: new Date().toISOString(),
      total_products: productos.length,
    })
  } catch (error) {
    console.error("❌ Error fetching menu:", error)

    // Verificar si es un error de conexión o de SQL
    const isConnectionError = error.message?.includes("connect") || error.message?.includes("timeout")
    const isTableError = error.message?.includes("relation") || error.message?.includes("does not exist")

    return NextResponse.json(
      {
        error: "Error al cargar el menú",
        type: isConnectionError ? "connection" : isTableError ? "table" : "unknown",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
        suggestion: isTableError
          ? "La tabla 'productos' o 'usuario_productos' no existe o no es accesible."
          : isConnectionError
            ? "Verifica la configuración de la base de datos."
            : "Error interno del servidor.",
      },
      { status: 500 },
    )
  }
}

// Endpoint para verificar la configuración
export async function HEAD() {
  if (!sql) {
    return new NextResponse(null, {
      status: 500,
      headers: {
        "X-Error": "Database not configured",
      },
    })
  }

  try {
    await sql`SELECT 1 as test`

    const stats = await sql`
      SELECT 
        COUNT(*) as total_products,
        COUNT(CASE WHEN up.cantidad > 0 THEN 1 END) as available_products,
        AVG(p.precio) as average_price
      FROM productos p
      JOIN usuario_productos up ON p.id = up.producto_id
    `

    return new NextResponse(null, {
      status: 200,
      headers: {
        "X-Menu-Stats": JSON.stringify(stats[0]),
        "X-Last-Updated": new Date().toISOString(),
        "X-Database-Status": "connected",
      },
    })
  } catch (error) {
    return new NextResponse(null, {
      status: 500,
      headers: {
        "X-Error": error.message,
        "X-Database-Status": "error",
      },
    })
  }
}
