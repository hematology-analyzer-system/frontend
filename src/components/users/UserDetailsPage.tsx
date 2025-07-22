// // components/users/UserDetailsPage.tsx
// "use client";

// import React, { useState, useEffect, useCallback } from 'react';
// import { UserResponseDTO, RoleResponseDTO } from '@/type/user'; // Import RoleResponseDTO
// import FormField from '@/components/Form/FormField';
// import {
//   EnvelopeIcon,
//   PhoneIcon,
//   MapPinIcon,
//   UserIcon,
//   ShieldCheckIcon, // Assuming this is for status or general user
//   ClockIcon, // For timestamps
//   CalendarDaysIcon, // For date of birth
//   TagIcon // For roles/privileges
// } from '@heroicons/react/24/outline'; // Adjust icons as needed

// interface UserDetailsPageProps {
//   user: UserResponseDTO;
//   onSave: (updatedUser: UserResponseDTO) => void;
//   onCancel: () => void;
// }

// const UserDetailsPage: React.FC<UserDetailsPageProps> = ({ user, onSave, onCancel }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   // const [formData, setFormData] = useState<UserResponseDTO>(user);
//   const [formData, setFormData] = useState<UserResponseDTO>({
//   ...user,
//   roles: user.roles ?? [],
//   roleId: user.roles?.[0]?.roleId,
// });

//   const [allRoles, setAllRoles] = useState<RoleResponseDTO[]>([]); // State to store all roles for dropdown
//   const [rolesLoading, setRolesLoading] = useState(true);
//   const [rolesError, setRolesError] = useState<string | null>(null);

//   useEffect(() => {
//   setFormData({
//     ...user,
//     roles: user.roles ?? [],
//     roleId: user.roles?.[0]?.roleId,
//   });
//   setIsEditing(false);
// }, [user]);

//   // Fetch all roles when the component mounts
//   useEffect(() => {
//     const fetchAllRoles = async () => {
//       setRolesLoading(true);
//       setRolesError(null);
//       try {
//         const res = await fetch(`http://localhost:8080/iam/roles`, {
//           method: 'GET',
//           credentials: 'include',
//         });

//         if (!res.ok) {
//           const errorData = await res.json();
//           throw new Error(errorData.message || 'Failed to fetch roles');
//         }

//         const data: RoleResponseDTO[] = await res.json();
//         setAllRoles(data);
//       } catch (err) {
//         console.error("Error fetching roles:", err);
//         setRolesError(err instanceof Error ? err.message : 'An unknown error occurred while fetching roles.');
//       } finally {
//         setRolesLoading(false);
//       }
//     };

//     fetchAllRoles();
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;

//     if (name === "roles") {
//         const selectedRoleName = value;

//         const selectedRole = allRoles.find(role => role.name === selectedRoleName);

//         setFormData((prev) => ({
//           ...prev,
//           roles: selectedRole ? [selectedRole] : [],
//           roleId: selectedRole?.roleId || undefined, // Set roleId directly
//         }));
//     }
//     else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };


//   const handleSave = () => {
//     onSave(formData);
//   };

//   const handleCancel = () => {
//     setFormData(user); // Revert to original user data
//     setIsEditing(false);
//     onCancel(); // Call parent's cancel handler
//   };

//   const DisplayField: React.FC<{
//     label: string;
//     value?: string | null;
//     icon: React.ElementType;
//   }> = ({ label, value, icon: Icon }) => (
//     <div className="mb-2">
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         {label}
//       </label>
//       <div className="flex items-center border border-gray-200 bg-gray-50 rounded-md py-2 px-3 text-gray-700 text-sm">
//         <Icon className="h-5 w-5 mr-2 text-gray-500" />
//         <p>{value || 'N/A'}</p>
//       </div>
//     </div>
//   );

