// src/components/Form/UserForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { CreateUserRequest, RoleResponseDTO } from "@/type/user";
import { XMarkIcon } from "@heroicons/react/24/outline";
import toast from 'react-hot-toast'; // Import toast

interface UserFormProps {
  user: CreateUserRequest | null; // Null for creation
  allRoles: RoleResponseDTO[];
  rolesLoading: boolean;
  rolesError: string | null;
  onSave: (userData: CreateUserRequest) => Promise<void>; // onSave now returns a Promise<void>
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  allRoles,
  rolesLoading,
  rolesError,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<CreateUserRequest>(
    user || {
      fullName: "",
      email: "",
      phone: "",
      identifyNum: "",
      address: "",
      gender: "",
      password: "",
      date_of_Birth: "",
      roleIds: [],
    }
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // For client-side and backend field errors
  const [submitLoading, setSubmitLoading] = useState(false);
  // Removed submitError as field-specific errors will be handled by 'errors' state
  // and general errors by toast.

  // If we were editing, we'd pre-populate the form
  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const validatePassword = (password: string) => {
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one capital letter.";
    if (!/\d/.test(password)) return "Password must contain at least one number.";
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return "Password must contain at least one special character.";
    return "";
  };

  const validatePhone = (phone: string) => {
    if (!phone) return "Phone number is required.";
    const phoneDigits = phone.replace(/\D/g, ''); // Remove all non-digit characters
    if (phoneDigits.length !== 10) return "Phone number must be exactly 10 digits.";
    return "";
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required.";
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid.";
    }
    
    // Enhanced phone validation
    const phoneError = validatePhone(formData.phone || "");
    if (phoneError) newErrors.phone = phoneError;
    
    if (!formData.identifyNum) newErrors.identifyNum = "Identification Number is required.";
    
    // Enhanced password validation
    const passwordError = validatePassword(formData.password || "");
    if (passwordError) newErrors.password = passwordError;
    
    if (!formData.date_of_Birth) newErrors.date_of_Birth = "Date of Birth is required.";
    if (formData.roleIds.length === 0) newErrors.roleIds = "At least one role must be selected.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Real-time password validation
    if (name === 'password') {
      const passwordError = validatePassword(value);
      setErrors((prev) => ({ ...prev, password: passwordError }));
    } else if (name === 'phone') {
      // Real-time phone validation
      const phoneError = validatePhone(value);
      setErrors((prev) => ({ ...prev, phone: phoneError }));
    } else if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error when user types
    }
  };

  const handleRoleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const roleId = Number(value);

    setFormData((prev) => {
      const currentRoleIds = new Set(prev.roleIds);
      if (checked) {
        currentRoleIds.add(roleId);
      } else {
        currentRoleIds.delete(roleId);
      }
      return { ...prev, roleIds: Array.from(currentRoleIds) };
    });

    if (errors.roleIds) {
      setErrors((prev) => ({ ...prev, roleIds: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // Clear all errors before new submission attempt
    
    if (!validate()) {
      return;
    }

    setSubmitLoading(true);
    try {
      await onSave(formData); // Call the onSave prop from the parent
      // If onSave completes without throwing, it means success.
      // The parent (UsersPage) will handle closing the form and showing success toast.
    } catch (err: any) {
      // Catch errors thrown by onSave (e.g., duplicate errors or general API errors)
      console.error("Error during user form submission:", err);

      if (err.fieldErrors) {
        // This is a structured error with specific field messages (e.g., duplicates)
        setErrors((prevErrors) => ({ ...prevErrors, ...err.fieldErrors }));
        toast.error("Registration failed due to duplicate information.");
      } else {
        // This is a general error message
        toast.error(err.message || 'An unknown error occurred during submission.');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-y-auto grid grid-cols-1 md:grid-cols-2">
        {/* Left Section: User Details Form */}
        <div className="p-8 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {user ? "Edit User" : "Create New User"}
            </h2>
            <button onClick={onClose}>
              <XMarkIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name<span className="text-red-500">*</span></label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter full name"
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email<span className="text-red-500">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter email address"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password is required for creation, might be optional/different for edit */}
            {!user && ( // Only show password field for creation
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password<span className="text-red-500">*</span></label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter password"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>
            )}


            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number<span className="text-red-500">*</span></label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter phone number"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="identifyNum" className="block text-sm font-medium text-gray-700 mb-1">Identification Number<span className="text-red-500">*</span></label>
              <input
                type="text"
                id="identifyNum"
                name="identifyNum"
                value={formData.identifyNum}
                onChange={handleChange}
                className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.identifyNum ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter identification number"
              />
              {errors.identifyNum && <p className="mt-1 text-sm text-red-600">{errors.identifyNum}</p>}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter address"
              ></textarea>
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="date_of_Birth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth<span className="text-red-500">*</span></label>
              <input
                type="date"
                id="date_of_Birth"
                name="date_of_Birth"
                value={formData.date_of_Birth}
                onChange={handleChange}
                className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.date_of_Birth ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.date_of_Birth && <p className="mt-1 text-sm text-red-600">{errors.date_of_Birth}</p>}
            </div>
            {/* Removed submitError message as field-specific errors are displayed inline */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r button text-white font-semibold py-2 px-4 rounded-full shadow-md transition"
                disabled={submitLoading}
              >
                {submitLoading ? "Saving..." : (user ? "Update User" : "Create User")}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border outline-button font-medium py-2 px-4 rounded-fulltransition"
                disabled={submitLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Right Section: Role Assignment */}
        <div className="p-8 bg-gray-50 border-l overflow-y-auto max-h-[90vh]">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Assign Roles<span className="text-red-500">*</span>
          </h2>
          {rolesLoading ? (
            <p className="text-gray-600 text-center">Loading roles...</p>
          ) : rolesError ? (
            <p className="text-red-600 text-center">Error loading roles: {rolesError}</p>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allRoles.map((role) => (
                  <label key={role.roleId} className="flex items-center text-sm gap-2 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <input
                      type="checkbox"
                      value={role.roleId}
                      checked={formData.roleIds.includes(role.roleId)}
                      onChange={handleRoleCheckboxChange}
                      className="accent-blue-600 h-4 w-4 rounded"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">{role.name}</span>
                      <span className="text-gray-500 text-xs">{role.description}</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.roleIds && <p className="mt-1 text-sm text-red-600 text-center">{errors.roleIds}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserForm;