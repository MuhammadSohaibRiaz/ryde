"use client"

import { fetchDashboardDataBrief } from "@/lib/features/adminRoutes"
import { Users, Car, DollarSign, Star } from "lucide-react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import api from "@/lib/axios"
const stats = [
  {
    icon: Users,
    title: "Total Users",
    value: "5,234",
    color: "bg-blue-500",
  },
  {
    icon: Car,
    title: "Total Rides",
    value: "12,456",
    color: "bg-green-500",
  },
  {
    icon: DollarSign,
    title: "Revenue",
    value: "$45,678",
    color: "bg-yellow-500",
  },
  {
    icon: Star,
    title: "Avg. Rating",
    value: "4.7",
    color: "bg-purple-500",
  },
]

export default function StatsGrid({}) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
              <stat.icon className={`w-6 h-6 ${stat.color.replace("bg-", "text-")}`} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

