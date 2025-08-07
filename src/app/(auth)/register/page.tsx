// File: src/app/(auth)/register/page.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DoctorImage from "@/assets/images/MaleDoctor.png";
import GoogleIcon from "@/assets/icons/Google";
import apiIAM from "@/lib/api/apiIAM";
import FormField from "@/components/Form/FormField";
import { Eye, EyeOff } from "lucide-react";
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    date_of_Birth: "",
    address: "",
    identifyNum: ""
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state for button

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setConfirmPassword(value);
    if (errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "" }));
    }
  };

  const validatePassword = (password: string): string => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true); // Start loading

    let currentErrors: { [key: string]: string } = {};

    if (!form.fullName) currentErrors.fullName = "Full name is required.";
    if (!form.email) currentErrors.email = "Email is required.";
    if (!form.phone) currentErrors.phone = "Phone number is required.";
    if (!form.gender) currentErrors.gender = "Gender is required.";
    if (!form.date_of_Birth) currentErrors.date_of_Birth = "Date of Birth is required.";
    if (!form.address) currentErrors.address = "Address is required.";
    if (!form.identifyNum) currentErrors.identifyNum = "Identity number is required.";

    const passwordValidationError = validatePassword(form.password);
    if (passwordValidationError) {
      currentErrors.password = passwordValidationError;
    }

    if (form.password !== confirmPassword) {
      currentErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      setIsLoading(false); // Stop loading if client-side validation fails
      return;
    }

    try {
      const res = await fetch('https://fhard.khoa.email/api/iam/auth/register', {
        method : 'POST',
        headers : {
          'Content-Type': 'application/json',
        },
        body : JSON.stringify(form)
      });

      // Check if the response was successful (status code 2xx)
      if (res.ok) { // res.ok is true for 2xx status codes
        toast.success("Registration successful! Check your email for OTP.");
        router.push(`/verify?email=${encodeURIComponent(form.email)}&flow=registration`); // Use verify-otp for clarity
        // alert("Registration successful. Please check your email for verification OTP!");
      } else {
        // If response is not ok (e.g., 400, 500), parse the error and throw
        const errorData = await res.json();
        // Construct an error object that the catch block can understand
        const errorToThrow: any = new Error(errorData.message || "Registration failed");
        errorToThrow.response = { data: errorData }; // Attach the response data for error handling
        throw errorToThrow;
      }
    } catch (error: any) {
      const errorData = error.response?.data; // Use optional chaining
      const newErrors: { [key: string]: string } = {};

      console.error("API Error:", errorData || error.message); // Log the actual error

      if (errorData && Array.isArray(errorData.error)) {
          // This handles the backend's `duplicateFields` array
          for (const field of errorData.error) {
              if (field === 'email') newErrors.email = "Email is already registered.";
              else if (field === 'phone') newErrors.phone = 'Phone number is already registered.';
              else if (field === 'identify') newErrors.identifyNum = 'Identity number is already registered.';
          }
      } else if (errorData?.message) {
          // General message from backend
          alert("Registration failed: " + errorData.message);
      } else if (error.message) {
          // Network error or client-side thrown error
          alert("Registration failed: " + error.message);
      } else {
          alert("Registration failed. Please try again.");
      }
      setErrors(newErrors);
    } finally {
      setIsLoading(false); // Stop loading regardless of success or failure
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
          <h2 className="text-3xl font-bold mb-4 text-center">Hello user!</h2>
          <Image src={DoctorImage} alt="Doctor" width={300} height={300} className="mb-4 drop-shadow-lg" />
          <p className="text-center text-sm max-w-sm mb-6 leading-relaxed opacity-90">
            Please register with your official credentials to use all of site features. In case you do not have an account, press the sign-in button below.
          </p>
          <a href="/login" className="bg-gradient-to-r from-sky-400 to-blue-700 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Sign In
          </a>
        </div>

        {/* Right Side - Registration Form */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Sign Up</h2>
            <form onSubmit={handleSubmit} className="w-full max-w-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-4">
                    {/* Full Name */}
                    <div>
                        <FormField
                            label={"Full Name"}
                            name="fullName"
                            type="text"
                            placeholder="Enter your full name"
                            value={form.fullName}
                            onChange={handleChange}
                            requireField = {true}
                        />
                        <ErrorMessage message={errors.fullName} />
                    </div>

                    {/* Email */}
                    <div>
                        <FormField
                            label={"Email"}
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            requireField = {true}
                        />
                        <ErrorMessage message={errors.email} />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <FormField
                            label={"Password"}
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            className="pr-10"
                            requireField = {true}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer top-7 text-gray-600 hover:text-gray-900"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                        <ErrorMessage message={errors.password} />
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <FormField
                            label={"Confirm Password"}
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className="pr-10"
                            requireField = {true}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(prev => !prev)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer top-7 text-gray-600 hover:text-gray-900"
                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                        <ErrorMessage message={errors.confirmPassword} />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <FormField
                            label={"Phone"}
                            name="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            value={form.phone}
                            onChange={handleChange}
                            requireField = {true}
                        />
                        <ErrorMessage message={errors.phone} />
                    </div>

                    {/* Identity Number */}
                    <div>
                        <FormField
                            label={"Identify Number"}
                            name="identifyNum"
                            type="text"
                            placeholder="Enter your identity number"
                            value={form.identifyNum}
                            onChange={handleChange}
                            requireField = {true}
                        />
                        <ErrorMessage message={errors.identifyNum} />
                    </div>

                    {/* Gender */}
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                            Gender <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="gender"
                                name="gender"
                                onChange={handleChange}
                                value={form.gender}
                                required
                                className="w-full px-5 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none pr-10 transition-colors duration-200"
                            >
                                <option value="" disabled>Select Gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                        <ErrorMessage message={errors.gender} />
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <FormField
                            label={"Date of Birth"}
                            name="date_of_Birth"
                            type="date"
                            value={form.date_of_Birth}
                            onChange={handleChange}
                            className="pr-4"
                            requireField = {true}
                        />
                        <ErrorMessage message={errors.date_of_Birth} />
                    </div>

                    {/* Address - This one spans two columns */}
                    <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            placeholder="Enter your address"
                            onChange={handleChange}
                            value={form.address}
                            required
                            className="w-full px-5 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200"
                        />
                        <ErrorMessage message={errors.address} />
                    </div>
                </div>

                {/* Sign up Button */}
                <button
                    type="submit"
                    disabled={isLoading} // Disable button when loading
                    className="w-full py-3 mt-4 rounded-lg text-white font-semibold bg-blue-800 hover:bg-blue-900 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Signing Up..." : "Sign Up"}
                </button>

                {/* Separator */}
                <div className="flex items-center gap-2 my-6">
                    <hr className="flex-1 border-gray-300" />
                    <span className="text-gray-500 text-sm">Or sign up with</span>
                    <hr className="flex-1 border-gray-300" />
                </div>

                {/* Google Sign up Button */}
                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-lg text-gray-700 font-semibold bg-white hover:bg-gray-50 shadow-sm transition-all duration-200 transform hover:-translate-y-0.5"
                >
                    <span className="text-lg"><GoogleIcon /></span> Sign up with Google
                </button>

                {/* Back to choose role link */}
                <a href="/choose-role" className="text-sm text-gray-500 mt-6 hover:underline block text-center">
                    Back to choose role
                </a>
            </form>
        </div>
      </div>
    </div>
  );
}