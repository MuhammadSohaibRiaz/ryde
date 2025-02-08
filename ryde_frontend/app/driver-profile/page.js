"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import DriverProfile from "@/components/profile/DriverProfile"
import DriverDashboard from "@/components/dashboards/DriverDashboard"
import { mockDriverData } from "@/components/utils/mockData"
import { DashboardHeader } from "@/components/layout/DashboardHeader"
import ProtectedRoute from "../ProtectedRoute"
import { USER_TYPES } from "@/types/profiles"

export default function DriverProfilePage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [driverData, setDriverData] = useState(mockDriverData)

  return (
    <ProtectedRoute allowedRoles={[USER_TYPES.DRIVER]}>
      <div className="min-h-screen bg-gray-100">
        <DashboardHeader
          title={activeTab === "dashboard" ? "Driver Dashboard" : "Driver Profile"}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          notificationCount={3}
        />
        <main className="container mx-auto px-4 py-0">
          {activeTab === "dashboard" ? <DriverDashboard driver={driverData} /> : <DriverProfile />}
        </main>
      </div>
    </ProtectedRoute>
  )
}

