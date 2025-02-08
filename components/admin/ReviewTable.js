const reviews = [
    {
      user: "John Doe",
      rating: 5,
      comment: "Great service!",
      date: "2025-01-21",
    },
    {
      user: "Jane Smith",
      rating: 4,
      comment: "Very satisfied",
      date: "2025-01-20",
    },
  ]
  
  export default function ReviewTable() {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comment
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.map((review) => (
              <tr key={`${review.user}-${review.date}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{review.user}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{review.rating}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{review.comment}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{review.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  
  