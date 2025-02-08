"use client"

import { LineChart } from "lucide-react"
import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"

export default function AnalyticsPage() {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Revenue",
            data: [12000, 19000, 15000, 25000, 22000, 30000],
            borderColor: "#FFA500",
            tension: 0.1,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Analytics</h1>
        <LineChart className="w-8 h-8 text-gray-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
          <div className="h-[300px]">
            <canvas ref={chartRef} />
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-semibold">65%</div>
                <span className="text-green-500">↑ 12%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Order Value</p>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-semibold">$45.50</div>
                <span className="text-green-500">↑ 8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

