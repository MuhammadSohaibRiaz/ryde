"use client"

import { useState, useCallback, useEffect } from "react"
import { MapPin, User, Search, ArrowLeft, X, CheckCircle2, Navigation, Edit2, Calendar } from "lucide-react"
import MapView from "../map/MapView"
import { motion, AnimatePresence } from "framer-motion"
import { MAPS_CONFIG } from "@/components/map/maps"
import ScheduleRideModal from "./ScheduleRideModal"
import DriverInfo from "./DriverInfo"
import LocationSelectionModal from "./LocationSelectionModal"

const BOOKING_STATES = {
  INITIAL: "initial",
  SELECTING_LOCATION: "selecting_location",
  RIDE_OPTIONS: "ride_options",
  FINDING_DRIVERS: "finding_drivers",
  DRIVER_FOUND: "driver_found",
  DRIVER_ACCEPTED: "driver_accepted",
  DRIVER_ARRIVING: "driver_arriving",
  RIDE_SCHEDULED: "ride_scheduled",
}

const STATUS_MESSAGES = {
  PICKUP: "Please have cash ready when driver arrives",
  DROPOFF: "Thank you for being a valued customer",
}

export default function BookingForm() {
  const [bookingState, setBookingState] = useState(BOOKING_STATES.INITIAL)
  const [activeInput, setActiveInput] = useState(null)
  const [formData, setFormData] = useState({
    pickup: null,
    dropoff: null,
  })
  const [routeDetails, setRouteDetails] = useState(null)
  const [driverLocation, setDriverLocation] = useState(null)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [scheduledTime, setScheduledTime] = useState(null)
  const [locationSelectionOpen, setLocationSelectionOpen] = useState(false)

  const handleRouteCalculated = useCallback((details) => {
    setRouteDetails(details)
  }, [])

  const handleRequestRide = useCallback(() => {
    if (scheduledTime) {
      setBookingState(BOOKING_STATES.RIDE_SCHEDULED)
    } else {
      setBookingState(BOOKING_STATES.FINDING_DRIVERS)
      setTimeout(() => {
        setSelectedDriver({
          name: "Michael",
          rating: 4.9,
          trips: "2,543",
          car: "Tesla Model 3",
          plate: "ABC 123",
          photo: "/placeholder.svg",
        })
        setBookingState(BOOKING_STATES.DRIVER_FOUND)

        setTimeout(() => {
          setBookingState(BOOKING_STATES.DRIVER_ACCEPTED)

          const startLocation = {
            lat: formData.pickup.coordinates.lat + (Math.random() - 0.5) * 0.01,
            lng: formData.pickup.coordinates.lng + (Math.random() - 0.5) * 0.01,
          }
          setDriverLocation(startLocation)
          setBookingState(BOOKING_STATES.DRIVER_ARRIVING)
        }, 2000)
      }, 3000)
    }
  }, [formData.pickup, scheduledTime])

  const handleCancelRide = () => {
    setBookingState(BOOKING_STATES.INITIAL)
    setFormData({ pickup: null, dropoff: null })
    setSelectedDriver(null)
    setDriverLocation(null)
    setScheduledTime(null)
    setRouteDetails(null)
  }


  const handleScheduleRide = (scheduleData) => {
    setScheduledTime(scheduleData)
    setScheduleModalOpen(false)
  }

  const handleLocationSelect = (type, location) => {
    setFormData((prev) => ({
      ...prev,
      [type]: location,
    }))
    setLocationSelectionOpen(false)
    if (formData.pickup && formData.dropoff) {
      setBookingState(BOOKING_STATES.RIDE_OPTIONS)
    }
  }

  const editLocation = (type) => {
    setActiveInput(type)
    setLocationSelectionOpen(true)
  }

  useEffect(() => {
    if (formData.pickup && formData.dropoff) {
      setBookingState(BOOKING_STATES.RIDE_OPTIONS)
    }
  }, [formData.pickup, formData.dropoff])

  useEffect(() => {
    if (bookingState === BOOKING_STATES.DRIVER_ARRIVING && driverLocation && formData.pickup) {
      const interval = setInterval(() => {
        setDriverLocation((prev) => {
          if (!prev) return prev

          const moveTowards = (current, target) => {
            const step = 0.0001
            return current < target ? Math.min(current + step, target) : Math.max(current - step, target)
          }

          return {
            lat: moveTowards(prev.lat, formData.pickup.coordinates.lat),
            lng: moveTowards(prev.lng, formData.pickup.coordinates.lng),
          }
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [bookingState, driverLocation, formData.pickup])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => {
          console.warn("Geolocation failed")
        },
      )
    }
  }, [])

  return (
    <div className="h-screen w-full relative overflow-hidden">
      <div className="absolute inset-0">
        <MapView
          pickup={formData.pickup}
          dropoff={formData.dropoff}
          bookingState={bookingState}
          driverLocation={driverLocation}
          onRouteCalculated={handleRouteCalculated}
          userLocation={userLocation}
        />
      </div>
      <div className="absolute top-4 right-4 z-30">
        <button
          onClick={() => (window.location.href = "/profile")}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
        >
          <User className="w-6 h-6 text-gray-700" />
        </button>
      </div>
      <AnimatePresence>
        {bookingState === BOOKING_STATES.INITIAL && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg"
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3" />
            <div className="p-6 space-y-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Where are you?"
                  value={formData.pickup?.address || ""}
                  readOnly
                  onClick={() => {
                    setActiveInput("pickup")
                    setLocationSelectionOpen(true)
                  }}
                  className="w-full p-4 pl-12 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
                />
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFA500] w-5 h-5" />
                {formData.pickup && (
                  <button
                    onClick={() => editLocation("pickup")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>

              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Where to?"
                  value={formData.dropoff?.address || ""}
                  readOnly
                  onClick={() => {
                    setActiveInput("dropoff")
                    setLocationSelectionOpen(true)
                  }}
                  className="w-full p-4 pl-12 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
                />
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFA500] w-5 h-5" />
                {formData.dropoff && (
                  <button
                    onClick={() => editLocation("dropoff")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {bookingState === BOOKING_STATES.RIDE_OPTIONS && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg"
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3" />
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#FFA500] mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Pickup</p>
                    <p className="font-medium">{formData.pickup?.address}</p>
                    {bookingState === BOOKING_STATES.DRIVER_ARRIVING && (
                      <p className="text-sm text-yellow-600 mt-1">{STATUS_MESSAGES.PICKUP}</p>
                    )}
                  </div>
                  <button onClick={() => editLocation("pickup")} className="p-1 hover:bg-gray-100 rounded-full">
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#FFA500] mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Dropoff</p>
                    <p className="font-medium">{formData.dropoff?.address}</p>
                    {bookingState === BOOKING_STATES.DRIVER_ARRIVING && (
                      <p className="text-sm text-green-600 mt-1">{STATUS_MESSAGES.DROPOFF}</p>
                    )}
                  </div>
                  <button onClick={() => editLocation("dropoff")} className="p-1 hover:bg-gray-100 rounded-full">
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {routeDetails && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Estimated fare</span>
                    <span className="font-medium">{routeDetails.fare}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Trip duration</span>
                    <span className="font-medium">{routeDetails.duration}</span>
                  </div>
                  {scheduledTime && (
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-gray-600">Scheduled for</span>
                      <span className="font-medium">
                        {new Date(`${scheduledTime.date}T${scheduledTime.time}`).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4">
                {scheduledTime && (
                  <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#FFA500]" />
                      <span className="text-sm">
                        Scheduled for {new Date(`${scheduledTime.date}T${scheduledTime.time}`).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => setScheduleModalOpen(true)}
                      className="text-sm text-[#FFA500] hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setScheduleModalOpen(true)}
                    className="flex items-center justify-center gap-2 py-4 px-6 border-2 border-[#FFA500] text-[#FFA500] rounded-full font-medium hover:bg-[#FFA500]/5 transition-colors"
                  >
                    <Calendar className="w-5 h-5" />
                    {scheduledTime ? "Change Time" : "Schedule"}
                  </button>
                  <button
                    onClick={handleRequestRide}
                    className="flex-1 py-4 bg-[#FFA500] text-white rounded-full font-medium hover:bg-[#FFD700] transition-colors"
                  >
                    {scheduledTime ? "Schedule Ride" : "Request Now"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {bookingState === BOOKING_STATES.FINDING_DRIVERS && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 flex items-center justify-center px-4"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FFA500]/10 flex items-center justify-center">
                  <Search className="w-8 h-8 text-[#FFA500] animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold">Finding your driver</h3>
                <p className="text-gray-500">Looking for nearby drivers...</p>
              </div>
            </div>
          </motion.div>
        )}

        {bookingState === BOOKING_STATES.DRIVER_FOUND && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 flex items-center justify-center px-4"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold">Driver Found!</h3>
                <p className="text-gray-500">Your ride is confirmed</p>
              </div>
            </div>
          </motion.div>
        )}

        {(bookingState === BOOKING_STATES.DRIVER_ACCEPTED || bookingState === BOOKING_STATES.DRIVER_ARRIVING) && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg"
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3" />
            <div className="p-6 space-y-6">
              <DriverInfo driver={selectedDriver} fare={routeDetails?.fare} duration={routeDetails?.duration} />

              

              <button
                onClick={() => {
                  {handleCancelRide}
                  setBookingState(BOOKING_STATES.INITIAL)
                  setFormData({ pickup: null, dropoff: null })
                  setSelectedDriver(null)
                  setDriverLocation(null)
                  setScheduledTime(null)

                }}
                className="w-full py-4 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors"
              >
                Cancel Ride
              </button>
             
            </div>
          </motion.div>
        )}

        {bookingState === BOOKING_STATES.RIDE_SCHEDULED && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 flex items-center justify-center px-4"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FFA500]/10 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-[#FFA500]" />
                </div>
                <h3 className="text-xl font-semibold">Ride Scheduled</h3>
                <p className="text-gray-500">
                  Your ride is scheduled for {new Date(`${scheduledTime.date}T${scheduledTime.time}`).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">We'll notify you when a driver accepts your scheduled ride.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ScheduleRideModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onSchedule={handleScheduleRide}
      />

      <LocationSelectionModal
        isOpen={locationSelectionOpen}
        onClose={() => setLocationSelectionOpen(false)}
        onSelect={(location) => handleLocationSelect(activeInput, location)}
        type={activeInput}
        initialLocation={activeInput === "pickup" ? formData.pickup : formData.dropoff}
      />
    </div>
  )
}

