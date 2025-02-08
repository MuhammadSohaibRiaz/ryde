"use client"

import { LayoutDashboard } from "lucide-react"
import StatsGrid from "@/components/admin/StatsGrid"
import RideChart from "@/components/admin/RideChart"
import PricingChart from "@/components/admin/PricingChart"
import TrackingMap from "@/components/admin/TrackingMap"
import PaymentTable from "@/components/admin/PaymentTable"
import ReviewTable from "@/components/admin/ReviewTable"
import PerformanceTable from "@/components/admin/PerformanceTable"
import UsersOverview from "@/components/admin/UsersOverview"
import DriversOverview from "@/components/admin/DriversOverview"
import EmergencyAlerts from "@/components/admin/EmergencyAlerts"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import api from "@/lib/axios"


export default function AdminDashboard() {

  const { loading, error, isLoggedIn, user } = useSelector((state) => state.auth)
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetch = async () => {
    try {
      setIsLoaded(false)
      const response = await api.get(`/admin/dashboardDataBrief`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setDashboardData(response.data)
      setIsLoaded(true)
    } catch (error) {
      console.error(error)
      setIsLoaded(true)
    }
  }

  useEffect(() => {
    if (!loading && user && user.token) {
      fetch();
    }
  }, [loading, user]);



  if (!isLoaded) {
    return <div>Fetching dashboard data...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <LayoutDashboard className="w-8 h-8 text-gray-500" />
      </div>

      <StatsGrid />

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> */}
      <div className="grid grid-cols-1 lg:grid-cols-1">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Real-Time Tracking</h2>
          <TrackingMap />
        </div>

        {/* <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Ride Statistics</h2>
          <RideChart />
        </div> */}
      </div>

      <div>
        {
          dashboardData.totalUsers
        }
      </div>
      <UsersOverview users={dashboardData?.usersOverView ?? []} />

      <DriversOverview drivers={dashboardData?.driversOverView ?? []} />

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
        <ReviewTable />
      </div>

      <EmergencyAlerts />

      {/* Commented out sections */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Gateways</h2>
        <PaymentTable />
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Dynamic Pricing</h2>
        <PricingChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
          <ReviewTable />
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
          <PerformanceTable />
        </div>
      </div>
    </div>
  )
}

