"use client"

import { useState } from "react"
import Image from "next/image"

export default function GuestProfile() {
  const [guest, setGuest] = useState({
    name: "Guest User",
    avatar: "/user.png",
  })

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white shadow-lg rounded-lg">
        <div className="p-6 flex flex-col items-center">
          <Image src={guest.avatar} alt={guest.name} width={100} height={100} className="rounded-full" />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">{guest.name}</h2>
        </div>
      </div>
    </div>
  )
}
