"use client"

import { useState } from "react"
import { MessageSquare, Search } from "lucide-react"

export default function SupportTicketsPage() {
  const [tickets] = useState([
    {
      id: "TKT-001",
      user: "John Smith",
      subject: "Payment Issue",
      priority: "high",
      status: "open",
      created: "2025-01-23T10:30:00",
      lastUpdate: "2025-01-23T11:45:00",
    },
    {
      id: "TKT-002",
      user: "Mary Johnson",
      subject: "App Navigation Problem",
      priority: "medium",
      status: "in-progress",
      created: "2025-01-23T09:15:00",
      lastUpdate: "2025-01-23T10:20:00",
    },
    {
      id: "TKT-003",
      user: "Robert Wilson",
      subject: "Account Verification",
      priority: "low",
      status: "resolved",
      created: "2025-01-22T15:45:00",
      lastUpdate: "2025-01-23T09:30:00",
    },
  ])

  const getPriorityBadge = (priority) => {
    const styles = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    }

    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    )
  }

  const getStatusBadge = (status) => {
    const styles = {
      open: "bg-blue-100 text-blue-800",
      "in-progress": "bg-yellow-100 text-yellow-800",
      resolved: "bg-green-100 text-green-800",
    }

    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status]}`}>
        {status
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Support Tickets</h1>
        <MessageSquare className="w-8 h-8 text-gray-500" />
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tickets..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <div className="flex space-x-2">
            <select className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket ID
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Update
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{ticket.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.user}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getPriorityBadge(ticket.priority)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(ticket.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(ticket.created).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(ticket.lastUpdate).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

