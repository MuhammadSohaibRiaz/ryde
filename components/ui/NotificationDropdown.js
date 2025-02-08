"use client"

import { useState, useRef, useEffect } from "react"
import { Bell } from "lucide-react"

export default function NotificationDropdown() {
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
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowNotifications(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleMarkAsRead = (id) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border"
          style={{
            zIndex: 1000,
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllAsRead} className="text-sm text-orange-500 hover:text-orange-600">
                  Mark all as read
                </button>
              )}
            </div>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleMarkAsRead(notification.id)}
                  className={`p-3 rounded cursor-pointer transition-colors ${
                    notification.read ? "bg-white" : "bg-blue-50"
                  } hover:bg-gray-50`}
                >
                  <p className="text-sm">{notification.message}</p>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

