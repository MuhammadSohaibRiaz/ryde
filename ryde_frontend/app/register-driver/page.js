"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Upload, AlertCircle } from "lucide-react"
import PricingPlans from "@/components/pricing/PricingPlans"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/buttons"


const DriverRegistration = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleColor: "",
    vehiclePlate: "",
    vehicleCapacity: "",
    vehicleType: "",
    plan: "",
    insuranceProof: null,
    licenseProof: null,
  })

  const [errors, setErrors] = useState({})
  const [isFormValid, setIsFormValid] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.insuranceProof) newErrors.insuranceProof = "Proof of insurance is required"
    if (!formData.licenseProof) newErrors.licenseProof = "Driver's license is required"

    // New validation logic for vehicle fields
    if (formData.vehicleColor.length < 3) newErrors.vehicleColor = "Color must be at least 3 characters long"
    if (formData.vehiclePlate.length < 1) newErrors.vehiclePlate = "Plate must be at least 1 character long"
    if (!formData.vehicleCapacity || formData.vehicleCapacity < 1) newErrors.vehicleCapacity = "Capacity must be at least 1"
    if (!["car", "motorcycle", "auto"].includes(formData.vehicleType)) newErrors.vehicleType = "Invalid vehicle type"

    setErrors(newErrors)
    setIsFormValid(Object.keys(newErrors).length === 0)
  }

  useEffect(() => {
    if (step === 2) {
      validateForm()
    }
  }, [formData, step])

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }))
  }

  const handleSelectPlan = (plan) => {
    setFormData((prev) => ({ ...prev, plan }))
    const formElement = document.querySelector("#registration-form")
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleBack = () => {
    setStep(1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
      window.scrollTo(0, 0)
    } else if (step === 2 && isFormValid) {
      console.log(formData)
      alert("Thank you for your application! We will review your information and contact you soon.")
    } else {
      validateForm()
    }
  }

  const requirements = [
    "Valid driver's license",
    "Proof of residency in your city/state",
    "Proof of auto insurance",
    "A smartphone with a data plan",
    "21 years of age or older",
    "At least one year of licensed driving experience in the US (3 years if you're under 23 years old)",
    "A clean driving record",
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col items-center">
        {/* Header */}
        <header className="w-full bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
        <Link href="/profile">
          <Button variant="outline" className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <Image src="/logo.png" alt="Ryde5 Logo" width={180} height={35} priority />
            </div>
            <h1 className="text-3xl text-gray-900">Become a Ryde5 Driver</h1>
          </div>
        </div>
      </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Requirements Section */}
          <section className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
            <h2 className="text-3xl font-semibold mb-4  text-center">Driver Requirements</h2>
            <ul className="list-disc pl-5 space-y-2 max-w-2xl mx-auto">
              {requirements.map((req, index) => (
                <li key={index} className="text-gray-700">
                  {req}
                </li>
              ))}
            </ul>
          </section>

          {step === 1 ? (
            <>
              <PricingPlans onSelectPlan={handleSelectPlan} />
              <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6">Driver Registration</h2>
                <form id="registration-form" onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                      Driver's License Number
                    </label>
                    <input
                      type="text"
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Vehicle Make */}
                    <div>
                      <label htmlFor="vehicleMake" className="block text-sm font-medium text-gray-700">
                        Vehicle Make
                      </label>
                      <input
                        type="text"
                        id="vehicleMake"
                        name="vehicleMake"
                        value={formData.vehicleMake}
                        placeholder="Make (e.g., Toyota)"
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                      />
                    </div>

                    {/* Vehicle Model */}
                    <div>
                      <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700">
                        Vehicle Model
                      </label>
                      <input
                        type="text"
                        id="vehicleModel"
                        name="vehicleModel"
                        value={formData.vehicleModel}
                        placeholder="Model (e.g., Corolla)"
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                      />
                    </div>

                    {/* Vehicle Color */}
                    <div>
                      <label htmlFor="vehicleColor" className="block text-sm font-medium text-gray-700">
                        Vehicle Color
                      </label>
                      <input
                        type="text"
                        id="vehicleColor"
                        name="vehicleColor"
                        value={formData.vehicleColor}
                        placeholder="Color (e.g., Red)"
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                      />
                    </div>

                    {/* Vehicle Plate */}
                    <div>
                      <label htmlFor="vehiclePlate" className="block text-sm font-medium text-gray-700">
                        Vehicle Plate Number
                      </label>
                      <input
                        type="text"
                        id="vehiclePlate"
                        name="vehiclePlate"
                        value={formData.vehiclePlate}
                        placeholder="Plate Number (e.g., XYZ 123)"
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                      />
                    </div>

                    {/* Vehicle Capacity */}
                    <div>
                      <label htmlFor="vehicleCapacity" className="block text-sm font-medium text-gray-700">
                        Vehicle Capacity
                      </label>
                      <input
                        type="number"
                        id="vehicleCapacity"
                        name="vehicleCapacity"
                        value={formData.vehicleCapacity}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                      />
                    </div>

                    {/* Vehicle Type */}
                    <div>
                      <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
                        Vehicle Type
                      </label>
                      <select
                        id="vehicleType"
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                      >
                        <option value="">Select vehicle type</option>
                        <option value="car">Car</option>
                        <option value="motorcycle">Motorcycle</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="selectedPlan" className="block text-sm font-medium text-gray-700">
                      Select Plan
                    </label>
                    <select
                      id="selectedPlan"
                      name="plan"
                      value={formData.plan}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-orange-500 appearance-none bg-white"
                    >
                      <option value="">Choose a plan</option>
                      <option value="silver">Silver Plan - $99</option>
                      <option value="gold">Gold Plan - $199</option>
                      <option value="diamond">Diamond Plan - $299</option>
                    </select>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      type="submit"
                      className="bg-orange-500 text-white py-3 px-6 rounded-md hover:bg-orange-600 transition duration-300 flex items-center"
                    >
                      Next
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="mb-6 flex items-center">
                <button
                  type="button"
                  onClick={handleBack}
                  className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold mr-3">
                    2
                  </div>
                  <h3 className="text-lg font-semibold">Document Upload</h3>
                </div>
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[ 
                  { id: "insuranceProof", label: "Proof of Insurance" },
                  { id: "licenseProof", label: "Driver's License" },
                ].map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor={field.id}
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 ${errors[field.id] ? "border-red-300" : "border-gray-300"
                          } border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 relative`}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {formData[field.id] ? (
                            <>
                              <div className="text-sm text-green-600 font-medium">File selected</div>
                              <p className="text-xs text-gray-500 mt-1">{formData[field.id].name}</p>
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 mb-3 text-gray-400" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">PDF, PNG, JPG or GIF (MAX. 10MB)</p>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          id={field.id}
                          name={field.id}
                          onChange={handleChange}
                          accept=".pdf,.png,.jpg,.gif"
                          className="hidden"
                        />
                      </label>
                    </div>
                    {errors[field.id] && (
                      <div className="mt-1 flex items-center text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors[field.id]}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-8">
                <button
                  type="submit"
                  className="bg-orange-500 text-white py-3 px-6 rounded-md hover:bg-orange-600 transition duration-300 flex items-center"
                  disabled={!isFormValid}
                >
                  Submit Application
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  )
}

export default DriverRegistration
