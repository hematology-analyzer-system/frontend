"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { UserResponseDTO, RoleResponseDTO, PrivilegeResponseDTO } from '@/type/user';
import FormField from '@/components/Form/FormField';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, UserIcon, ShieldCheckIcon, ClockIcon, CalendarDaysIcon, TagIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface UserDetailsPageProps {
  user: UserResponseDTO;
  onSave: (updatedUser: UserResponseDTO) => void;
  onCancel: () => void;
  onUpdateStatus: (isLock: boolean) => void;
}

const UserDetailsPage: React.FC<UserDetailsPageProps> = ({ user, onSave, onCancel, onUpdateStatus }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserResponseDTO>(() => ({
    ...user,
    roleIds: user.roleIds ?? [],
  }));
  const [allRoles, setAllRoles] = useState<RoleResponseDTO[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState<string | null>(null);
  const [allPrivileges, setAllPrivileges] = useState<PrivilegeResponseDTO[]>([]);

  // States for conditional rendering based on privileges
  const [canEditProfile, setCanEditProfile] = useState(false);
  const [canUpdateStatus, setCanUpdateStatus] = useState(false);

  // State for the local message
  const [roleMessage, setRoleMessage] = useState<string | null>(null);

  // Effect to load privileges from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const privilegesString = localStorage.getItem('privilege_ids');
        if (privilegesString) {
          const privilegeIds: number[] = JSON.parse(privilegesString);
          setCanEditProfile(privilegeIds.includes(15));
          setCanUpdateStatus(privilegeIds.includes(17));
        }
      } catch (error) {
        console.error("Failed to parse privilege_ids from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    setFormData({
      ...user,
      roleIds: user.roleIds ?? [],
    });
    setIsEditing(false);
    setRoleMessage(null);
  }, [user]);

  useEffect(() => {
    const fetchAllRoles = async () => {
      setRolesLoading(true);
      setRolesError(null);
      try {
        const res = await fetch('https://fhard.khoa.email/api/iam/roles', {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch roles');
        }
        const data: RoleResponseDTO[] = await res.json();
        setAllRoles(data);

        const uniquePrivileges = new Map<number, PrivilegeResponseDTO>();
        data.forEach(role => {
          role.privileges?.forEach(priv => {
            if (!uniquePrivileges.has(priv.privilegeId)) {
              uniquePrivileges.set(priv.privilegeId, priv);
            }
          });
        });
        setAllPrivileges(Array.from(uniquePrivileges.values()));

      } catch (err) {
        console.error("Error fetching all roles:", err);
        setRolesError(err instanceof Error ? err.message : 'An unknown error occurred while fetching all roles.');
      } finally {
        setRolesLoading(false);
      }
    };
    fetchAllRoles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (name === "roles") {
      const roleId = parseInt(value, 10);
      setFormData(prev => {
        const currentRoleIds = new Set(prev.roleIds);
        if (checked) {
          currentRoleIds.add(roleId);
        } else {
          if (roleId === 6 && currentRoleIds.size === 1 && currentRoleIds.has(6)) {
            setRoleMessage("A user must have at least the 'User' role.");
            return prev;
          }
          currentRoleIds.delete(roleId);
        }

        if (currentRoleIds.size === 0) {
          currentRoleIds.add(6);
        }
        setRoleMessage(null); // Clear message on successful change

        return {
          ...prev,
          roleIds: Array.from(currentRoleIds),
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = () => {
    const payload: Partial<UserResponseDTO> = {
      id: formData.id,
      fullName: formData.fullName,
      date_of_Birth: formData.date_of_Birth,
      email: formData.email,
      address: formData.address,
      gender: formData.gender,
      phone: formData.phone,
      identifyNum: formData.identifyNum,
      roleIds: formData.roleIds,
    };
    onSave(payload as UserResponseDTO);
  };

  const handleCancel = () => {
    setFormData({
      ...user,
      roleIds: user.roleIds ?? [],
    });
    setIsEditing(false);
    onCancel();
  };

  const DisplayField: React.FC<{ label: string; value?: string | null; icon: React.ElementType; className?: string; }> = ({ label, value, icon: Icon, className }) => (
    <div className={`mb-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center border border-gray-200 bg-gray-50 rounded-md py-2 px-3 text-gray-700 text-sm">
        <Icon className="h-5 w-5 mr-2 text-gray-500" />
        <p>{value || 'N/A'}</p>
      </div>
    </div>
  );

  const displayedRoleNames = (user.roleIds ?? [])
    .map(id => allRoles.find(role => role.roleId === id)?.name)
    .filter(name => name !== undefined)
    .join(', ') || 'N/A';

  const userPrivilegeCodes = Array.from(
    new Set(
      (formData.roleIds ?? [])
        .flatMap(roleId => {
          const role = allRoles.find(r => r.roleId === roleId);
          return role?.privileges?.map(p => p.code) ?? [];
        })
    )
  ).join(', ') || 'N/A';

  const formatTimestamp = (isoString?: string | null) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
      };
      return date.toLocaleString('en-GB', options);
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Invalid Date';
    }
  };

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
        {isEditing ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Select Gender</option>
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
            </select>
          </div>
        ) : (
          <DisplayField
            label="Gender"
            value={formData.gender}
            icon={UserIcon}
        />
        )}
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
        
        <DisplayField
          label="Status"
          value={user.status}
          icon={CheckCircleIcon}
        />

        <FormField
          label="Identify Number"
          name="identifyNum"
          value={formData.identifyNum}
          onChange={handleChange}
          type="text"
          placeholder="Enter identify Number"
          readOnly={!isEditing}
          className={!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}
        />

        {isEditing ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1"> Roles </label>
            {roleMessage && (
                <div className="text-red-500 text-sm my-2">{roleMessage}</div>
            )}
            {rolesLoading ? (
              <div className="mt-1 px-4 py-2 text-gray-500">Loading roles...</div>
            ) : rolesError ? (
              <div className="mt-1 px-4 py-2 text-red-500">Error loading roles: {rolesError}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 p-2 border border-gray-300 rounded-xl shadow-sm">
                {allRoles.map((role) => (
                  <div key={role.roleId} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`role-${role.roleId}`}
                      name="roles"
                      value={role.roleId.toString()}
                      checked={formData.roleIds?.includes(role.roleId) || false}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`role-${role.roleId}`} className="ml-2 text-sm text-gray-900 cursor-pointer">
                      {role.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <DisplayField
            label="Roles"
            value={rolesLoading ? "Loading roles..." : rolesError ? `Error: ${rolesError}` : displayedRoleNames}
            icon={TagIcon}
          />
        )}

        <DisplayField
          label="Privileges"
          value={userPrivilegeCodes}
          icon={TagIcon}
          className="md:col-span-2"
        />

        <div className="md:col-span-2 flex items-center mt-4">
          <div className="w-24 h-24 rounded-full overflow-hidden mr-4 border-4 border-blue-100 flex-shrink-0">
            <img
              src={
                formData.profileImageUrl ||
                `https://placehold.co/96x96/ADD8E6/000000?text=${formData.fullName?.charAt(0) ?? 'U'}`
              }
              alt={formData.fullName ?? 'User'}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <p className="text-md font-medium text-gray-800 mb-2">Profile photo (max 5MB)</p>

            {formData.profileImageUrl ? (
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    profileImageUrl: "",
                  }));
                }}
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                Change Picture
              </button>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const formDataObj = new FormData();
                  formDataObj.append("file", file);

                  try {
                    const res = await fetch("https://fhard.khoa.email/api/iam/users/upload", {
                      method: "POST",
                      body: formDataObj,
                      credentials: "include",
                    });

                    if (!res.ok) {
                      const error = await res.text();
                      throw new Error(error || "Upload failed");
                    }

                    const data = await res.json();
                    const uploadedUrl = data.url;

                    setFormData((prev) => ({
                      ...prev,
                      profileImageUrl: uploadedUrl,
                    }));
                  } catch (error) {
                    console.error("Upload error:", error);
                    // Use a local state for this message instead of alert
                  }
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                           file:rounded-md file:border-0 file:text-sm file:font-semibold
                           file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            )}
          </div>
        </div>
      </div>

      {isEditing && canEditProfile && (
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
      {!isEditing && canEditProfile && (
        <div className="flex justify-end space-x-4 mt-8 pt-4 border-t">
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      )}

      {/* New section for status change - conditionally rendered */}
      {canUpdateStatus && (
        <div className="mt-8 pt-4 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Account Status</h3>
          <div className="flex justify-end">
            {user.status === 'ACTIVE' ? (
              <button
                onClick={() => onUpdateStatus(false)}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Lock User
              </button>
            ) : (
              <button
                onClick={() => onUpdateStatus(true)}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Unlock User
              </button>
            )}
          </div>
        </div>
      )}

      <div className="mt-10 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Timestamps</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <DisplayField label="Last Updated At" value={formatTimestamp(user.updateAt)} icon={ClockIcon} />
          <DisplayField label="Updated By" value={user.updated_by_email} icon={UserIcon} />
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;