"use client"

import { useState } from "react"
import MapView from "../map/MapView"
import { AlertCircle, Car, RefreshCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"

export default function TrackingMap() {
  const [error, setError] = useState(null)
  const [numCars, setNumCars] = useState(8)

  const handleError = (err) => {
    console.error("Map error:", err)
    setError(err.message)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-4">
          <Card className="bg-white">
            <CardContent className="flex items-center gap-3 p-3">
              <Car className="w-4 h-4 text-gray-600" />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={numCars}
                  onChange={(e) => setNumCars(Number(e.target.value))}
                  className="w-16 px-2 py-1 text-sm border rounded"
                  min="0"
                  max="20"
                />
                <span className="text-sm text-gray-600">cars</span>
              </div>
            </CardContent>
          </Card>
          <button
            onClick={() => window.location.reload()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Refresh Map"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
        <MapView isAdmin={true} onError={handleError} initialCars={numCars} />

        {error && (
          <div className="absolute bottom-4 left-4 right-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}

