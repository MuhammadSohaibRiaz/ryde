"use client"

import { useState, useRef, useEffect } from "react"
import { Bell } from "lucide-react"

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Your last ride was rated 5 stars!",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      message: "New payment method added successfully",
      time: "1 day ago",
      read: true,
    },
  ])

  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const markAsRead = (id) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-full hover:bg-gray-100"
        aria-label={`${unreadCount} unread notifications`}
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-[100] max-h-[80vh] overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => setNotifications(notifications.map((n) => ({ ...n, read: true })))}
                  className="text-sm text-orange-500 hover:text-orange-600"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded transition-colors cursor-pointer hover:bg-gray-50 ${
                      notification.read ? "bg-white" : "bg-blue-50"
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <p className="text-sm">{notification.message}</p>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No notifications</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

