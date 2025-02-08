"use client"

import Link from "next/link"
import Image from "next/image"
import { UserCircle, Truck } from "lucide-react"

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-white">
      <Link href="/" className="flex items-center">
        <Image src="/logo.png" alt="Ryde Logo" width={180} height={35} priority className="object-contain" />
      </Link>
      <div className="flex gap-4">
        <Link
          href="/profile"
          className="px-4 py-2 text-gray-700 hover:text-orange-300 transition-colors flex items-center"
        >
          <UserCircle className="w-5 h-5 mr-2" />
          User Profile
        </Link>
        <Link
          href="/driver-profile"
          className="px-4 py-2 text-gray-700 hover:text-orange-500 transition-colors flex items-center"
        >
          <Truck className="w-5 h-5 mr-2" />
          Driver Profile
        </Link>
        <Link
          href="/register-driver"
          className="px-6 py-2 font-bold text-white bg-[#FFA500] rounded hover:bg-[#FF4500]/90 transition-colors"
        >
          Register as Driver
        </Link>
        <Link
          href="/admin"
          className="px-6 py-2 font-bold text-white bg-[#FFA500] rounded hover:bg-[#FF4500]/90 transition-colors"
        >
          Admin Dashboard
        </Link>
      </div>
    </header>
  )
}

