"use client"

import { createContext, useContext, useReducer, useMemo, type ReactNode } from "react"

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image_url?: string
  selectedParameters?: { [parameterName: string]: number } // nombre del parámetro -> cantidad
}

export interface DeliveryZone {
  id: string
  name: string
  distance: string
  price: number
  zone: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  step: 1 | 2 | 3
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: any; quantity: number; selectedParameters?: { [key: string]: number } } }
  | { type: "REMOVE_ITEM"; payload: { id: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "SET_STEP"; payload: 1 | 2 | 3 }

const initialState: CartState = {
  items: [],
  isOpen: false,
  step: 1,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity, selectedParameters } = action.payload
      const existingItem = state.items.find(
        (item) =>
          item.id === product.id && JSON.stringify(item.selectedParameters) === JSON.stringify(selectedParameters),
      )

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === product.id && JSON.stringify(item.selectedParameters) === JSON.stringify(selectedParameters)
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          ),
        }
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
            image_url: product.image_url,
            selectedParameters,
          },
        ],
      }
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        step: 1,
      }

    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: !state.isOpen,
      }

    case "SET_STEP":
      return {
        ...state,
        step: action.payload,
      }

    default:
      return state
  }
}

interface CartContextType {
  items: CartItem[]
  isOpen: boolean
  step: 1 | 2 | 3
  addToCart: (product: any, quantity: number, selectedParameters?: { [key: string]: number }) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
  toggleCart: () => void
  setStep: (step: 1 | 2 | 3) => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const contextValue = useMemo(() => {
    return {
      items: state.items,
      isOpen: state.isOpen,
      step: state.step,
      addToCart: (product: any, quantity: number, selectedParameters?: { [key: string]: number }) => {
        dispatch({ type: "ADD_ITEM", payload: { product, quantity, selectedParameters } })
      },
      removeFromCart: (id: number) => {
        dispatch({ type: "REMOVE_ITEM", payload: { id } })
      },
      clearCart: () => {
        dispatch({ type: "CLEAR_CART" })
      },
      toggleCart: () => {
        dispatch({ type: "TOGGLE_CART" })
      },
      setStep: (step: 1 | 2 | 3) => {
        dispatch({ type: "SET_STEP", payload: step })
      },
      getTotalItems: () => {
        return state.items.reduce((total, item) => total + item.quantity, 0)
      },
      getTotalPrice: () => {
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }
  }, [state])

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

// Datos de zonas de entrega actualizados
export const deliveryZones: DeliveryZone[] = [
  { id: "punta-gorda", name: "Punta Gorda", distance: "", price: 200, zone: "ZONA 200$" },
  { id: "los-obreros", name: "Los Obreros", distance: "", price: 300, zone: "ZONA 300$" },
  { id: "arizona", name: "Arizona", distance: "", price: 200, zone: "ZONA 200$" },
  { id: "junco-sur", name: "Junco Sur", distance: "", price: 300, zone: "ZONA 300$" },
  { id: "la-josefa", name: "La Josefa", distance: "", price: 500, zone: "ZONA 500$" },
  { id: "calzada", name: "Calzada", distance: "", price: 200, zone: "ZONA 200$" },
  { id: "pastorita", name: "Pastorita", distance: "", price: 300, zone: "ZONA 300$" },
  { id: "la-juanita", name: "La Juanita", distance: "", price: 200, zone: "ZONA 200$" },
  { id: "caunao", name: "Caunao", distance: "", price: 500, zone: "ZONA 500$" },
  { id: "caunao-sur", name: "Caunao Sur", distance: "", price: 500, zone: "ZONA 500$" },
  { id: "el-junco", name: "El Junco", distance: "", price: 300, zone: "ZONA 300$" },
  { id: "tulipan", name: "Tulipán", distance: "", price: 300, zone: "ZONA 300$" },
  { id: "la-gloria", name: "La Gloria", distance: "", price: 200, zone: "ZONA 200$" },
  { id: "reparto-militar", name: "Reparto Militar", distance: "", price: 200, zone: "ZONA 200$" },
  { id: "reina", name: "Reina", distance: "", price: 200, zone: "ZONA 200$" },
  { id: "buena-vista", name: "Buena Vista", distance: "", price: 300, zone: "ZONA 300$" },
  { id: "pueblo-griffo", name: "Pueblo Griffo", distance: "", price: 300, zone: "ZONA 300$" },
  { id: "pueblo-griffo-viejo", name: "Pueblo Griffo Viejo", distance: "", price: 300, zone: "ZONA 300$" },
  { id: "cocaleca", name: "Cocaleca", distance: "", price: 300, zone: "ZONA 300$" },
  { id: "almacenes-del-miedo", name: "Almacenes del Miedo", distance: "", price: 300, zone: "ZONA 300$" },
  { id: "pepe-arriba", name: "Pepe Arriba", distance: "", price: 500, zone: "ZONA 500$" },
  { id: "oburke", name: "Oburke", distance: "", price: 400, zone: "ZONA 400$" },
  { id: "san-lazaro", name: "San Lázaro", distance: "", price: 200, zone: "ZONA 200$" },
  { id: "la-esperanza", name: "La Esperanza", distance: "", price: 400, zone: "ZONA 400$" },
  { id: "el-fanguito", name: "El Fanguito", distance: "", price: 400, zone: "ZONA 400$" },
  { id: "la-barrera", name: "La Barrera", distance: "", price: 300, zone: "ZONA 300$" },
  { id: "la-juanita-norte", name: "La Juanita Norte", distance: "", price: 200, zone: "ZONA 200$" },
  { id: "la-juanita-sur", name: "La Juanita Sur", distance: "", price: 200, zone: "ZONA 200$" },
  { id: "el-paraiso", name: "El Paraíso", distance: "", price: 500, zone: "ZONA 500$" },
  { id: "la-aduana", name: "La Aduana", distance: "", price: 100, zone: "ZONA 100$" },
  { id: "el-prado", name: "El Prado", distance: "", price: 100, zone: "ZONA 100$" },
  { id: "punta-cotica", name: "Punta Cotica", distance: "", price: 200, zone: "ZONA 200$" },
  { id: "las-minas", name: "Las Minas", distance: "", price: 300, zone: "ZONA 300$" },
  { id: "los-pilotos", name: "Los Pilotos", distance: "", price: 300, zone: "ZONA 300$" },
]
