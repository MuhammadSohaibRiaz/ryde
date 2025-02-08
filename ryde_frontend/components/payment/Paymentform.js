"use client"

import { useState } from "react"
import { Star, CreditCard, Calendar, Lock } from "lucide-react"
import Image from "next/image"

export default function PaymentForm({ onPaymentComplete, amount = "25.50" }) {
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    name: "",
  })
  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)

  const validateCard = (number) => {
    return /^[\d\s-]{16,19}$/.test(number.replace(/[\s-]/g, ""))
  }

  const validateExpiry = (date) => {
    return /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(date)
  }

  const validateCVC = (cvc) => {
    return /^[0-9]{3,4}$/.test(cvc)
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4)
    }
    return v
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value)
    } else if (name === "expiryDate") {
      formattedValue = formatExpiryDate(value)
    }

    setPaymentData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!validateCard(paymentData.cardNumber)) {
      newErrors.cardNumber = "Please enter a valid card number"
    }
    if (!validateExpiry(paymentData.expiryDate)) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)"
    }
    if (!validateCVC(paymentData.cvc)) {
      newErrors.cvc = "Please enter a valid CVC"
    }
    if (!paymentData.name.trim()) {
      newErrors.name = "Please enter the cardholder name"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500))
      onPaymentComplete(paymentData)
    } catch (error) {
      setErrors({
        submit: "Payment failed. Please try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold text-orange-500">RYDE</span>
            <Star className="w-6 h-6 fill-black" />
          </div>
        </div>

        <div className="mb-8 text-center">
          <p className="text-4xl font-bold text-gray-900">${amount}</p>
          <p className="text-gray-500 mt-2">Total amount to pay</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Card Number</label>
            <div className="relative">
              <input
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={handleChange}
                className={`w-full p-3 pl-11 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.cardNumber ? "border-red-500" : "border-gray-300"
                }`}
                maxLength="19"
              />
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {errors.cardNumber && <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Expiry Date</label>
              <div className="relative">
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={paymentData.expiryDate}
                  onChange={handleChange}
                  className={`w-full p-3 pl-11 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.expiryDate ? "border-red-500" : "border-gray-300"
                  }`}
                  maxLength="5"
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.expiryDate && <p className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">CVC</label>
              <div className="relative">
                <input
                  type="text"
                  name="cvc"
                  placeholder="123"
                  value={paymentData.cvc}
                  onChange={handleChange}
                  className={`w-full p-3 pl-11 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.cvc ? "border-red-500" : "border-gray-300"
                  }`}
                  maxLength="4"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.cvc && <p className="mt-1 text-sm text-red-500">{errors.cvc}</p>}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Name on Card</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={paymentData.name}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3 px-4 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Lock className="w-4 h-4" />
          <span>Payments are secure and encrypted</span>
        </div>
      </div>
    </div>
  )
}

