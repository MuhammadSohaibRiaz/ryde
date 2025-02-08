"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/buttons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthLayout from "@/components/auth/AuthLayout"
import { useDispatch, useSelector } from "react-redux"

export default function PassengerLogin() {
  const router = useRouter()
  const [name, setName] = useState("")

  const dispatch = useDispatch();

  const { loading, error, isLoggedIn, user } = useSelector((state) => state.auth);



  if (isLoggedIn) {
    if (user.role == "user") {
      router.push("/profile");
    }
    if (user.role == "driver") {
      router.push("/driver-dashboard");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      alert("Please enter your name to continue.")
      return
    }
    // Redirect guest to the main application
    router.push("/main")
  }

  return (
    <AuthLayout title="Welcome Guest" subtitle="Enter your name to enjoy the ride">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Your Name</Label>
          <div className="relative">
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              className="pl-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Continue as Guest
        </Button>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Want full access?{" "}
            <Link href="/auth/passenger/register" className="text-orange-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
