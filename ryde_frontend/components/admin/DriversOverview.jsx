"use client"

import { UserCog } from "lucide-react"

// const drivers = [
//   { id: 1, name: "David Lee", vehicle: "Toyota Camry", status: "On Duty" },
//   { id: 2, name: "Emma Wilson", vehicle: "Honda Civic", status: "Off Duty" },
//   { id: 3, name: "Frank Miller", vehicle: "Ford Focus", status: "On Duty" },
// ]

export default function DriversOverview({drivers}) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <UserCog className="w-6 h-6" />
        Drivers Overview
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {drivers.map((driver) => (
              <tr key={driver.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{driver.fullname}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.vehicle.vehicleModel}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

