"use client"

import { useState, useEffect } from "react"
import { Star, MessageSquare } from "lucide-react"
import Image from "next/image"

export default function RatingForm({ onSubmitReview, rideData }) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSubmitReview({ rating, feedback })
    } catch (error) {
      setError("Failed to submit review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold text-orange-500">RYDE</span>
            <Star className="w-6 h-6 fill-black" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-6">How was your ride?</h1>

        {rideData?.driver && (
          <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="relative w-16 h-16 rounded-full overflow-hidden">
              <Image
                src={rideData.driver.photo || "/placeholder.svg"}
                alt={rideData.driver.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-lg">{rideData.driver.name}</h3>
              <p className="text-sm text-gray-500">{rideData.driver.car}</p>
              {rideData.driver.plate && <p className="text-sm text-gray-500">License Plate: {rideData.driver.plate}</p>}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 text-center mb-4">Rate your experience</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-12 h-12 transition-colors ${
                      star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {error && <p className="text-center text-sm text-red-500">{error}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Additional feedback (optional)</label>
            <div className="relative">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us about your experience..."
                className="w-full h-32 p-4 pl-11 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <MessageSquare className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">Your feedback helps us improve our service</p>
      </div>
    </div>
  )
}

