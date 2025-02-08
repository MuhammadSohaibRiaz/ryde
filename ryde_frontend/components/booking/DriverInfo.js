"use client"

import { Phone } from "lucide-react"
import Image from "next/image"

export default function DriverInfo({ driver, fare, duration }) {
  return (
    <div className="bg-white rounded-t-3xl shadow-lg p-4 space-y-4">
      {/* Driver Info Section */}
      <div className="flex items-center gap-4">
        <div className="relative w-32 h-20"> {/* Car and driver image container */}
          {/* Car Image */}
          <div className="w-full h-full rounded-lg overflow-hidden">
            <Image
              src="/image.png" // Car image
              alt="Car Image"
              width={128}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Driver Image (Overlapping) */}
          <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
            <Image
              src="/user.png"
              alt={driver.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{driver.name}</h3>
            <Phone 
             onClick={() => (window.location.href = `tel:${driver.phone}`)}
            className="w-6 h-6 text-blue-500 cursor-pointer" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{driver.rating}</span>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${star <= 4 ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600">{driver.car}</p>
          <p className="text-sm text-gray-600">License Plate: {driver.plate}</p>
        </div>
      </div>

      {/* Fare and Duration */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Fare</p>
          <p className="font-semibold">${fare}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Duration</p>
          <p className="font-semibold">{duration}</p>
        </div>
      </div>

      {/* Payment Message */}
      <div className="bg-yellow-50 p-3 rounded-lg">
        <p className="text-sm text-yellow-800">Please have ${fare} cash ready when driver arrives</p>
      </div>

      {/* Driver Status */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Driver Status</span>
          <span className="font-medium text-green-600">On the way</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Estimated arrival</span>
          <span className="font-medium">1 mins</span>
        </div>
      </div>
    </div>
  )
}
