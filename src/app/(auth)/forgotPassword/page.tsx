// File: src/app/(auth)/forgot-password/page.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ForgotPasswordImage from "@/assets/images/ForgotPassword.png"; // Corrected image import
import FormField from "@/components/Form/FormField"; // Ensure this path is correct
import apiIAM from "@/lib/api/apiIAM"; // Import your API client

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    try {
      // Call backend to send OTP for password reset
      const res = await apiIAM.post('/auth/forgot-password', email, {
        headers: {
          'Content-Type': 'text/plain' // Backend expects String as @RequestBody
        }
      });

      if (res.status === 200) {
        setSuccessMessage(res.data.message || "OTP sent successfully! Redirecting to verification page.");
        setTimeout(() => {
          // Redirect to the new verify-otp page for password reset flow
          router.push(`/verify?email=${encodeURIComponent(email)}&flow=forgotPassword`);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 p-4 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Image and Marketing Text */}
        <div className="md:w-1/2 bg-gradient-to-br from-teal-500 to-blue-800 text-white flex flex-col items-center justify-center p-10 py-12">
          <h2 className="text-3xl font-bold mb-4 text-center">Forgot your password?</h2>
          <Image src={ForgotPasswordImage} alt="Forgot Password" width={300} height={300} className="mb-4 drop-shadow-lg" />
          <p className="text-center text-sm max-w-sm mb-6 leading-relaxed opacity-90">
            Don't worry, it happens to the best of us. Just enter your registered email below to receive a password reset code.
          </p>
        </div>

        {/* Right Side - Forgot Password Form */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Forgot your password?</h2>
          <p className="text-gray-600 text-center mb-8 text-sm">Give us your registered email address for verification</p>
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="mb-6">
              <FormField
                label="Enter your email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-full bg-yellow-50/50 border-yellow-200"
                requireField={true} // Mark as required
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              {successMessage && <p className="text-green-500 text-xs mt-1">{successMessage}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full text-white font-semibold bg-blue-800 hover:bg-blue-900 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>

            <a href="/login" className="text-sm text-gray-500 mt-6 hover:underline block text-center">
              Back to sign in
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}