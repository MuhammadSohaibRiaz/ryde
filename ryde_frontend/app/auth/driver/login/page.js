"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock } from "lucide-react"

import { Button } from "@/components/ui/buttons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthLayout from "@/components/auth/AuthLayout"
import { useDispatch, useSelector } from "react-redux"
import { driverLogin } from "@/lib/features/AuthSlice"
import { USER_TYPES } from "@/types/profiles"

export default function DriverLogin() {

  const router = useRouter()

  const dispatch = useDispatch();

  const { loading, error, isLoggedIn, user } = useSelector((state) => state.auth);


  // Add useEffect to handle navigation after login
  useEffect(() => {
    if (isLoggedIn && !loading && user) {
      if (user.role === USER_TYPES.DRIVER && !user.requires2FA) {
        router.replace("/driver-profile");
      } else if (user.requires2FA) {
        router.replace("/verify-email");
      }
    }
  }, [isLoggedIn, loading, user, router]);


  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(driverLogin(formData)).unwrap();
      // Remove the manual router push here
    } catch (error) {
      console.error("Login failed:", error);
      // Error is already handled by the reducer
    }
  }

  return (
    <AuthLayout title="Driver Sign In" subtitle="Sign in to your driver account to start accepting rides">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="pl-9"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="pl-9"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" className="w-full">
          {loading ? "Loading..." : "Sign In"}
        </Button>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Want to become a driver?{" "}
            <Link href="/auth/driver/register" className="text-orange-600 hover:underline">
              Sign up
            </Link>
          </p>
          <Link href="/auth/driver/forgot-password" className="text-sm text-orange-600 hover:underline">
            Forgot password?
          </Link>

        </div>
      </form>
    </AuthLayout>
  )
}

