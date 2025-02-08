"use client"

import { useState } from "react"
import { FileText, Upload, Search, Filter } from "lucide-react"

export default function DocumentsPage() {
  const [documents] = useState([
    {
      id: 1,
      name: "Driver License Guidelines.pdf",
      type: "PDF",
      size: "2.5 MB",
      category: "Guidelines",
      uploadedBy: "Admin",
      uploadDate: "2025-01-23T10:00:00",
      status: "active",
    },
    {
      id: 2,
      name: "Vehicle Registration Form.docx",
      type: "DOCX",
      size: "1.8 MB",
      category: "Forms",
      uploadedBy: "Admin",
      uploadDate: "2025-01-22T15:30:00",
      status: "active",
    },
    {
      id: 3,
      name: "Insurance Requirements.pdf",
      type: "PDF",
      size: "3.2 MB",
      category: "Legal",
      uploadedBy: "Admin",
      uploadDate: "2025-01-21T09:45:00",
      status: "archived",
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Documents</h1>
        <FileText className="w-8 h-8 text-gray-500" />
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search documents..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </button>
            <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded By
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.size}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.uploadedBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(doc.uploadDate).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        doc.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </span>
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

