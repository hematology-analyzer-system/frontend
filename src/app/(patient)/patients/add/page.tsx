"use client";

import React, { useState, useEffect } from "react";
import apiPatient from "@/lib/api/apiPatient";
import FormField from "@/components/Form/FormField";

type GenderType = "MALE" | "FEMALE" | "OTHER";


interface PropsType {
  fullName: string;
  address: string;
  gender: GenderType;
  dateOfBirth?: Date;
  phone: string;
  email: string;
}

const Page = ({ fullName, address, gender, dateOfBirth, phone, email }: PropsType) => {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    gender: "MALE",
    dateOfBirth: "",
    phone: "",
    email: ""
  });

  useEffect(() => {
    setFormData({
      fullName,
      address,
      gender,
      dateOfBirth: dateOfBirth instanceof Date ? dateOfBirth.toISOString().split("T")[0] : "",
      phone,
      email
    });
  }, [fullName, address, gender, dateOfBirth, phone, email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Submitting patient:", JSON.stringify(formData, null, 2));

      const res = await apiPatient.post("/patients", formData, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log("Success:", res.data);
      alert("Patient saved successfully!");
    } catch (error) {
      console.error("Error saving patient:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-2xl transition-all duration-300">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Patient Information Form</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Full Name */}
        <FormField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" />

        {/* Email */}
        <FormField label="Email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" type="email" />

        {/* Phone */}
        <FormField label="Phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" type="tel" />

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* Date of Birth */}
        <FormField label="Date of Birth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} type="date" />

        {/* Address */}
        <FormField label="Address" name="address" value={formData.address} onChange={handleChange} placeholder="Enter your address" />

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
          >
            Save Information
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
