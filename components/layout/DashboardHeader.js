"use client"

import Link from "next/link"
import { cn } from "@/components/lib/utils"
import NotificationBell from "../NotificationBell"

export function DashboardHeader({ title, activeTab, onTabChange, notificationCount = 0 }) {
  return (
    <div className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Navigation */}
        <div className="relative flex items-center justify-between py-4">
          {/* Title aligned to the left */}
          <h1 className="text-xl font-semibold">{title}</h1>

          {/* Notification Bell aligned to the right */}
          <div className="flex-shrink-0 ml-auto">
            <NotificationBell notificationCount={notificationCount} />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 pt-2">
          <button
            onClick={() => onTabChange("dashboard")}
            className={cn(
              "px-6 py-3 text-sm font-medium rounded-t-lg transition-colors relative",
              activeTab === "dashboard"
                ? "text-purple-600 bg-gray-100"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
            )}
          >
            Dashboard
            {activeTab === "dashboard" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />}
          </button>
          <button
            onClick={() => onTabChange("profile")}
            className={cn(
              "px-6 py-3 text-sm font-medium rounded-t-lg transition-colors relative",
              activeTab === "profile"
                ? "text-purple-600 bg-gray-100"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
            )}
          >
            Profile
            {activeTab === "profile" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />}
          </button>
        </div>
      </div>
    </div>
  )
}
