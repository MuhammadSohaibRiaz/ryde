"use client"

import { useState } from "react"
import { AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react"

export default function EmergencyAlertsPage() {
  const [alerts] = useState([
    {
      id: 1,
      type: "emergency",
      user: "Jane Smith",
      status: "active",
      location: "123 Main St, Buffalo",
      time: "2 minutes ago",
      description: "Driver requested immediate assistance",
    },
    {
      id: 2,
      type: "warning",
      user: "John Doe",
      status: "resolved",
      location: "456 Elm St, Buffalo",
      time: "15 minutes ago",
      description: "Vehicle breakdown reported",
    },
    {
      id: 3,
      type: "info",
      user: "Mike Johnson",
      status: "pending",
      location: "789 Oak St, Buffalo",
      time: "1 hour ago",
      description: "Route deviation detected",
    },
  ])

  const getAlertIcon = (type) => {
    switch (type) {
      case "emergency":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "info":
        return <CheckCircle2 className="w-5 h-5 text-blue-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-red-100 text-red-800",
      resolved: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
    }

    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Emergency Alerts</h1>
        <AlertTriangle className="w-8 h-8 text-gray-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Active Alerts</h2>
          <div className="space-y-4">
            {alerts
              .filter((alert) => alert.status === "active")
              .map((alert) => (
                <div key={alert.id} className="flex items-start space-x-4 p-4 border rounded-lg bg-red-50">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{alert.user}</h3>
                      {getStatusBadge(alert.status)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <span>{alert.location}</span>
                      <span className="mx-2">•</span>
                      <span>{alert.time}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
          <div className="space-y-4">
            {alerts
              .filter((alert) => alert.status !== "active")
              .map((alert) => (
                <div key={alert.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{alert.user}</h3>
                      {getStatusBadge(alert.status)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <span>{alert.location}</span>
                      <span className="mx-2">•</span>
                      <span>{alert.time}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

