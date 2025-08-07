"use client";

import { useState, useEffect } from "react";
import { Patient } from "../fetch";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import LogoutButton from "@/components/Button/logoutBtn";


export const PatientInfoCard = ({ patient }: { patient: Patient }) => {
  const [formData, setFormData] = useState(patient);
  const [edited, setEdited] = useState(false);
  const storedRoles = localStorage.getItem("privilege_ids");
  const hasDeletePrivilege = storedRoles && JSON.parse(storedRoles).includes(4);
  const hasModifyPrivilege = storedRoles && JSON.parse(storedRoles).includes(3);
  const [editMode, setEditMode] = useState<Record<keyof Patient, boolean>>({
    fullName: false,
    address: false,
    gender: false,
    dateOfBirth: false,
    phone: false,
    email: false,
    id: false,
    createdAt: false,
    updatedAt: false
  });

  useEffect(() => {
    const isEdited =
      JSON.stringify({
        fullName: formData.fullName,
        address: formData.address,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        phone: formData.phone,
        email: formData.email
      }) !==
      JSON.stringify({
        fullName: patient.fullName,
        address: patient.address,
        gender: patient.gender,
        dateOfBirth: patient.dateOfBirth,
        phone: patient.phone,
        email: patient.email
      });


    setEdited(isEdited);
  }, [formData, patient]);

  const handleFieldChange = (field: keyof Patient, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEdit = (field: keyof Patient) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    try {
      
      const res = await fetch(`http://localhost:8081/patient/patients/${patient.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          fullName: formData.fullName,
          address: formData.address,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          phone: formData.phone,
          email: formData.email
        })
      });

      if (!res.ok) throw new Error("Update failed");
      alert("Saved successfully!");
      setEdited(false);
      setEditMode({
         fullName: false,
        address: false,
        gender: false,
        dateOfBirth: false,
        phone: false,
        email: false,
        id: false,
        createdAt: false,
        updatedAt: false
      });
    } catch (err) {
      console.error(err);
      window.location.reload();
      // alert("Failed to save.");
    }
  };

  const handleDelete = async () => {
  const confirmed = confirm("Are you sure you want to delete this patient?");
  if (!confirmed) return;

  try {
    const testOrderRes = await fetch(`http://localhost:8082/testorder/testorder/filter?searchText=${patient.email}`, {
      method: "GET",
      credentials: 'include'
    });

    if (!testOrderRes.ok) {
      throw new Error("Failed to check test orders");
    }

    const testOrderData = await testOrderRes.json();
    
    // Check if any test orders exist (adjust this condition based on your API response structure)
    const hasTestOrders = testOrderData && 
                         ((Array.isArray(testOrderData) && testOrderData.length > 0) ||
                          (testOrderData.content && testOrderData.content.length > 0) ||
                          (testOrderData.totalElements && testOrderData.totalElements > 0));

    if (hasTestOrders) {
      alert("Cannot delete patient. This patient has existing test orders. Please remove all test orders first.");
      return;
    }

    const res = await fetch(`http://localhost:8081/patient/patients/${patient.id}`, {
      method: "DELETE",
      credentials: 'include'
    });

    if (!res.ok) throw new Error("Failed to delete");
    alert("Patient deleted successfully.");
    window.location.href = "/patients"; // 👈 Redirect to list page or home
  } catch (err) {
    console.error(err);
    alert("Failed to delete patient.");
  }
};

// const patientdata = fetch(`http://localhost:8082/testorder/testorder/filter?searchText=${patient.email}`, {
//       method: "GET",
//       credentials: 'include'
//     });


const renderField = (
  label: string,
  field: keyof Patient,
  isDate?: boolean,
  isSelect?: boolean
) => {
  const isEditable =
    field !== "id" && field !== "createdAt" && field !== "updatedAt";

  return (
    <div className="flex flex-col text-sm text-gray-700 relative group">
      <label className="text-xs text-gray-500 mb-1">{label}</label>
      <div className="flex items-center justify-between">
        {editMode[field] ? (
          isSelect ? (
            <select
              value={formData[field]}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none w-full"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          ) : (
            <input
              type={isDate ? "date" : "text"}
              value={formData[field] as string}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none w-full"
            />
          )
        ) : (
          <p>{formData[field]}</p>
        )}

        {hasModifyPrivilege && isEditable && !editMode[field] && (
          <button
            type="button"
            onClick={() => toggleEdit(field)}
            className="ml-2"
          >
            <PencilIcon className="h-4 w-4 text-gray-500 hover:text-blue-600" />
          </button>
        )}
      </div>
    </div>
  );
};


  return (
    <div className="bg-white p-6 rounded-xl shadow-md relative space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Patient Information</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {renderField("Patient ID", "id")}
        {renderField("Updated At", "updatedAt")}
        {renderField("Full Name", "fullName")}
        {renderField("Address", "address")}
        {renderField("Gender", "gender", false, true)}
        {renderField("Date of Birth", "dateOfBirth", true)}
        {renderField("Phone", "phone")}
        {renderField("Email", "email")}
        {renderField("Created At", "createdAt")}
      </div>

      {/* {edited && (
        <div className="text-right pt-4">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white font-medium px-5 py-2 rounded-full shadow hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      )} */}

      <div className="flex justify-between pt-4">
        {hasDeletePrivilege && (<button
          onClick={handleDelete}
          className="inline-flex items-center space-x-2 bg-red-500 text-white font-medium px-5 py-2 rounded-full shadow hover:bg-red-600 transition"
        >
          <TrashIcon className="h-5 w-5" / >
          Delete Patient
        </button>
        )}

        {/* <LogoutButton></LogoutButton> */}

        {hasModifyPrivilege && edited && (
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white font-medium px-5 py-2 rounded-full shadow hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        )}
      </div>

    </div>
  );
};
