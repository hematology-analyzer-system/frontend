// File: src/app/(auth)/register/page.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DoctorImage from "@/assets/images/MaleDoctor.png";
import GoogleIcon from "@/assets/icons/Google";
import apiIAM from "@/lib/api/apiIAM";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrors({});

  if (form.password !== confirmPassword) {
    setErrors({ confirmPassword: "Passwords do not match." });
    return;
  }

  try {
    const res = await apiIAM.post('/auth/register', form);

    if (res.status === 200 || res.status === 201) {
      router.push('/login');
    }
  } catch (error: any) {
    const errorData = error.response?.data;

    if (errorData?.message) {
      const message = errorData.message.toLowerCase();

      if (message.includes("email") && message.includes("duplicate")) {
        setErrors({ email: "Email is already registered." });
      } else if (message.includes("phone") && message.includes("duplicate")) {
        setErrors({ phone: "Phone number is already registered." });
      } else if (message.includes("identify") && message.includes("duplicate")) {
        setErrors({ identifyNum: "Identity number is already registered." });
      } else {
        alert("Registration failed: " + errorData.message);
      }
    } else {
      alert("Registration failed.");
    }
  }
};

  const ErrorMessage = ({ message }: { message: string }) => (
    <p className="text-red-500 text-sm mt-1">{message}</p>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side */}
        <div className="bg-gradient-to-br from-teal-500 to-blue-800 text-white flex flex-col items-center justify-center p-10">
          <h2 className="text-3xl font-bold mb-4">Hello user!</h2>
          <Image src={DoctorImage} alt="Doctor" width={300} height={300} className="mb-4" />
          <p className="text-center text-sm max-w-sm mb-6">
            Please register with your official credentials to use all of site features. In case you do not have an account, press the sign-up button below.
          </p>
          <a href="/login" className="bg-gradient-to-r from-sky-400 to-blue-700 px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-lg">
            Sign in
          </a>
        </div>

        {/* Right Side */}
        <form onSubmit={handleSubmit} className="space-y-4 px-10 py-8 max-w-md w-full">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">Sign Up</h2>

          <input type="text" name="fullName" placeholder="Enter your user name" onChange={handleChange} value={form.fullName} required className="w-full px-4 py-2 rounded-full bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500" />

          <input type="email" name="email" placeholder="Enter your email" onChange={handleChange} value={form.email} required className="w-full px-4 py-2 rounded-full bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500" />
          {errors.email && <ErrorMessage message={errors.email} />}

          <input type="password" name="password" placeholder="Enter your password" onChange={handleChange} value={form.password} required className="w-full px-4 py-2 rounded-full bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500" />

          <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleConfirmPasswordChange} value={confirmPassword} required className="w-full px-4 py-2 rounded-full bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500" />
          {errors.confirmPassword && <ErrorMessage message={errors.confirmPassword} />}

          <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} value={form.phone} required className="w-full px-4 py-2 rounded-full bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500" />
          {errors.phone && <ErrorMessage message={errors.phone} />}

          <input type="text" name="identifyNum" placeholder="Identity Number" onChange={handleChange} value={form.identifyNum} required className="w-full px-4 py-2 rounded-full bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500" />
          {errors.identifyNum && <ErrorMessage message={errors.identifyNum} />}

          <select name="gender" onChange={handleChange} value={form.gender} required className="w-full px-4 py-2 rounded-full bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500">
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>

          <input type="date" name="date_of_Birth" onChange={handleChange} value={form.date_of_Birth} required className="w-full px-4 py-2 rounded-full bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500" />

          <input type="text" name="address" placeholder="Address" onChange={handleChange} value={form.address} required className="w-full px-4 py-2 rounded-full bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500" />

          <button type="submit" className="w-full py-2 rounded-full text-white font-semibold bg-blue-800 hover:bg-blue-900">
            Sign up
          </button>

          <div className="flex items-center gap-2">
            <hr className="flex-1 border-gray-300" />
            <span className="text-gray-500 text-sm">Or sign up with</span>
            <hr className="flex-1 border-gray-300" />
          </div>
          <button type="button" className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-full">
            <span className="text-lg"><GoogleIcon/></span> Sign up with Google
          </button>
          <a href="/choose-role" className="text-sm text-gray-500 mt-4 hover:underline block text-center">Back to choose role</a>
        </form>
      </div>
    </div>
  );
}
