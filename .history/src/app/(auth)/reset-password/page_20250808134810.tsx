// File: src/app/(auth)/reset-password/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import ForgotPasswordImage from "@/assets/images/ForgotPassword.png"; // Reusing the image
import FormField from "@/components/Form/FormField";
import { Eye, EyeOff } from "lucide-react";
import apiIAM from "@/lib/api/apiIAM"; // Import your API client

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get('email') || ""; // Get email from query parameter

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // If no email is provided in query, redirect back
    if (!emailFromQuery) {
      router.push('/login'); // Or a more appropriate error page
    }
  }, [emailFromQuery, router]);

  const validatePassword = (password: string): string => {
    if (!password) return "Password is required.";
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase character.";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase character.";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number.";
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) {
      return "Password must contain at least one special character.";
    }
    return "";
  };

  // Real-time validation handlers
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    
    // Real-time password validation
    const passwordError = validatePassword(value);
    setErrors(prev => ({ ...prev, newPassword: passwordError }));
    
    // Check if confirm password still matches
    if (confirmNewPassword && value !== confirmNewPassword) {
      setErrors(prev => ({ ...prev, confirmNewPassword: "Passwords do not match." }));
    } else if (confirmNewPassword && value === confirmNewPassword) {
      setErrors(prev => ({ ...prev, confirmNewPassword: "" }));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmNewPassword(value);
    
    // Real-time confirmation validation
    if (value !== newPassword) {
      setErrors(prev => ({ ...prev, confirmNewPassword: "Passwords do not match." }));
    } else {
      setErrors(prev => ({ ...prev, confirmNewPassword: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    let currentErrors: { [key: string]: string } = {};

    const newPasswordError = validatePassword(newPassword);
    if (newPasswordError) {
      currentErrors.newPassword = newPasswordError;
    }

    if (newPassword !== confirmNewPassword) {
      currentErrors.confirmNewPassword = "Passwords do not match.";
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Call backend to reset password
      const res = await apiIAM.post('/auth/reset-password', {
        email: emailFromQuery,
        newPassword: newPassword // Send the new password
      });

      if (res.status === 200) {
        setSuccessMessage(res.data.message || "Password has been reset successfully! Redirecting to login...");
        setTimeout(() => {
          router.push('/login'); // Redirect to login page after successful reset
        }, 2000);
      }
    } catch (err: any) {
      setErrors({ general: err.response?.data?.error || "Failed to reset password. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper component for displaying error messages
  const ErrorMessage = ({ message }: { message: string | undefined }) => {
    return message ? (
      <p className="text-red-500 text-xs mt-1">
        {message}
      </p>
    ) : null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 p-4 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Image and Marketing Text */}
        <div className="md:w-1/2 bg-gradient-to-br from-teal-500 to-blue-800 text-white flex flex-col items-center justify-center p-10 py-12">
          <h2 className="text-3xl font-bold mb-4 text-center">Reset your password</h2>
          <Image src={ForgotPasswordImage} alt="Reset Password" width={300} height={300} className="mb-4 drop-shadow-lg" />
          <p className="text-center text-sm max-w-sm mb-6 leading-relaxed opacity-90">
            Choose a strong, new password that you haven't used before.
          </p>
        </div>

        {/* Right Side - Reset Password Form */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Reset password</h2>
          <p className="text-gray-600 text-center mb-8 text-sm">Enter your new password for {emailFromQuery}</p> {/* Display email */}
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            {/* New Password */}
            <div className="relative mb-6">
              <FormField
                label="Enter your new password"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pr-10 rounded-full bg-yellow-50/50 border-yellow-200"
                requireField={true}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(prev => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer top-8 text-gray-600 hover:text-gray-900"
                aria-label={showNewPassword ? "Hide new password" : "Show new password"}
              >
                {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                ) : (
                    <Eye className="w-5 h-5" />
                )}
              </button>
              <ErrorMessage message={errors.newPassword} />
            </div>

            {/* Confirm New Password */}
            <div className="relative mb-6">
              <FormField
                label="Confirm new password"
                name="confirmNewPassword"
                type={showConfirmNewPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="pr-10 rounded-full bg-yellow-50/50 border-yellow-200"
                requireField={true}
              />
              <button
                type="button"
                onClick={() => setShowConfirmNewPassword(prev => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer top-8 text-gray-600 hover:text-gray-900"
                aria-label={showConfirmNewPassword ? "Hide confirm new password" : "Show confirm new password"}
              >
                {showConfirmNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                ) : (
                    <Eye className="w-5 h-5" />
                )}
              </button>
              <ErrorMessage message={errors.confirmNewPassword} />
            </div>

            {errors.general && <p className="text-red-500 text-xs mt-1 text-center">{errors.general}</p>}
            {successMessage && <p className="text-green-500 text-xs mt-1 text-center">{successMessage}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full text-white font-semibold bg-blue-800 hover:bg-blue-900 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Resetting..." : "Confirm"}
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