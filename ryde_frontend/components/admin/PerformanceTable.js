const metrics = [
    {
      metric: "Avg. Response Time",
      value: "2.3s",
      change: "▼ 0.2s",
      changeColor: "text-green-500",
    },
    {
      metric: "Server Uptime",
      value: "99.99%",
      change: "▲ 0.01%",
      changeColor: "text-green-500",
    },
    {
      metric: "App Crashes",
      value: "0.05%",
      change: "▼ 0.02%",
      changeColor: "text-green-500",
    },
  ]
  
  export default function PerformanceTable() {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Metric
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Change
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {metrics.map((metric) => (
              <tr key={metric.metric}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{metric.metric}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{metric.value}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={metric.changeColor}>{metric.change}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  
  