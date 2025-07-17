// src/components/Form/RoleForm.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { RoleResponseDTO, PrivilegeResponseDTO } from '@/type/user';
import FormField from './FormField';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface RoleFormProps {
  role: RoleResponseDTO | null; // Null for create, object for edit
  allPrivileges: PrivilegeResponseDTO[]; // All available privileges
  onSave: (role: RoleResponseDTO) => void;
  onClose: () => void;
}

const RoleForm: React.FC<RoleFormProps> = ({ role, allPrivileges, onSave, onClose }) => {
  const [formData, setFormData] = useState<RoleResponseDTO>(
    role || {
      roleId: 0, // Temp ID for new role, will be ignored by backend
      name: '',
      description: '',
      code: '',
      privileges: [],
    }
  );

  useEffect(() => {
    if (role) {
      setFormData(role);
    } else {
      setFormData({
        roleId: 0,
        name: '',
        description: '',
        code: '',
        privileges: [],
      });
    }
  }, [role]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePrivilegeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedPrivilegeIds = selectedOptions.map(option => parseInt(option.value));

    const selectedPrivilegeObjects = allPrivileges.filter(p =>
      selectedPrivilegeIds.includes(p.privilegeId)
    );

    setFormData((prev) => ({
      ...prev,
      privileges: selectedPrivilegeObjects,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{role ? 'Edit Role' : 'Create New Role'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-y-6">
            <FormField
              label="Role Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., ADMIN, USER"
              // required
            />
            <FormField
              label="Role Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g., ROLE_ADMIN, ROLE_USER"
              // required
            />
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="A brief description of the role"
              ></textarea>
            </div>

            {/* Privileges Multi-Select */}
            <div>
              <label htmlFor="privileges" className="block text-sm font-medium text-gray-700 mb-1">
                Assign Privileges
              </label>
              <select
                id="privileges"
                name="privileges"
                multiple
                value={formData.privileges.map(p => p.privilegeId.toString())}
                onChange={handlePrivilegeChange}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                size={Math.min(allPrivileges.length, 10)}
              >
                {allPrivileges.length === 0 && (
                    <option disabled>No privileges available</option>
                )}
                {allPrivileges.map((privilege) => (
                  <option key={privilege.privilegeId} value={privilege.privilegeId}>
                    {privilege.code} - {privilege.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {role ? 'Update Role' : 'Create Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleForm;