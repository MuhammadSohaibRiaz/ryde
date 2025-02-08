"use client"

import { useState } from "react"
import DriverDashboard from "@/components/dashboards/DriverDashboard"
import { mockDriverData } from "@/components/utils/mockData"
import { DashboardHeader } from "@/components/layout/DashboardHeader"
import ProtectedRoute from "../ProtectedRoute"
import { USER_TYPES } from "@/types/profiles"

export default function DriverDashboardPage() {
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
        <DriverDashboard driver={driverData} />
      </div>
    </ProtectedRoute>
  )
}

