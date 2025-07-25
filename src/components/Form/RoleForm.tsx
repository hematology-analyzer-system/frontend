// // src/components/Form/RoleForm.tsx
// "use client";

// import React, { useState, useEffect } from 'react';
// import { RoleResponseDTO, PrivilegeResponseDTO } from '@/type/user';
// import FormField from './FormField';
// import { XMarkIcon } from '@heroicons/react/24/outline';

// interface RoleFormProps {
//   role: RoleResponseDTO | null; // Null for create, object for edit
//   allPrivileges: PrivilegeResponseDTO[]; // All available privileges
//   onSave: (role: RoleResponseDTO) => void;
//   onClose: () => void;
// }

// const RoleForm: React.FC<RoleFormProps> = ({ role, allPrivileges, onSave, onClose }) => {
//   const [formData, setFormData] = useState<RoleResponseDTO>(
//     role || {
//       roleId: 0, // Temp ID for new role, will be ignored by backend
//       name: '',
//       description: '',
//       code: '',
//       privileges: [],
//     }
//   );

//   useEffect(() => {
//     if (role) {
//       setFormData(role);
//     } else {
//       setFormData({
//         roleId: 0,
//         name: '',
//         description: '',
//         code: '',
//         privileges: [],
//       });
//     }
//   }, [role]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handlePrivilegeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedOptions = Array.from(e.target.selectedOptions);
//     const selectedPrivilegeIds = selectedOptions.map(option => parseInt(option.value));

//     const selectedPrivilegeObjects = allPrivileges.filter(p =>
//       selectedPrivilegeIds.includes(p.privilegeId)
//     );

//     setFormData((prev) => ({
//       ...prev,
//       privileges: selectedPrivilegeObjects,
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSave(formData);
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
//         <div className="flex justify-between items-center p-6 border-b">
//           <h2 className="text-2xl font-bold text-gray-900">{role ? 'Edit Role' : 'Create New Role'}</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <XMarkIcon className="h-6 w-6" />
//           </button>
//         </div>
//         <form onSubmit={handleSubmit} className="p-6">
//           <div className="grid grid-cols-1 gap-y-6">
//             <FormField
//               label="Role Name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="e.g., ADMIN, USER"
//               // required
//             />
//             <FormField
//               label="Role Code"
//               name="code"
//               value={formData.code}
//               onChange={handleChange}
//               placeholder="e.g., ROLE_ADMIN, ROLE_USER"
//               // required
//             />
//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 rows={3}
//                 className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="A brief description of the role"
//               ></textarea>
//             </div>

//             {/* Privileges Multi-Select */}
//             <div>
//               <label htmlFor="privileges" className="block text-sm font-medium text-gray-700 mb-1">
//                 Assign Privileges
//               </label>
//               <select
//                 id="privileges"
//                 name="privileges"
//                 multiple
//                 value={formData.privileges.map(p => p.privilegeId.toString())}
//                 onChange={handlePrivilegeChange}
//                 className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 size={Math.min(allPrivileges.length, 10)}
//               >
//                 {allPrivileges.length === 0 && (
//                     <option disabled>No privileges available</option>
//                 )}
//                 {allPrivileges.map((privilege) => (
//                   <option key={privilege.privilegeId} value={privilege.privilegeId}>
//                     {privilege.code} - {privilege.description}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="mt-8 pt-4 border-t flex justify-end space-x-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//             >
//               {role ? 'Update Role' : 'Create Role'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RoleForm;












"use client";

import React, { useState, useEffect } from "react";
import { RoleResponseDTO, PrivilegeResponseDTO } from "@/type/user";
import FormField from "./FormField";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface RoleFormProps {
  role: RoleResponseDTO | null;
  allPrivileges: PrivilegeResponseDTO[];
  onSave: (role: RoleResponseDTO) => void;
  onClose: () => void;
}

interface GroupedPrivileges {
  [key: string]: PrivilegeResponseDTO[];
}

