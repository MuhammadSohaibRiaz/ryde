"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/buttons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthLayout from "@/components/auth/AuthLayout"
import { useDispatch, useSelector } from "react-redux"
import { login } from "@/lib/features/AuthSlice"
import { USER_TYPES } from "@/types/profiles"

export default function PassengerLogin() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, isLoggedIn, user } = useSelector((state) => state.auth);

  useEffect(() => {

    if (isLoggedIn && !loading && user) {
      console.log('User state:', user); // Add for debugging
      if (user.role === USER_TYPES.USER && !user.requires2FA) {
         router.replace('/profile');
      } else if (user.requires2FA) {
         router.replace('/verify-email');
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
      await dispatch(login(formData)).unwrap();
      // Remove manual navigation - let useEffect handle it
    } catch (error) {
      console.error("Login failed:", error);
      // Error is already handled by the reducer
    }
  }

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your passenger account to continue">
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

        <div className="text-red-600 text-sm">{error}</div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </Button>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/auth/passenger/register" className="text-orange-600 hover:underline">
              Sign up
            </Link>
          </p>
          <Link href="/auth/passenger/forgot-password" className="text-sm text-orange-600 hover:underline">
            Forgot password?
          </Link>

          {/* want to use service as guest */}
          <p className="text-sm text-gray-600">
            Want to use our service as a guest?{" "}
            <Link href="/auth/guest/login" className="text-orange-600 hover:underline">
              Continue as Guest
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}

