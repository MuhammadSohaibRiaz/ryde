"use client"

import { MapPin, Clock, DollarSign, Plane } from "lucide-react"
import { Button } from "@/components/ui/buttons"

export default function RideRequestCard({ ride, onAccept, onDecline }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full mx-auto">
      <div className="space-y-4">
        {/* Price and Rating Section */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <span className="text-xl font-bold">${ride?.price}</span>
            <span className="text-gray-500">Lyft</span>
          </div>
          {ride?.streak && (
            <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
              Ride {ride.streakCurrent} of {ride.streakTotal} in streak
            </div>
          )}
        </div>

        {/* Time and Distance Info */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-purple-600" />
              <div className="w-0.5 h-full bg-gray-200 my-1" />
              <div className="w-3 h-3 rounded-full border-2 border-purple-600" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500">{ride?.pickupTime} min</span>
                </div>
                <p className="font-medium">{ride?.pickupLocation}</p>
              </div>
              <div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500">{ride?.dropoffTime} min</span>
                  <span className="mx-2">•</span>
                  <span className="text-sm text-gray-500">{ride?.distance} mi</span>
                </div>
                <p className="font-medium">{ride?.dropoffLocation}</p>
                {ride?.isAirport && (
                  <div className="flex items-center mt-1 text-blue-600">
                    <Plane className="w-4 h-4 mr-1" />
                    <span className="text-sm">Airport drop-off</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onAccept}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  )
}

