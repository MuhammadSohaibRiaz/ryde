"use client"

import { useState } from "react"
import Header from "@/components/layout/Header"
import BookingForm from "@/components/booking/BookingForm"
import PaymentForm from "@/components/payment/Paymentform"
import RatingForm from "@/components/rating/RatingForm"
import SuccessPopup from "@/components/ui/SuccessPopup"
import SplashScreen from "@/components/SplashScreen"

export default function Home() {
  const [currentStep, setCurrentStep] = useState("booking")
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [rideData, setRideData] = useState(null)

  const handleRequestRide = (formData) => {
    setRideData(formData)
    setCurrentStep("payment")
  }

  const handlePaymentComplete = (paymentData) => {
    setSuccessMessage("Payment successful! Your ride is confirmed.")
    setShowSuccessPopup(true)
    setTimeout(() => {
      setShowSuccessPopup(false)
      setCurrentStep("rating")
    }, 2000)
  }

  const handleSubmitReview = (reviewData) => {
    setSuccessMessage("Thank you for your feedback!")
    setShowSuccessPopup(true)
    setTimeout(() => {
      setShowSuccessPopup(false)
      setCurrentStep("booking")
      setRideData(null)
    }, 2000)
  }

  return (
    <>
      <SplashScreen />
      <div className="flex flex-col min-h-screen bg-gray-50">
        <main className="flex-1 relative">
          {currentStep === "booking" && (
            <BookingForm
              onRequestRide={handleRequestRide}
              key={rideData ? "active" : "new"} // Force reset when completing the flow
            />
          )}
          {currentStep === "payment" && (
            <PaymentForm onPaymentComplete={handlePaymentComplete} amount={rideData?.fare} />
          )}
          {currentStep === "rating" && <RatingForm onSubmitReview={handleSubmitReview} rideData={rideData} />}
          {showSuccessPopup && <SuccessPopup message={successMessage} onClose={() => setShowSuccessPopup(false)} />}
        </main>
      </div>
    </>
  )
}

