import { AlertTriangle } from "lucide-react"

const alerts = [
  { id: 1, type: "Accident", location: "Main St & 5th Ave", status: "Active" },
  { id: 2, type: "Vehicle Breakdown", location: "Highway 101, Mile 23", status: "Resolved" },
  { id: 3, type: "Medical Emergency", location: "Central Park", status: "Active" },
]

export default function EmergencyAlerts() {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <AlertTriangle className="w-6 h-6" />
        Emergency Alerts
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {alerts.map((alert) => (
              <tr key={alert.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alert.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alert.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alert.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

