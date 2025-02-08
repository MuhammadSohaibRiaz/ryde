"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Lock, User, Phone } from "lucide-react"
import { Button } from "@/components/ui/buttons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthLayout from "@/components/auth/AuthLayout"
import Modal from "@/components/ui/popup"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { register } from "@/lib/features/AuthSlice"


export default function PassengerRegister() {

  const dispatch = useDispatch();
  const router = useRouter();

  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNo: "",
    password: "",
    confirmPassword: "",
  })
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!termsAccepted) {
      alert("You must accept the terms and conditions to register.")
      return
    }
    console.log(formData);

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }


    try {
      const result = await dispatch(register(formData)).unwrap();
      console.log("User Registered:", result);
      router.push("/verify-email"); // Redirect to dashboard after successful registration
    } catch (error) {
      console.error("Registration failed:", error);
      alert(error.message || "Registration failed");
    }

  }

  return (
    <AuthLayout title="Create Your Account" subtitle="Sign up as a passenger to start riding with us">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullname">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="fullname"
              placeholder="Enter your full fullname"
              className="pl-9"
              value={formData.fullname}
              onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
              required
            />
          </div>
        </div>

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
          <Label htmlFor="phoneNo">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="phoneNo"
              type="tel"
              placeholder="Enter your phoneNo number"
              className="pl-9"
              value={formData.phoneNo}
              onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
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
              placeholder="Create a password"
              className="pl-9"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              className="pl-9"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Terms and Conditions Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="terms" className="text-sm">
            I have read and accept the
            <button
              type="button"
              className="text-orange-600 hover:underline ml-1"
              onClick={() => setShowTerms(true)}
            >
              Terms and Conditions
            </button>
          </label>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Loading..." : "Register"}
        </Button>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/passenger/login" className="text-orange-600 hover:underline">
            Sign in
          </Link>
        </p>
      </form>

      {/* Terms and Conditions Modal */}
      {showTerms && (
        <Modal title="Terms and Conditions" onClose={() => setShowTerms(false)}>
          <p>
            Here are the terms and conditions you must accept before registering.
            [Insert detailed terms and conditions here.]
          </p>
          <Button onClick={() => setShowTerms(false)} className="mt-4">
            Close
          </Button>
        </Modal>
      )}
    </AuthLayout>
  )
}
