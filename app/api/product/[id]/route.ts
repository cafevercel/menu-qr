import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL!)

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const productId = Number.parseInt(params.id)

    if (isNaN(productId)) {
      return NextResponse.json({ error: "ID de producto inválido" }, { status: 400 })
    }

    // Obtener información detallada del producto
    const product = await sql`
      SELECT 
        p.id,
        p.nombre as name,
        p.precio as price,
        p.cantidad as stock_quantity,
        p.foto as image_url,
        p.tiene_parametros,
        p.precio_compra,
        p.porcentaje_ganancia
      FROM productos p
      WHERE p.id = ${productId}
    `

    if (product.length === 0) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    // Obtener parámetros del producto si los tiene
    let parameters = []
    if (product[0].tiene_parametros) {
      parameters = await sql`
        SELECT 
          nombre as name,
          cantidad as quantity
        FROM producto_parametros
        WHERE producto_id = ${productId}
        ORDER BY nombre
      `
    }

    // Obtener historial de ventas recientes (últimas 10)
    const recentSales = await sql`
      SELECT 
        v.cantidad,
        v.precio_unitario,
        v.total,
        v.fecha,
        u.nombre as vendedor_nombre
      FROM ventas v
      LEFT JOIN usuarios u ON v.vendedor = u.id
      WHERE v.producto = ${productId}
      ORDER BY v.fecha DESC
      LIMIT 10
    `

    const productData = {
      ...product[0],
      price: Number.parseFloat(product[0].price),
      precio_compra: Number.parseFloat(product[0].precio_compra || 0),
      porcentaje_ganancia: Number.parseFloat(product[0].porcentaje_ganancia || 0),
      is_available: product[0].stock_quantity > 0,
      parameters,
      recent_sales: recentSales.map((sale) => ({
        ...sale,
        precio_unitario: Number.parseFloat(sale.precio_unitario),
        total: Number.parseFloat(sale.total),
      })),
    }

    return NextResponse.json(productData)
  } catch (error) {
    console.error("Error fetching product details:", error)
    return NextResponse.json({ error: "Error al obtener detalles del producto" }, { status: 500 })
  }
}
