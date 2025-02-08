"use client"

import { useState } from "react"
import UserDashboard from "@/components/dashboards/UserDashboard"
import { mockUserData } from "@/components/utils/mockData"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/buttons"
import ProtectedRoute from "../ProtectedRoute.js"
import { USER_TYPES } from "@/types/profiles"

export default function UserDashboardPage() {
  const [userData, setUserData] = useState(mockUserData)

  return (
    <ProtectedRoute allowedRoles={[USER_TYPES.USER]}>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Main Menu</span>
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline">View Profile</Button>
            </Link>
          </div>

          <UserDashboard user={userData} />
        </div>
      </div>
    </ProtectedRoute>
  )
}



