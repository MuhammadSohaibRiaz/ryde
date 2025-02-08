"use client"

import { useState, useEffect } from "react"
import { Car } from "lucide-react"
import { MAPS_CONFIG } from "../map/maps"

export default function SimulatedCarsControl() {
  const [numCars, setNumCars] = useState(
    Number.parseInt(localStorage.getItem("simulatedCars")) || MAPS_CONFIG.simulatedCars.default,
  )

  const handleChange = (e) => {
    const value = Math.min(
      Math.max(Number.parseInt(e.target.value) || MAPS_CONFIG.simulatedCars.min, MAPS_CONFIG.simulatedCars.min),
      MAPS_CONFIG.simulatedCars.max,
    )
    setNumCars(value)
    localStorage.setItem("simulatedCars", value.toString())
    // Reload page to apply changes
    window.location.reload()
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Car className="w-6 h-6" />
          Simulated Cars
        </h2>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label htmlFor="numCars" className="text-sm font-medium text-gray-700">
            Number of Cars:
          </label>
          <input
            type="number"
            id="numCars"
            value={numCars}
            onChange={handleChange}
            min={MAPS_CONFIG.simulatedCars.min}
            max={MAPS_CONFIG.simulatedCars.max}
            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <p className="text-sm text-gray-500">
          Min: {MAPS_CONFIG.simulatedCars.min}, Max: {MAPS_CONFIG.simulatedCars.max}
        </p>
      </div>
    </div>
  )
}

