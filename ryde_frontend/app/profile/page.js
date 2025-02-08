"use client"

import { useState } from "react"
import UserProfile from "@/components/profile/UserProfile"
import GuestProfile from "@/components/profile/GuestProfile"
import UserDashboard from "@/components/dashboards/UserDashboard"
import GuestDashboard from "@/components/dashboards/GuestDashboard"
import { mockUserData } from "@/components/utils/mockData"
import { DashboardHeader } from "@/components/layout/DashboardHeader"
import ProtectedRoute from "../ProtectedRoute.js"
import { USER_TYPES } from "@/types/profiles"


export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [userData, setUserData] = useState(mockUserData)

  const isGuest = !userData || userData.role === "guest"
  // const isGuest = true

  return (
    <ProtectedRoute allowedRoles={[USER_TYPES.USER, USER_TYPES.GUEST]}>
      <div className="min-h-screen bg-gray-100">
        <DashboardHeader
          title={
            activeTab === "dashboard"
              ? isGuest
                ? "Guest Dashboard"
                : "User Dashboard"
              : isGuest
                ? "Guest Profile"
                : "User Profile"
          }
          activeTab={activeTab}
          onTabChange={setActiveTab}
          notificationCount={2}
        />

        <main className="container mx-auto px-4 py-8">
          {activeTab === "dashboard" ? (
            isGuest ? <GuestDashboard /> : <UserDashboard user={userData} />
          ) : (
            isGuest ? <GuestProfile /> : <UserProfile user={userData} />
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
