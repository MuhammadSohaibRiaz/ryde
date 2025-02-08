"use client"

import { useState } from "react"
import { MapPin, Clock, DollarSign, Users, Power, ChevronDown } from "lucide-react"
import dynamic from "next/dynamic"
import RideRequestCard from "../driver/RideRequestCard"
import { motion, AnimatePresence } from "framer-motion"

const Map = dynamic(() => import("@/components/map/maps"), { ssr: false })

export default function DriverDashboard({ driver }) {
  const [isOnline, setIsOnline] = useState(true)
  const [currentRide, setCurrentRide] = useState(null)
  const [rideRequest, setRideRequest] = useState({
    price: "19.14",
    pickupTime: "2",
    dropoffTime: "30",
    distance: "23.4",
    pickupLocation: "S.E & 12th Ave, Denver",
    dropoffLocation: "Denver International Airport",
    streakCurrent: 2,
    streakTotal: 3,
    isAirport: true,
  })

  const handleAcceptRide = () => {
    setCurrentRide(rideRequest)
    setRideRequest(null)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Status Bar */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-0">
        <div className="flex items-center space-x-4">
          <div className={`h-3 w-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`} />
          <span className="font-medium">{isOnline ? "Online" : "Offline"}</span>
        </div>
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center px-4 py-2 rounded-full ${
            isOnline ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
          }`}
        >
          <Power className="w-4 h-4 mr-2" />
          {isOnline ? "Go Offline" : "Go Online"}
        </button>
      </div>

      {/* Full Screen Map Section */}
      <div className="relative h-[calc(100vh-14rem)]">
        {" "}
        {/* Accounts for header + status bar */}
        <div className="absolute inset-0">
          <Map />
        </div>
        {/* Current Ride Info - Floating above map */}
        {currentRide && (
          <div className="absolute top-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg z-20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Current Ride</h3>
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">In Progress</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-gray-500 mr-2" />
                <span>{currentRide.dropoffLocation}</span>
              </div>
              <span className="font-semibold">${currentRide.price}</span>
            </div>
          </div>
        )}
        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center text-white z-20">
          <span className="text-sm mb-1">Scroll for details</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </div>
        {/* Summary Section */}
        <div className="absolute top-[calc(100vh-13rem)] left-0 right-0 bg-white min-h-screen z-10">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Today's Summary</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#6C63FF] p-4 rounded-lg text-white">
                <p className="text-sm opacity-90">Today's Earnings</p>
                <p className="text-3xl font-bold">${driver?.todayStats?.earnings}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Completed Rides</p>
                <p className="text-3xl font-semibold text-[#6C63FF]">{driver?.todayStats?.completedRides}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-500">Recent Activity</h3>
              {driver?.recentActivity?.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-[#6C63FF] bg-opacity-10 p-2 rounded-full">
                      <Clock className="w-5 h-5 text-[#6C63FF]" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{activity.type}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <span className="font-semibold">${activity.amount}</span>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="font-medium text-gray-500 mb-3">Performance</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-[#6C63FF]">{driver?.performance?.rating}★</div>
                  <p className="text-sm text-gray-500">Rating</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-[#6C63FF]">{driver?.performance?.acceptance}%</div>
                  <p className="text-sm text-gray-500">Acceptance</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-[#6C63FF]">{driver?.performance?.completion}%</div>
                  <p className="text-sm text-gray-500">Completion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ride Request Popup */}
      <AnimatePresence>
        {rideRequest && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed inset-x-0 bottom-0 z-50"
          >
            <RideRequestCard ride={rideRequest} onAccept={handleAcceptRide} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

