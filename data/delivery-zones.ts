export interface DeliveryZone {
  name: string
  distance: string
  price: number
  zone: string
}

export const deliveryZones: DeliveryZone[] = [
  // ZONA CENTRO (0-2 km)
  { name: "Centro Histórico", distance: "0-1 km", price: 50, zone: "ZONA CENTRO (0-2 km)" },
  { name: "Punta Gorda", distance: "1-2 km", price: 75, zone: "ZONA CENTRO (0-2 km)" },
  { name: "La Juanita", distance: "1.5 km", price: 75, zone: "ZONA CENTRO (0-2 km)" },
  { name: "Pueblo Nuevo", distance: "1-2 km", price: 75, zone: "ZONA CENTRO (0-2 km)" },

  // ZONA INTERMEDIA (2-5 km)
  { name: "Reina", distance: "2-3 km", price: 100, zone: "ZONA INTERMEDIA (2-5 km)" },
  { name: "Junco Sur", distance: "3-4 km", price: 125, zone: "ZONA INTERMEDIA (2-5 km)" },
  { name: "La Gloria", distance: "3-4 km", price: 125, zone: "ZONA INTERMEDIA (2-5 km)" },
  { name: "Tulipán", distance: "3-4 km", price: 125, zone: "ZONA INTERMEDIA (2-5 km)" },
  { name: "Sandino", distance: "4-5 km", price: 150, zone: "ZONA INTERMEDIA (2-5 km)" },
  { name: "Prado", distance: "2-3 km", price: 100, zone: "ZONA INTERMEDIA (2-5 km)" },
  { name: "Caonao", distance: "4-5 km", price: 150, zone: "ZONA INTERMEDIA (2-5 km)" },

  // ZONA PERIFÉRICA (5-10 km)
  { name: "Pastorita", distance: "6-7 km", price: 175, zone: "ZONA PERIFÉRICA (5-10 km)" },
  { name: "La Sierrita", distance: "7-8 km", price: 200, zone: "ZONA PERIFÉRICA (5-10 km)" },
  { name: "Ciego Montero", distance: "8-10 km", price: 225, zone: "ZONA PERIFÉRICA (5-10 km)" },
  { name: "Rancho Luna", distance: "15-18 km", price: 300, zone: "ZONA PERIFÉRICA (5-10 km)" },
  { name: "Castillo de Jagua", distance: "8-10 km", price: 225, zone: "ZONA PERIFÉRICA (5-10 km)" },

  // ZONA LEJANA (10+ km)
  { name: "Palmira", distance: "25-30 km", price: 400, zone: "ZONA LEJANA (10+ km)" },
  { name: "Lajas", distance: "30-35 km", price: 450, zone: "ZONA LEJANA (10+ km)" },
  { name: "Cruces", distance: "35-40 km", price: 500, zone: "ZONA LEJANA (10+ km)" },
  { name: "Rodas", distance: "45-50 km", price: 600, zone: "ZONA LEJANA (10+ km)" },
  { name: "Aguada de Pasajeros", distance: "50-55 km", price: 650, zone: "ZONA LEJANA (10+ km)" },
]
