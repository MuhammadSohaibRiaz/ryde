"use client"

import { useState } from "react"
import { Bell, Settings, Trash2 } from "lucide-react"

export default function NotificationsPage() {
  const [notifications] = useState([
    {
      id: 1,
      type: "system",
      title: "System Maintenance",
      message: "Scheduled maintenance will occur on January 25th at 2 AM EST",
      date: "2025-01-23T12:00:00",
      read: false,
    },
    {
      id: 2,
      type: "alert",
      title: "High Demand Alert",
      message: "Surge pricing is now active in downtown area",
      date: "2025-01-23T11:30:00",
      read: true,
    },
    {
      id: 3,
      type: "update",
      title: "New Feature Available",
      message: "Driver ratings system has been updated",
      date: "2025-01-23T10:15:00",
      read: true,
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Notifications</h1>
        <Bell className="w-8 h-8 text-gray-500" />
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold">Notification Center</h2>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
              {notifications.filter(n => !n.read).length} Unread
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Settings className="w-5 h-5 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Trash2 className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border rounded-lg ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{notification.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{notification}</p>
                  <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
                  <div className="mt-2 text-xs text-gray-400">
                    {new Date(notification.date).toLocaleString()}
                  </div>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

