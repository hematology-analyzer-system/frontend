"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ 
    fullName: "", 
    email: "", 
    password: "", 
    phone: "", 
    gender: "", 
    Date_of_Birth: "", 
    Age: "", 
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

    // 1. Client-side validation: Password match
    setErrors({}); // Clear previous errors
    if (form.password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match." });
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/iam/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Only send the main form data, not the confirmPassword
        body: JSON.stringify(form), 
      });

      if (res.ok) {
        alert("Check your email for verification!");
        router.push("/auth/login");
      } else {
        // 2. Server-side validation: Handle duplicates
        const errorData = await res.json();

        if (errorData.message) {
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
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed due to network or server error.");
    }
  };

  const ErrorMessage = ({ message }: { message: string }) => (
    <p className="text-red-500 text-sm mt-1">{message}</p>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-center mb-6">User Registration</h2>
      
      {/* Full Name */}
      <div>
        <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} value={form.fullName} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {/* Email */}
      <div>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} value={form.email} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        {errors.email && <ErrorMessage message={errors.email} />}
      </div>

      {/* Password */}
      <div>
        <input type="password" name="password" placeholder="Password" onChange={handleChange} value={form.password} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {/* Confirm Password */}
      <div>
        <input 
          type="password" 
          name="confirmPassword" 
          placeholder="Confirm Password" 
          onChange={handleConfirmPasswordChange} 
          value={confirmPassword} 
          required 
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
        {errors.confirmPassword && <ErrorMessage message={errors.confirmPassword} />}
      </div>

      {/* Phone */}
      <div>
        <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} value={form.phone} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        {errors.phone && <ErrorMessage message={errors.phone} />}
      </div>

      {/* Identify Number */}
      <div>
        <input type="text" name="identifyNum" placeholder="Identity Number" onChange={handleChange} value={form.identifyNum} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        {errors.identifyNum && <ErrorMessage message={errors.identifyNum} />}
      </div>

      {/* Gender */}
      <div>
        <select 
          name="gender" 
          onChange={handleChange} 
          value={form.gender} 
          required 
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {/* Date of Birth */}
      <div>
        <input type="date" name="Date_of_Birth" onChange={handleChange} value={form.Date_of_Birth} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {/* Age */}
      <div>
        <input type="number" name="Age" placeholder="Age" onChange={handleChange} value={form.Age} required min="0" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {/* Address */}
      <div>
        <input type="text" name="address" placeholder="Address" onChange={handleChange} value={form.address} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <button 
        type="submit" 
        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
      >
        Register
      </button>
    </form>
  );
}