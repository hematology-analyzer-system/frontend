// components/users/UserDetailsPage.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { UserResponseDTO, RoleResponseDTO } from '@/type/user'; // Import RoleResponseDTO
import FormField from '@/components/Form/FormField';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  UserIcon,
  ShieldCheckIcon, // Assuming this is for status or general user
  ClockIcon, // For timestamps
  CalendarDaysIcon, // For date of birth
  TagIcon // For roles/privileges
} from '@heroicons/react/24/outline'; // Adjust icons as needed

interface UserDetailsPageProps {
  user: UserResponseDTO;
  onSave: (updatedUser: UserResponseDTO) => void;
  onCancel: () => void;
}

const UserDetailsPage: React.FC<UserDetailsPageProps> = ({ user, onSave, onCancel }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserResponseDTO>(user);
  const [allRoles, setAllRoles] = useState<RoleResponseDTO[]>([]); // State to store all roles for dropdown
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState<string | null>(null);

  // Effect to reset form data and edit mode when a different user prop is received
  useEffect(() => {
    setFormData(user);
    setIsEditing(false); // Reset edit mode when user changes
  }, [user]);

  // Fetch all roles when the component mounts
  useEffect(() => {
    const fetchAllRoles = async () => {
      setRolesLoading(true);
      setRolesError(null);
      try {
        const res = await fetch(`http://localhost:8080/iam/roles`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch roles');
        }

        const data: RoleResponseDTO[] = await res.json();
        setAllRoles(data);
      } catch (err) {
        console.error("Error fetching roles:", err);
        setRolesError(err instanceof Error ? err.message : 'An unknown error occurred while fetching roles.');
      } finally {
        setRolesLoading(false);
      }
    };

    fetchAllRoles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "roles") {
      const selectedOptions = Array.from((e.target as HTMLSelectElement).selectedOptions);
      const selectedRoleNames = selectedOptions.map(option => option.value);

      // Map selected role names back to RoleResponseDTO objects
      const selectedRoleObjects = allRoles.filter(role => selectedRoleNames.includes(role.name));

      setFormData((prev) => ({
        ...prev,
        roles: selectedRoleObjects, // Update roles with the selected RoleResponseDTOs
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  const handleSave = () => {
    // Before saving, you might need to adjust formData.roles based on your backend's expectation for PUT/PATCH.
    // If your backend expects only role IDs or role names, you'll need to map `formData.roles`
    // For example, to send only role IDs:
    // const rolesForBackend = formData.roles.map(role => ({ roleId: role.roleId }));
    // onSave({ ...formData, roles: rolesForBackend });
    // Or if it expects just an array of names:
    // const roleNamesForBackend = formData.roles.map(role => role.name);
    // onSave({ ...formData, roles: roleNamesForBackend }); // This would require UserResponseDTO.roles to be string[] again

    // Assuming your backend's PUT/PATCH endpoint for User can handle a list of RoleResponseDTO objects
    // or at least objects with `roleId` and `name` for identification.
    // If not, simplify `formData.roles` before passing to `onSave`.
    onSave(formData);
  };

  const handleCancel = () => {
    setFormData(user); // Revert to original user data
    setIsEditing(false);
    onCancel(); // Call parent's cancel handler
  };

  const DisplayField: React.FC<{
    label: string;
    value?: string | null;
    icon: React.ElementType;
  }> = ({ label, value, icon: Icon }) => (
    <div className="mb-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center border border-gray-200 bg-gray-50 rounded-md py-2 px-3 text-gray-700 text-sm">
        <Icon className="h-5 w-5 mr-2 text-gray-500" />
        <p>{value || 'N/A'}</p>
      </div>
    </div>
  );

  // Derive all unique privilege codes from the user's assigned roles
  const userPrivilegeCodes = formData.roles
    .flatMap(role => role.privileges.map(p => p.code)) // Get all privilege codes from all assigned roles
    .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
    .join(', ');

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">User details</h2>
        <p className="mt-1 text-sm text-gray-600">Update your personal details and photo here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
        <FormField
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          type="text"
          placeholder="Enter full name"
          readOnly={!isEditing}
          className={!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}
        />

        <FormField
          label="Email address"
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          placeholder="Enter email address"
          disabled={true}
          className="bg-gray-100 cursor-not-allowed"
        />

        <FormField
          label="Phone number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          type="tel"
          placeholder="Enter phone number"
          readOnly={!isEditing}
          className={!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}
        />

        <FormField
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          type="text"
          placeholder="Enter gender"
          readOnly={!isEditing}
          className={!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}
        />

        <FormField
          label="Date of Birth"
          name="date_of_Birth"
          value={formData.date_of_Birth || ''}
          onChange={handleChange}
          type="date"
          placeholder="YYYY-MM-DD"
          readOnly={!isEditing}
          className={!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}
        />

        <FormField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          type="text"
          placeholder="Enter address"
          readOnly={!isEditing}
          className={!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}
        />

        <FormField
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          type="text"
          placeholder="Enter status (e.g., ACTIVE, INACTIVE)"
          readOnly={!isEditing}
          className={!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}
        />

        {/* Roles Select Input */}
        <div>
          <label htmlFor="roles" className="block text-sm font-medium text-gray-700">
            Roles
          </label>
          {rolesLoading ? (
            <div className="mt-1 px-4 py-2 text-gray-500">Loading roles...</div>
          ) : rolesError ? (
            <div className="mt-1 px-4 py-2 text-red-500">Error loading roles: {rolesError}</div>
          ) : (
            <select
              id="roles"
              name="roles"
              multiple
              // Map currently assigned roles by their 'name' property for the select value
              value={formData.roles.map(role => role.name)}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              size={Math.min(allRoles.length, 5)}
            >
              {allRoles.map((role) => (
                <option key={role.roleId} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Privileges Display (Read-only, derived from selected roles) */}
        <DisplayField
          label="Privileges"
          value={userPrivilegeCodes || 'N/A'}
          icon={TagIcon}
        />

        {/* Photo Upload Section */}
        <div className="md:col-span-2 flex items-center mt-4">
          <div className="w-24 h-24 rounded-full overflow-hidden mr-4 border-4 border-blue-100 flex-shrink-0">
            <img
              src={formData.profileImageUrl || `https://placehold.co/96x96/ADD8E6/000000?text=${formData.fullName.charAt(0)}`}
              alt={formData.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-md font-medium text-gray-800">Select your photo, up to 5mb.</p>
            <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              Upload
            </button>
          </div>
        </div>
      </div>

      {/* Save/Cancel Buttons */}
      {isEditing && (
        <div className="flex justify-end space-x-4 mt-8 pt-4 border-t">
          <button
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}
      {!isEditing && (
        <div className="flex justify-end space-x-4 mt-8 pt-4 border-t">
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      )}

      {/* Timestamps (create_at, update_at) */}
      <div className="mt-10 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Timestamps</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <DisplayField
            label="Created At"
            value={formData.create_at ? new Date(formData.create_at).toLocaleString() : 'N/A'}
            icon={ClockIcon}
          />
          <DisplayField
            label="Last Updated At"
            value={formData.update_at ? new Date(formData.update_at).toLocaleString() : 'N/A'}
            icon={ClockIcon}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;