//   const userPrivilegeCodes = (formData.roles ?? [])
//   .flatMap(role => role.privileges?.map(p => p.code) ?? [])
//   .filter((value, index, self) => self.indexOf(value) === index)
//   .join(', ');


//   return (
//     <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
//       <div className="mb-6 border-b pb-4">
//         <h2 className="text-2xl font-bold text-gray-900">User details</h2>
//         <p className="mt-1 text-sm text-gray-600">Update your personal details and photo here.</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
//         <FormField
//           label="Full Name"
//           name="fullName"
//           value={formData.fullName}
//           onChange={handleChange}
//           type="text"
//           placeholder="Enter full name"
//           readOnly={!isEditing}
//           className={!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}
//         />

//         <FormField
//           label="Email address"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           type="email"
//           placeholder="Enter email address"
//           disabled={true}
//           className="bg-gray-100 cursor-not-allowed"
//         />

//         <FormField
//           label="Phone number"
//           name="phone"
//           value={formData.phone}
//           onChange={handleChange}
//           type="tel"
//           placeholder="Enter phone number"
//           readOnly={!isEditing}
//           className={!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}
//         />

//         <FormField
//           label="Gender"
//           name="gender"
//           value={formData.gender}
//           onChange={handleChange}
//           type="text"
//           placeholder="Enter gender"
//           readOnly={!isEditing}
//           className={!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}
//         />

//         <FormField
//           label="Date of Birth"
//           name="date_of_Birth"
//           value={formData.date_of_Birth || ''}
//           onChange={handleChange}
//           type="date"
//           placeholder="YYYY-MM-DD"
//           readOnly={!isEditing}
//           className={!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}
//         />

//         <FormField
//           label="Address"
//           name="address"
//           value={formData.address}
//           onChange={handleChange}
//           type="text"
//           placeholder="Enter address"
//           readOnly={!isEditing}
//           className={!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}
//         />

//         <FormField
//           label="Status"
//           name="status"
//           value={formData.status}
//           onChange={handleChange}
//           type="text"
//           placeholder="Enter status (e.g., ACTIVE, INACTIVE)"
//           readOnly={!isEditing}
//           className={!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}
//         />

//         {/* Roles Select Input */}
//         <div>
//           <label htmlFor="roles" className="block text-sm font-medium text-gray-700">
//             Roles
//           </label>
//           {rolesLoading ? (
//             <div className="mt-1 px-4 py-2 text-gray-500">Loading roles...</div>
//           ) : rolesError ? (
//             <div className="mt-1 px-4 py-2 text-red-500">Error loading roles: {rolesError}</div>
//           ) : (
//             <select
//                 id="roles"
//                 name="roles"
//                 value={formData.roles[0]?.name || ''}
//                 onChange={handleChange}
//                 disabled={!isEditing}
//                 className={`w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
//                 }`}
//               >
//                 <option value="">Select a role</option>
//                 {allRoles.map((role) => (
//                   <option key={role.roleId} value={role.name}>
//                     {role.name}
//                   </option>
//                 ))}
//               </select>
//           )}
//         </div>

        

//         {/* Privileges Display (Read-only, derived from selected roles) */}
//         <DisplayField
//           label="Privileges"
//           value={userPrivilegeCodes || 'N/A'}
//           icon={TagIcon}
//         />

//         {/* Photo Upload Section */}
//         <div className="md:col-span-2 flex items-center mt-4">
//           <div className="w-24 h-24 rounded-full overflow-hidden mr-4 border-4 border-blue-100 flex-shrink-0">
//             <img
//               src={
//                 formData.profileImageUrl ||
//                 `https://placehold.co/96x96/ADD8E6/000000?text=${formData.fullName?.charAt(0) ?? 'U'}`
//               }
//               alt={formData.fullName ?? 'User'}
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <div>
//             <p className="text-md font-medium text-gray-800">Select your photo, up to 5mb.</p>
//             <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
//               Upload
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Save/Cancel Buttons */}
//       {isEditing && (
//         <div className="flex justify-end space-x-4 mt-8 pt-4 border-t">
//           <button
//             onClick={handleCancel}
//             className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//           >
//             Save Changes
//           </button>
//         </div>
//       )}
//       {!isEditing && (
//         <div className="flex justify-end space-x-4 mt-8 pt-4 border-t">
//           <button
//             onClick={() => setIsEditing(true)}
//             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//           >
//             Edit Profile
//           </button>
//         </div>
//       )}

