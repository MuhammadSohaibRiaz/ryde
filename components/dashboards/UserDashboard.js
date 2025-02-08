"use client"

import { useState } from "react"
import { MapPin, Clock, CreditCard, Car } from "lucide-react"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useMotionValue } from "framer-motion"
import { useNavigate } from 'react-router-dom';
import ProtectedRoute from "@/app/ProtectedRoute"

// Import Map component dynamically to avoid SSR issues
const Map = dynamic(() => import("@/components/map/maps"), { ssr: false })

export default function UserDashboard({ user }) {
  const [selectedRide, setSelectedRide] = useState(null)



  // const router = useRouter(); // Initialize the useRouter hook

  // const handleRequestRide = () => {
  //   router.push('/main'); // Navigate to /main when the button is clicked
  // };

  const handleRequestRide = () => {
    window.location.href = "/main"; // Redirect to /main
  };
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Map Section */}
      <div className="relative h-[60vh] w-full">
        <Map />
        <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
          <button
            onClick={handleRequestRide} // Add click handler
            className="bg-[#6C63FF] text-white px-6 py-2 rounded-full"
          >
            Request Ride
          </button>
        </div>
      </div>

      {/* Recent Rides */}
      <div className="bg-white -mt-8 relative rounded-t-3xl p-6 min-h-[40vh]">
        <h2 className="text-xl font-semibold mb-4">Your Rides</h2>
        <div className="space-y-4">
          {user?.recentRides?.map((ride, index) => (
            <div
              key={index}
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
              onClick={() => setSelectedRide(ride)}
            >
              <div className="bg-[#6C63FF] p-3 rounded-full">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{ride.destination}</h3>
                    <p className="text-sm text-gray-500">{ride.date}</p>
                  </div>
                  <span className="font-semibold">${ride.amount}</span>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{ride.duration}</span>
                  <MapPin className="w-4 h-4 ml-3 mr-1" />
                  <span>{ride.distance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Rides</p>
            <p className="text-2xl font-semibold text-[#6C63FF]">{user?.stats?.totalRides}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-2xl font-semibold text-[#6C63FF]">${user?.stats?.totalSpent}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Avg. Rating</p>
            <p className="text-2xl font-semibold text-[#6C63FF]">{user?.stats?.avgRating}★</p>
          </div>
        </div>
      </div>
    </div>
  )
}

