"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"

export default function PricingChart() {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Morning", "Afternoon", "Evening", "Night"],
        datasets: [
          {
            label: "Price Multiplier",
            data: [1.2, 1.0, 1.5, 1.8],
            backgroundColor: "#FFA500",
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
    <div className="h-[300px]">
      <canvas ref={chartRef} />
    </div>
  )
}