//       {/* Timestamps (create_at, update_at) */}
//       <div className="mt-10 pt-8 border-t border-gray-200">
//         <h3 className="text-xl font-semibold text-gray-900 mb-4">Timestamps</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
//           <DisplayField
//             label="Created At"
//             value={formData.create_at ? new Date(formData.create_at).toLocaleString() : 'N/A'}
//             icon={ClockIcon}
//           />
//           <DisplayField
//             label="Last Updated At"
//             value={formData.update_at ? new Date(formData.update_at).toLocaleString() : 'N/A'}
//             icon={ClockIcon}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDetailsPage;

// components/users/UserDetailsPage.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { UserResponseDTO, RoleResponseDTO } from '@/type/user';
import FormField from '@/components/Form/FormField';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  UserIcon,
  ShieldCheckIcon,
  ClockIcon,
  CalendarDaysIcon,
  TagIcon,
  CheckCircleIcon // For checkbox
} from '@heroicons/react/24/outline';

interface UserDetailsPageProps {
  user: UserResponseDTO;
  onSave: (updatedUser: UserResponseDTO) => void;
  onCancel: () => void;
}

const UserDetailsPage: React.FC<UserDetailsPageProps> = ({ user, onSave, onCancel }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserResponseDTO>(() => ({
    ...user,
    roles: user.roles ?? [], // Ensure roles is always an array for local state management
  }));

  const [allRoles, setAllRoles] = useState<RoleResponseDTO[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState<string | null>(null);

  // New state for roles specifically for view mode, fetched from the dedicated endpoint
  const [viewModeRoles, setViewModeRoles] = useState<RoleResponseDTO[]>([]);
  const [viewModeRolesLoading, setViewModeRolesLoading] = useState(true);
  const [viewModeRolesError, setViewModeRolesError] = useState<string | null>(null);


  // Effect to reset formData when user prop changes (e.g., after save)
  useEffect(() => {
    setFormData({
      ...user,
      roles: user.roles ?? [],
    });
    // Do NOT set setIsEditing(false) here, as it conflicts with fetching viewModeRoles
    // We will set it explicitly when saving or cancelling.
  }, [user]);

  // Effect to fetch ALL roles (for edit mode checkboxes)
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
        console.error("Error fetching all roles:", err);
        setRolesError(err instanceof Error ? err.message : 'An unknown error occurred while fetching all roles.');
      } finally {
        setRolesLoading(false);
      }
    };

    fetchAllRoles();
  }, []);

  // Effect to fetch roles for VIEW MODE from the dedicated user roles API
  useEffect(() => {
    if (!isEditing && user.id) { // Only fetch if in view mode and user ID is available
      const fetchUserSpecificRoles = async () => {
        setViewModeRolesLoading(true);
        setViewModeRolesError(null);
        try {
          const res = await fetch(`http://localhost:8080/iam/users/${user.id}/roles`, {
            method: 'GET',
            credentials: 'include',
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || `Failed to fetch roles for user ${user.id}`);
          }

          const data: RoleResponseDTO[] = await res.json(); // Backend now returns UserRoleDTO which maps to RoleResponseDTO
          setViewModeRoles(data);
        } catch (err) {
          console.error("Error fetching user specific roles:", err);
          setViewModeRolesError(err instanceof Error ? err.message : 'An unknown error occurred while fetching user roles.');
        } finally {
          setViewModeRolesLoading(false);
        }
      };

      fetchUserSpecificRoles();
    }
  }, [isEditing, user.id]); // Re-fetch when entering view mode or user changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (name === "roles") { // For the role checkboxes
      const roleId = parseInt(value, 10);
      const selectedRole = allRoles.find(role => role.roleId === roleId);

      setFormData(prev => {
        const currentRoles = new Set(prev.roles.map(r => r.roleId));
        if (checked) {
          if (selectedRole) currentRoles.add(roleId);
        } else {
          // Prevent removing role with ID 6 if it's the only one left
          // and it's currently selected.
          if (roleId === 6 && currentRoles.size === 1 && currentRoles.has(6)) {
             alert("A user must have at least the 'User' role.");
             return prev; // Do not update state if trying to remove the last role 6
          }
          currentRoles.delete(roleId);
        }
        
        // Ensure role 6 is always present if no other roles are selected
        // This is a fail-safe for an edge case where all roles are unchecked.
        if (currentRoles.size === 0) {
            currentRoles.add(6);
        }

        const newRoles = allRoles.filter(role => currentRoles.has(role.roleId));
        return {
          ...prev,
          roles: newRoles,
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
      dateOfBirth: formData.dateOfBirth, // Corrected: Use date_of_Birth
      email: formData.email,
      address: formData.address,
      gender: formData.gender,
      phone: formData.phone,
      status: formData.status,
      roles: formData.roles, // Pass the roles array from formData
    };
    onSave(payload as UserResponseDTO);
    setIsEditing(false); // Exit edit mode after saving
  };

  const handleCancel = () => {
    // Revert to the original user data from props
    setFormData({
      ...user,
      roles: user.roles ?? [],
    });
    setIsEditing(false); // Exit edit mode
    onCancel();
  };

  const DisplayField: React.FC<{
    label: string;
    value?: string | null;
    icon: React.ElementType;
    className?: string; // Add className prop
  }> = ({ label, value, icon: Icon, className }) => (
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
  
  // Determine which roles to display based on mode
  const currentDisplayedRoles = isEditing ? formData.roles : viewModeRoles;
  const displayedRoleNames = currentDisplayedRoles.map(role => role.name).join(', ') || 'N/A';

  const userPrivilegeCodes = (formData.roles ?? []) // Privileges are always based on formData (edit mode or last saved)
    .flatMap(role => role.privileges?.map(p => p.code) ?? [])
    .filter((value, index, self) => self.indexOf(value) === index)
    .join(', ');

  // Function to format timestamps
  const formatTimestamp = (isoString?: string | null) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23'
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
          name="dateOfBirth" // Use snake_case
          value={formData.dateOfBirth || ''} // Use snake_case
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

        {/* Conditional rendering for Role field */}
        {isEditing ? (
          // In Edit Mode, show the Checkbox group for roles
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Roles
            </label>
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
                      name="roles" // All checkboxes share the same name 'roles'
                      value={role.roleId.toString()}
                      checked={formData.roles?.some(r => r.roleId === role.roleId) || false}
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
          // In View Mode, show the DisplayField for all Roles from dedicated API
          <DisplayField
            label="Roles"
            value={viewModeRolesLoading ? "Loading roles..." : viewModeRolesError ? `Error: ${viewModeRolesError}` : displayedRoleNames}
            icon={TagIcon}
          />
        )}

        {/* Privileges Display (Read-only, derived from selected roles) */}
        <DisplayField
          label="Privileges"
          value={userPrivilegeCodes || 'N/A'}
          icon={TagIcon}
          className="md:col-span-2" // Span 2 columns for better layout
        />

        {/* Photo Upload Section */}
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
            value={formatTimestamp(user.createdAt)} // Use user.createdAt directly
            icon={ClockIcon}
          />
          <DisplayField
            label="Last Updated At"
            value={formatTimestamp(user.updateAt)} // Use user.update_at directly
            icon={ClockIcon}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;