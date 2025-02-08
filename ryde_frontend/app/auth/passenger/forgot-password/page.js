"use client"

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/buttons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/auth/AuthLayout";
import { sendResetCode } from "@/lib/features/AuthSlice";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await dispatch(sendResetCode({ email })).unwrap();
      setMessage("A reset code has been sent to your email.");
    } catch (err) {
      setError(err.message || "Failed to send reset code.");
    }
    setLoading(false);
  };

  return (
    <AuthLayout title="Forgot Password" subtitle="Enter your email to reset your password">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {message && <p className="text-green-600 text-sm">{message}</p>}
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Code"}
        </Button>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Remembered your password? {" "}
            <Link href="/auth/passenger/login" className="text-orange-600 hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
