"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function SplashScreen() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    // Check if splash screen has been shown before
    const hasShownSplash = sessionStorage.getItem("hasShownSplash")

    if (hasShownSplash) {
      setShow(false)
      return
    }

    const timer = setTimeout(() => {
      setShow(false)
      sessionStorage.setItem("hasShownSplash", "true")
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFA500] transition-opacity duration-500">
      <div className="text-center">
        <Image src="/logo.png" alt="Ryde Logo" width={200} height={39} className="mb-6" priority />
        <div className="text-2xl font-bold text-white">Welcome to Ryde5</div>
      </div>
    </div>
  )
}

