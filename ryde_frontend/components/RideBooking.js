"use client"

import { useState } from "react"
import { MapPin, Clock, DollarSign, Star, ChevronUp } from "lucide-react"
import Map from "./Map"

const BOOKING_STEPS = {
  LOCATION: "location",
  CONFIRMATION: "confirmation",
  DRIVER_MATCHED: "driver_matched",
  TRACKING: "tracking",
}

export default function RideBooking() {
  const [step, setStep] = useState(BOOKING_STEPS.LOCATION)
  const [bookingDetails, setBookingDetails] = useState({
    pickup: null,
    destination: null,
    estimatedTime: "15 min",
    estimatedPrice: "$25.50",
    driver: {
      name: "Samantha",
      rating: 4.9,
      car: "Tesla Model 3",
      plateNumber: "ABC 123",
      photo: "/placeholder.svg?height=50&width=50",
    },
  })

  const handleLocationSelect = (location) => {
    if (!bookingDetails.pickup) {
      setBookingDetails((prev) => ({ ...prev, pickup: location }))
    } else if (!bookingDetails.destination) {
      setBookingDetails((prev) => ({ ...prev, destination: location }))
      setStep(BOOKING_STEPS.CONFIRMATION)
    }
  }

  const handleConfirmRide = () => {
    setStep(BOOKING_STEPS.DRIVER_MATCHED)
    // Simulate driver matching after 2 seconds
    setTimeout(() => {
      setStep(BOOKING_STEPS.TRACKING)
    }, 2000)
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="relative flex-1">
        <Map onLocationSelect={handleLocationSelect} />

        {/* Bottom Sheet */}
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg transform transition-transform duration-300">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3" />

          {step === BOOKING_STEPS.LOCATION && (
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Where to?</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="text-[#6C63FF]" />
                  <input type="text" placeholder="Enter destination" className="flex-1 bg-transparent outline-none" />
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Saved Places</h3>
                  <div className="space-y-2">
                    <SavedLocation label="Home" address="123 Home St" />
                    <SavedLocation label="Work" address="456 Office Ave" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === BOOKING_STEPS.CONFIRMATION && (
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Confirm your ride</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="text-[#6C63FF]" />
                    <span>{bookingDetails.estimatedTime}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DollarSign className="text-[#6C63FF]" />
                    <span>{bookingDetails.estimatedPrice}</span>
                  </div>
                </div>

                <button
                  onClick={handleConfirmRide}
                  className="w-full bg-[#6C63FF] text-white py-3 rounded-lg font-medium"
                >
                  Confirm Ride
                </button>
              </div>
            </div>
          )}

          {step === BOOKING_STEPS.DRIVER_MATCHED && (
            <div className="p-4">
              <div className="text-center">
                <h2 className="text-xl font-semibold">Driver Found!</h2>
                <p className="text-gray-500">Your driver is on the way</p>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={bookingDetails.driver.photo || "/placeholder.svg"}
                      alt={bookingDetails.driver.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium">{bookingDetails.driver.name}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{bookingDetails.driver.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{bookingDetails.driver.car}</p>
                    <p className="text-sm text-gray-500">{bookingDetails.driver.plateNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === BOOKING_STEPS.TRACKING && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{bookingDetails.driver.name}</h2>
                  <p className="text-gray-500">3 min away</p>
                </div>
                <img
                  src={bookingDetails.driver.photo || "/placeholder.svg"}
                  alt={bookingDetails.driver.name}
                  className="w-12 h-12 rounded-full"
                />
              </div>

              <div className="flex justify-between items-center">
                <button className="px-4 py-2 border rounded-lg">Cancel</button>
                <button className="px-4 py-2 border rounded-lg">Contact</button>
                <button className="px-4 py-2 border rounded-lg">Share</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SavedLocation({ label, address }) {
  return (
    <button className="w-full flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg">
      <MapPin className="text-gray-400" />
      <div className="text-left">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-500">{address}</p>
      </div>
    </button>
  )
}

