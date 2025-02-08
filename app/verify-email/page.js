"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"


import { Button } from "@/components/ui/buttons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthLayout from "@/components/auth/AuthLayout"
import { useDispatch, useSelector } from "react-redux"
import { resendEmail, verifyEmail } from "@/lib/features/AuthSlice"

export default function VerifyEmail() {

  const router = useRouter()

  const dispatch = useDispatch();

  const { loading, error, requires2FA, user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    otp: "",
  })

  useEffect(() => {
    // Add a small delay to ensure state is settled
    const redirectTimeout = setTimeout(() => {
      if (!user || !requires2FA) {
        router.push("/");
      } else if (user?.otp?.verified) {
        const path = user.role === "driver" ? "/driver-dashboard" : "/profile";
        router.push(path);
      }
    }, 100);

    return () => clearTimeout(redirectTimeout);
  }, [requires2FA, user, router]);

  if (loading) {
    return <p>Loading...</p>
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(verifyEmail({
        otp: parseInt(formData.otp),
        email: user.email,
        role: user.role
      })).unwrap();
      
      // Add immediate redirect after successful verification
      const path = user.role === "driver" ? "/driver-dashboard" : "/profile";
      router.push(path);
    } catch (error) {
      console.error(error.message)
      alert(error.message)
    }
  }

  const handleResendEmail = async (e) => {
    e.preventDefault()
    try {
      console.log(user)
      const res = await dispatch(resendEmail(user)).unwrap()
      alert("Email sent successfully")
    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }

  const handleOtpChange = (e) => {
    console.log(e.target.value)
    setFormData({ otp: e.target.value })
  }

  return (
    <AuthLayout title="Verify Account" subtitle={`Enter the otp sent to ${user?.email || null}, to get access to your account`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          {/* two factor auth otp input */}
          <Label htmlFor="otp">Enter the otp</Label>
          <div className="relative">
            <Input
              id="otp"
              type="otp"
              placeholder="Enter the six digit otp"
              value={formData.otp}
              onChange={(e) => handleOtpChange(e)}
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" loading={loading} disabled={loading}>
          Verify
        </Button>

        {/* resend email */}

        <div className="flex justify-center">
          <Button type="button" onClick={handleResendEmail} loading={loading} disabled={loading}>
            Resend otp
          </Button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </AuthLayout>
  )
}

