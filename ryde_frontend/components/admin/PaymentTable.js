const payments = [
    {
      gateway: "Stripe",
      transactions: "1,234",
      amount: "$12,345",
      status: "Active",
      statusColor: "text-green-500",
    },
    {
      gateway: "PayPal",
      transactions: "987",
      amount: "$9,870",
      status: "Active",
      statusColor: "text-green-500",
    },
    {
      gateway: "Square",
      transactions: "567",
      amount: "$5,670",
      status: "Maintenance",
      statusColor: "text-orange-500",
    },
  ]
  
  export default function PaymentTable() {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gateway
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transactions
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.gateway}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.gateway}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.transactions}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={payment.statusColor}>{payment.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  
  