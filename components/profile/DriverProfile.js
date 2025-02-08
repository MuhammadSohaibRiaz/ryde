"use client"

import { useState, useRef } from "react"
import axios from "axios"
import Image from "next/image"
import { Star, Shield, Clock, FileText } from "lucide-react"
import { Button } from "@/components/ui/buttons"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import NotificationBell from "../NotificationBell"
import { useDispatch, useSelector } from "react-redux"
import { fetchUserData, logout } from "@/lib/features/AuthSlice"
import { multipartApi } from "@/lib/axios"

export default function DriverProfile() {
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [showDocuments, setShowDocuments] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const fileInputRef = useRef(null)
  const { user } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState(user)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  const uploadImage = async (imageFile) => {
    const formData = new FormData()
    formData.append("profileImage", imageFile) // Changed from "image" to "profileImage"
    formData.append("driverId", user._id)

    try {
      console.log('Uploading image...', {
        fileSize: imageFile.size,
        fileType: imageFile.type,
        driverId: user._id
      });

      const response = await multipartApi.post("/drivers/uploadImage", formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      console.log('Upload response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Upload error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw new Error(error.response?.data?.message || 'Error uploading image');
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      if (selectedImage) {
        const uploadResult = await uploadImage(selectedImage);
        console.log('Image upload successful:', uploadResult);
      }

      console.log("Form data to be updated:", formData);
      setIsEditing(false);
      setSelectedImage(null);

      await dispatch(fetchUserData());
    } catch (error) {
      console.error("Error saving profile:", error.message);
      // You might want to show an error message to the user here
      alert(error.message);
    }
  }

  const handleDocumentUpload = (type) => {
    // In a real app, this would open a file picker and handle document upload
    alert(`Upload new ${type} document`)
  }

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap()

    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  // Safely access nested properties
  const stats = user?.earnings?.stats || {
    completionRate: 0,
    averageRating: 0,
    cancellationRate: 0,
  }

  return (
    <div className="max-w-4xl mx-auto">

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6 md:p-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            {/* Profile image and info section */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-0">
              <div className="relative w-32 h-32">
                <Image
                  src={selectedImage ? URL.createObjectURL(selectedImage) : (user?.image || "/user.png")}
                  alt={user?.fullname || "Driver"}
                  fill
                  className="rounded-full object-cover border-4 border-white shadow-lg"
                />
                {isEditing && (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full shadow-lg"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-800">{user?.fullname}</h2>
                <div className="flex items-center justify-center sm:justify-start mt-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-gray-600">{user?.rating} Rating</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start mt-1">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="ml-1 text-gray-600">{user?.ridesCompleted} Rides</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              {/* logout button */}
              <Button onClick={handleLogout} className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white">
                Logout
              </Button>
              {!isEditing ? (
                <Button onClick={handleEdit} className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white">
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600 text-white">
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Performance */}
            <div className="lg:col-span-1">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span className="font-medium">{stats.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stats.completionRate}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Average Rating</span>
                      <span className="font-medium">{stats.averageRating}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${(stats.averageRating / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cancellation Rate</span>
                      <span className="font-medium">{stats.cancellationRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: `${stats.cancellationRate}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - Vehicle & Documents */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Vehicle Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Vehicle Information</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <div className="grid grid-cols-2 gap-4">
                      {isEditing ? (
                        <>
                          <div>
                            <label className="text-sm text-gray-600">Capacity</label>
                            <input
                              type="number"
                              name="capacity"
                              value={formData.vehicle?.capacity}
                              onChange={handleChange}
                              className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Color</label>
                            <input
                              type="text"
                              name="color"
                              value={formData.vehicle?.color}
                              onChange={handleChange}
                              className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Model</label>
                            <input
                              type="text"
                              name="vehicleModel"
                              value={formData.vehicle?.vehicleModel}
                              onChange={handleChange}
                              className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Plate No</label>
                            <input
                              type="text"
                              name="plate"
                              value={formData.vehicle?.plate}
                              onChange={handleChange}
                              className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Type</label>
                            <input
                              type="text"
                              name="vehicleType"
                              value={formData.vehicle?.vehicleType}
                              onChange={handleChange}
                              className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="text-sm text-gray-600">Capacity</label>
                            <p className="font-medium">{user.vehicle?.capacity}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Color</label>
                            <p className="font-medium">{user.vehicle?.color}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Model</label>
                            <p className="font-medium">{user.vehicle?.vehicleModel}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Plate No</label>
                            <p className="font-medium">{user.vehicle?.plate}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Type</label>
                            <p className="font-medium">{user.vehicle?.vehicleType}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Documents Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">Documents</h3>
                    <button
                      onClick={() => setShowDocuments(!showDocuments)}
                      className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                    >
                      {showDocuments ? "Hide" : "View All"}
                    </button>
                  </div>
                  {showDocuments && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <Shield className="w-8 h-8 text-gray-600" />
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">Driver License</h4>
                            <p className="text-sm text-gray-600">Expires on {user.docs.driverLicense.expiryDate}</p>
                            <p className="text-sm text-gray-600">Status: {user.docs.driverLicense.status}</p>

                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {/* <button
                            onClick={() => handleDocumentUpload("Driver License")}
                            className="text-orange-500 hover:text-orange-600"
                          >
                            Upload
                          </button> */}
                          <Link legacyBehavior target="__blank" href={user.docs.driverLicense.path + ".pdf"} className="text-orange-500 hover:text-orange-600">
                            View
                          </Link>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <Shield className="w-8 h-8 text-gray-600" />
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">Car Insurance</h4>
                            <p className="text-sm text-gray-600">Expires on {user.docs.carInsurance.expiryDate}</p>
                            {/* status */}
                            <p className="text-sm text-gray-600">Status: {user.docs.carInsurance.status}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {/* <button
                            onClick={() => handleDocumentUpload("Car Insurance")}
                            className="text-orange-500 hover:text-orange-600"
                          >
                            Upload
                          </button> */}
                          <Link legacyBehavior target="__blank" href={user.docs.carInsurance.path} className="text-orange-500 hover:text-orange-600">
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Earnings & Schedule */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Earnings Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Earnings</h3>
              <div className="bg-gray-50 p-4 rounded space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Today</label>
                    <p className="text-2xl font-bold text-green-600">${user.earnings?.today || 0}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">This Week</label>
                    <p className="text-2xl font-bold text-green-600">${user.earnings?.week || 0}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Payments</p>
                  <p className="text-orange-500 font-medium">
                    ${user.earnings?.pending || 0}{" "}
                  </p>
                </div>
              </div>
            </div>

            {/* Schedule Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">Schedule</h3>
                <button
                  onClick={() => setShowSchedule(!showSchedule)}
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                >
                  {showSchedule ? "Hide" : "View"}
                </button>
              </div>
              {showSchedule && user.schedule && (

                <div className="bg-gray-50 p-4 rounded">
                  {Object.entries(user.schedule).map(([day, schedule]) => (
                    <div key={day} className="flex items-center justify-between py-2">
                      <span className="capitalize">{day}</span>
                      <span className={schedule.active ? "text-gray-800" : "text-gray-400"}>
                        {schedule.active ? schedule.hours : "Not Available"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