const groupPrivileges = (privileges: PrivilegeResponseDTO[]): GroupedPrivileges => {
  const grouped: GroupedPrivileges = {};

  privileges.forEach((priv) => {
    let group = "Default Privilege";

    if (priv.code.includes("_USER")) group = "User Management";
    else if (priv.code.includes("_ROLE")) group = "Role Management";
    else if (priv.code.includes("_TEST_ORDER")) group = "Test Orders";
    else if (priv.code.includes("_COMMENT")) group = "Comments";

    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(priv);
  });

  const orderedGroups = [
    "User Management",
    "Role Management",
    "Test Orders",
    "Comments",
    "Default Privilege",
  ];

  const sortedGrouped: GroupedPrivileges = {};
  orderedGroups.forEach((g) => {
    if (grouped[g]) {
      grouped[g].sort((a, b) => a.code.localeCompare(b.code));
      sortedGrouped[g] = grouped[g];
    }
  });

  Object.entries(grouped).forEach(([g, list]) => {
    if (!sortedGrouped[g]) {
      sortedGrouped[g] = list.sort((a, b) => a.code.localeCompare(b.code));
    }
  });

  return sortedGrouped;
};

const RoleForm: React.FC<RoleFormProps> = ({ role, allPrivileges, onSave, onClose }) => {
  const [formData, setFormData] = useState<RoleResponseDTO>(
    role || {
      roleId: 0,
      name: "",
      description: "",
      code: "",
      privileges: [],
    }
  );

  useEffect(() => {
    if (role) {
      setFormData({ ...role, privileges: role.privileges || [] });
    }
  }, [role]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrivilegeCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const id = parseInt(value, 10);
    const selected = allPrivileges.find((p) => p.privilegeId === id);
    if (!selected) return;

    setFormData((prev) => {
      const currentIds = new Set(prev.privileges.map((p) => p.privilegeId));
      if (checked) currentIds.add(id);
      else currentIds.delete(id);

      const autoMap: { [key: string]: string } = {
        UPDATE_USER: "VIEW_USER",
        DELETE_USER: "VIEW_USER",
        UPDATE_ROLE: "VIEW_ROLE",
        DELETE_ROLE: "VIEW_ROLE",
        UPDATE_TEST_ORDER: "VIEW_TEST_ORDER",
        DELETE_TEST_ORDER: "VIEW_TEST_ORDER",
        UPDATE_COMMENT: "VIEW_COMMENT",
        DELETE_COMMENT: "VIEW_COMMENT",
      };

      const auto = autoMap[selected.code];
      if (auto && checked) {
        const view = allPrivileges.find((p) => p.code === auto);
        if (view) currentIds.add(view.privilegeId);
      }

      const updatedPrivileges = allPrivileges.filter((p) =>
        currentIds.has(p.privilegeId)
      );

      return { ...prev, privileges: updatedPrivileges };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const groupedPrivileges = groupPrivileges(allPrivileges);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left */}
        <div className="p-8 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {role ? "Edit Role" : "Create Role"}
            </h2>
            <button onClick={onClose}>
              <XMarkIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Role Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Admin, Supervisor, etc."
            />

            <FormField
              label="Role Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g. ADMIN001"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                placeholder="Briefly describe this role"
              />
            </div>

            <p className="text-yellow-600 text-sm font-medium mt-2">
              Don't forget to configure privileges for this role.
              If not, only READ access will be assigned.
            </p>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-2 px-4 rounded-full shadow-md hover:from-blue-500 hover:to-blue-600 transition"
              >
                {role ? "Update Role" : "Create Role"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-400 text-gray-700 font-medium py-2 px-4 rounded-full hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Right */}
        <div className="p-8 bg-gray-50 border-l overflow-y-auto max-h-[90vh]">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Assign Privileges
          </h2>
          <div className="space-y-6">
            {Object.entries(groupedPrivileges).map(([group, list]) => (
              <div key={group} className="border border-gray-200 bg-white rounded-xl shadow p-4">
                <h3 className="text-center text-sm font-semibold text-white bg-blue-600 rounded-full px-3 py-1 mb-3 uppercase tracking-wide">
                  {group}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {list.map((priv) => (
                    <label key={priv.privilegeId} className="flex items-center text-sm gap-2">
                      <input
                        type="checkbox"
                        value={priv.privilegeId}
                        checked={formData.privileges.some(
                          (p) => p.privilegeId === priv.privilegeId
                        )}
                        onChange={handlePrivilegeCheckboxChange}
                        className="accent-blue-600 h-4 w-4 rounded"
                      />
                      <span className="text-gray-700">{priv.description}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleForm;
