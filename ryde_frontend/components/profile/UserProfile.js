"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Star, MapPin, Clock, CreditCard, Shield, History, Bell, FileText } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { fetchUserData, logout } from "@/lib/features/AuthSlice"
import api, { multipartApi } from "@/lib/axios"
import NotificationBell from "../NotificationBell"
import Link from "next/link"
import { Button } from "@/components/ui/buttons"
import { ArrowLeft, Car } from "lucide-react"
import PaymentForm from "../payment/Paymentform"
import PaymentModal from "../payment/PaymentModal"
import { set2fa } from "@/lib/features/AuthSlice"


export default function UserProfile() {
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const { user, isLoggedIn } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phoneNo: user?.phoneNo || ''
  })

  const [isEditing, setIsEditing] = useState(false)
  const [showRideHistory, setShowRideHistory] = useState(false)
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false)
  const [paymentFormVisible, setPaymentFormVisible] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  const uploadImage = async (imageFile) => {
    const formData = new FormData()
    formData.append("profileImage", imageFile)
    formData.append("userId", user._id)

    try {
      const response = await multipartApi.post("/users/uploadImage", formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error uploading image')
    }
  }

  const updateUserInfo = async (userData) => {
    try {
      const response = await api.patch("/users/updateUserInfo", userData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error updating user info')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      if (selectedImage) {
        const uploadResult = await uploadImage(selectedImage)
        console.log('Image upload successful:', uploadResult)
      }

      // Only send changed fields
      const changedData = {}
      if (formData.email !== user.email) changedData.email = formData.email
      if (formData.phoneNo !== user.phoneNo) changedData.phone = formData.phoneNo

      if (Object.keys(changedData).length > 0) {
        const updateResult = await updateUserInfo(changedData)
        // console.log('changed data:', changedData)
        console.log('User info update successful:', updateResult)
      }

      setIsEditing(false)
      setSelectedImage(null)

      // Refresh user data in Redux store
      await dispatch(fetchUserData())
    } catch (error) {
      console.error("Error saving profile:", error.message)
      alert(error.message)
    }
  }

  const handleAddPaymentMethod = () => {
    setPaymentFormVisible(!paymentFormVisible)
  }

  const handleEmergencySOSClick = () => {
    alert("Emergency services and Ryde5 support have been notified. Help is on the way.")
  }

  const handleToggle2fa = async () => {
    try {
      const res = await dispatch(set2fa(user)).unwrap()
      await dispatch(fetchUserData())
      alert("2FA status updated successfully")
    } catch (error) {
      alert(error.message)
    }
  }

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap()
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white shadow-lg rounded-lg">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-0">
              <div className="relative w-32 h-32">
                <Image
                  src={selectedImage ? URL.createObjectURL(selectedImage) : (user?.image || "/user.png")}
                  alt={user?.fullname || "User"}
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
                <h2 className="text-xl font-semibold text-gray-800">{user.fullname}</h2>
                <div className="flex items-center justify-center sm:justify-start mt-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-gray-600">{user.rating || "N/A"}</span>
                </div>
                {
                  user.ridesCompleted && (
                    <p className="text-gray-600 mt-1">{user.ridesCompleted} rides completed</p>
                  )
                }
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Link
                href="/register-driver"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <Car className="w-4 h-4" />
                Register as Driver
              </Link>
              {!isEditing && (
                <Button onClick={handleEdit} className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white">
                  Edit Profile
                </Button>
              )}
              <button
                onClick={handleEmergencySOSClick}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors w-full sm:w-auto"
              >
                SOS
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors w-full sm:w-auto"
              >
                Logout
              </button>

            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <p className="text-gray-800">{user.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phoneNo"
                        value={formData.phoneNo}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <p className="text-gray-800">{user.phoneNo}</p>
                    )}
                  </div>
                  {user.twoFactor ? (
                    <div className="flex items-center mt-2 text-green-600">
                      <Shield className="w-4 h-4 mr-1" />
                      <span className="text-sm">2FA Enabled</span>
                    </div>
                  )
                    :
                    (
                      <div className="flex items-center mt-2 text-red-600">
                        <Shield className="w-4 h-4 mr-1" />
                        <span className="text-sm">2FA Disabled</span>
                      </div>
                    )
                  }
                  {isEditing && (
                    <button onClick={handleToggle2fa} className="text-orange-500 hover:text-orange-600">
                      {user.twoFactor ? "Disable 2FA" : "Enable 2FA"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment Methods</h3>
                  <div className="space-y-2">
                    {user.paymentMethods ? user.paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <div className="flex items-center">
                          <CreditCard className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="text-gray-700">
                            {method.type} {method.last4 ? `ending in ${method.last4}` : method.username}
                          </span>
                        </div>
                        {method.isDefault && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Default</span>
                        )}
                      </div>
                    )) : (
                      <p className="text-gray-600">No payment methods added yet</p>
                    )}
                    <button
                      onClick={handleAddPaymentMethod}
                      className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-500 transition-colors"
                    >
                      + Add Payment Method
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Favorite Locations</h3>
                  <ul className="space-y-2">
                    {user.favoriteLocations ? user.favoriteLocations.map((location, index) => (
                      <li key={index} className="flex items-start bg-gray-50 p-3 rounded">
                        <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{location}</span>
                      </li>
                    )) :
                      <p className="text-gray-600">No favorite locations added yet</p>
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Recent Rides</h3>
              <div className="space-y-2">
                {user.rideHistory ? user.rideHistory.slice(0, 3).map((ride) => (
                  <div key={ride.id} className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{ride.date}</p>
                        <p className="text-sm text-gray-600">
                          {ride.from} → {ride.to}
                        </p>
                      </div>
                      <span className="text-sm font-medium">${ride.amount}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-gray-600">Driver: {ride.driverName}</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1">{ride.rating}</span>
                      </div>
                    </div>
                  </div>
                )) :
                  <p className="text-gray-600">No recent rides</p>
                }
                <button
                  onClick={() => setShowRideHistory(!showRideHistory)}
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                >
                  View All Rides
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">Emergency Contacts</h3>
                <button
                  onClick={() => setShowEmergencyContacts(!showEmergencyContacts)}
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                >
                  {showEmergencyContacts ? "Hide" : "Manage"}
                </button>
              </div>
              {showEmergencyContacts && (
                <div className="bg-gray-50 p-4 rounded">
                  {user.emergencyContacts ? user.emergencyContacts.map((contact, index) => (
                    <div key={index} className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-gray-600">
                          {contact.phoneNo} • {contact.relation}
                        </p>
                      </div>
                      {isEditing && <button className="text-red-500 hover:text-red-600">Remove</button>}
                    </div>
                  )) :
                    <p className="text-gray-600">No emergency contacts added yet</p>
                  }
                  {isEditing && (
                    <button className="mt-2 text-orange-500 hover:text-orange-600">+ Add Emergency Contact</button>
                  )}
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
      <PaymentModal isOpen={paymentFormVisible} onClose={handleAddPaymentMethod} />
    </div>
  )
}

