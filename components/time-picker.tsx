"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimePickerProps {
  value: string
  onChange: (time: string) => void
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [hour, setHour] = useState("12")
  const [minute, setMinute] = useState("00")
  const [period, setPeriod] = useState("PM")

  // Convertir el valor inicial de 24h a 12h
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":")
      const hour24 = Number.parseInt(h)
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24
      const periodValue = hour24 >= 12 ? "PM" : "AM"

      setHour(hour12.toString())
      setMinute(m)
      setPeriod(periodValue)
    }
  }, [value])

  // Horas disponibles de 10 AM a 10 PM
  const getAvailableHours = () => {
    if (period === "AM") {
      return ["10", "11"] // Solo 10 AM y 11 AM
    } else {
      return ["12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] // 12 PM a 10 PM
    }
  }

  // Minutos disponibles
  const minutes = ["00", "15", "30", "45"]

  const handleTimeChange = (newHour: string, newMinute: string, newPeriod: string) => {
    // Convertir a formato 24h para el valor
    let hour24 = Number.parseInt(newHour)
    if (newPeriod === "AM" && hour24 === 12) {
      hour24 = 0
    } else if (newPeriod === "PM" && hour24 !== 12) {
      hour24 += 12
    }

    const timeString = `${hour24.toString().padStart(2, "0")}:${newMinute}`
    onChange(timeString)
  }

  const handleHourChange = (newHour: string) => {
    setHour(newHour)
    handleTimeChange(newHour, minute, period)
  }

  const handleMinuteChange = (newMinute: string) => {
    setMinute(newMinute)
    handleTimeChange(hour, newMinute, period)
  }

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod)

    // Ajustar la hora si es necesario al cambiar el período
    let adjustedHour = hour
    if (newPeriod === "AM" && !["10", "11"].includes(hour)) {
      adjustedHour = "10"
      setHour("10")
    } else if (newPeriod === "PM" && hour === "10" && period === "AM") {
      adjustedHour = "12"
      setHour("12")
    }

    handleTimeChange(adjustedHour, minute, newPeriod)
  }

  // Formatear la hora para mostrar
  const formatDisplayTime = () => {
    return `${hour}:${minute} ${period}`
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
        <div className="flex items-center space-x-2">
          <Clock className="w-6 h-6 text-orange-500" />
          <div className="text-2xl font-bold text-orange-700">{formatDisplayTime()}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hora</label>
          <Select value={hour} onValueChange={handleHourChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {getAvailableHours().map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Minutos</label>
          <Select value={minute} onValueChange={handleMinuteChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {minutes.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">AM/PM</label>
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center">Horario de servicio: 10:00 AM - 10:00 PM</div>
    </div>
  )
}
