"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock } from "lucide-react"

import { Button } from "@/components/ui/buttons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthLayout from "@/components/auth/AuthLayout"
import { useDispatch, useSelector } from "react-redux"
import { driverLogin } from "@/lib/features/AuthSlice"

export default function DriverLogin() {

  // const router = useRouter()

  // const dispatch = useDispatch();

  const { loading, error, isLoggedIn, user } = useSelector((state) => state.auth);



  // if (isLoggedIn) {
  //   if (user.role == "user") {
  //     router.push("/profile");
  //   }
  //   if (user.role == "driver") {
  //     router.push("/driver-dashboard");
  //   }
  // }


  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await dispatch(driverLogin(formData)).unwrap()
      router.push("/driver-dashboard")
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  return (
    <AuthLayout title="Two Factor Auth Code" subtitle="Enter the code sent to your email">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          {/* two factor auth code input */}
          <Label htmlFor="code">Enter the code</Label>
          <div className="relative">
            <Input
              id="code"
              type="code"
              placeholder="Enter the code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" loading={loading} disabled={loading}>
          Verify
        </Button>
      </form>
    </AuthLayout>
  )
}

