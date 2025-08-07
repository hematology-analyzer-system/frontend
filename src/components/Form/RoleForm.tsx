// "use client";

// import React, { useState, useEffect } from "react";
// import { RoleResponseDTO, PrivilegeResponseDTO } from "@/type/user";
// import FormField from "./FormField";
// import { XMarkIcon } from "@heroicons/react/24/outline";

// interface RoleFormProps {
//   role: RoleResponseDTO | null;
//   allPrivileges: PrivilegeResponseDTO[];
//   onSave: (role: RoleResponseDTO) => void;
//   onClose: () => void;
// }

// interface GroupedPrivileges {
//   [key: string]: PrivilegeResponseDTO[];
// }

// const groupPrivileges = (privileges: PrivilegeResponseDTO[]): GroupedPrivileges => {
//   const grouped: GroupedPrivileges = {};

//   privileges.forEach((priv) => {
//     let group = "Default Privilege";

//     if (priv.code.includes("_USER")) group = "User Management";
//     else if (priv.code.includes("_ROLE")) group = "Role Management";
//     else if (priv.code.includes("_TEST_ORDER")) group = "Test Orders";
//     else if (priv.code.includes("_COMMENT")) group = "Comments";

//     if (!grouped[group]) grouped[group] = [];
//     grouped[group].push(priv);
//   });

//   const orderedGroups = [
//     "User Management",
//     "Role Management",
//     "Test Orders",
//     "Comments",
//     "Default Privilege",
//   ];

//   const sortedGrouped: GroupedPrivileges = {};
//   orderedGroups.forEach((g) => {
//     if (grouped[g]) {
//       grouped[g].sort((a, b) => a.code.localeCompare(b.code));
//       sortedGrouped[g] = grouped[g];
//     }
//   });

//   Object.entries(grouped).forEach(([g, list]) => {
//     if (!sortedGrouped[g]) {
//       sortedGrouped[g] = list.sort((a, b) => a.code.localeCompare(b.code));
//     }
//   });

//   return sortedGrouped;
// };

// const RoleForm: React.FC<RoleFormProps> = ({ role, allPrivileges, onSave, onClose }) => {
//   const [formData, setFormData] = useState<RoleResponseDTO>(
//     role || {
//       roleId: 0,
//       name: "",
//       description: "",
//       code: "",
//       privileges: [],
//     }
//   );

//   useEffect(() => {
//     if (role) {
//       setFormData({ ...role, privileges: role.privileges || [] });
//     }
//   }, [role]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePrivilegeCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value, checked } = e.target;
//     const id = parseInt(value, 10);
//     const selected = allPrivileges.find((p) => p.privilegeId === id);
//     if (!selected) return;

//     setFormData((prev) => {
//       const currentIds = new Set(prev.privileges.map((p) => p.privilegeId));
//       if (checked) currentIds.add(id);
//       else currentIds.delete(id);

//       const autoMap: { [key: string]: string } = {
//         UPDATE_USER: "VIEW_USER",
//         DELETE_USER: "VIEW_USER",
//         UPDATE_ROLE: "VIEW_ROLE",
//         DELETE_ROLE: "VIEW_ROLE",
//         UPDATE_TEST_ORDER: "VIEW_TEST_ORDER",
//         DELETE_TEST_ORDER: "VIEW_TEST_ORDER",
//         UPDATE_COMMENT: "VIEW_COMMENT",
//         DELETE_COMMENT: "VIEW_COMMENT",
//       };

//       const auto = autoMap[selected.code];
//       if (auto && checked) {
//         const view = allPrivileges.find((p) => p.code === auto);
//         if (view) currentIds.add(view.privilegeId);
//       }

//       const updatedPrivileges = allPrivileges.filter((p) =>
//         currentIds.has(p.privilegeId)
//       );

//       return { ...prev, privileges: updatedPrivileges };
//     });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSave(formData);
//   };

//   const groupedPrivileges = groupPrivileges(allPrivileges);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
//       <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
//         {/* Left */}
//         <div className="p-8 bg-white">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-bold text-gray-800">
//               {role ? "Edit Role" : "Create Role"}
//             </h2>
//             <button onClick={onClose}>
//               <XMarkIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <FormField
//               label="Role Name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Admin, Supervisor, etc."
//             />

//             <FormField
//               label="Role Code"
//               name="code"
//               value={formData.code}
//               onChange={handleChange}
//               placeholder="e.g. ADMIN001"
//             />

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Role Description
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 rows={4}
//                 className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
//                 placeholder="Briefly describe this role"
//               />
//             </div>

//             <p className="text-yellow-600 text-sm font-medium mt-2">
//               Don't forget to configure privileges for this role.
//               If not, only READ access will be assigned.
//             </p>

//             <div className="flex gap-4 pt-4">
//               <button
//                 type="submit"
//                 className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-2 px-4 rounded-full shadow-md hover:from-blue-500 hover:to-blue-600 transition"
//               >
//                 {role ? "Update Role" : "Create Role"}
//               </button>
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="flex-1 border border-gray-400 text-gray-700 font-medium py-2 px-4 rounded-full hover:bg-gray-50 transition"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Right */}
//         <div className="p-8 bg-gray-50 border-l overflow-y-auto max-h-[90vh]">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
//             Assign Privileges
//           </h2>
//           <div className="space-y-6">
//             {Object.entries(groupedPrivileges).map(([group, list]) => (
//               <div key={group} className="border border-gray-200 bg-white rounded-xl shadow p-4">
//                 <h3 className="text-center text-sm font-semibold text-white bg-blue-600 rounded-full px-3 py-1 mb-3 uppercase tracking-wide">
//                   {group}
//                 </h3>
//                 <div className="grid grid-cols-2 gap-2">
//                   {list.map((priv) => (
//                     <label key={priv.privilegeId} className="flex items-center text-sm gap-2">
//                       <input
//                         type="checkbox"
//                         value={priv.privilegeId}
//                         checked={formData.privileges.some(
//                           (p) => p.privilegeId === priv.privilegeId
//                         )}
//                         onChange={handlePrivilegeCheckboxChange}
//                         className="accent-blue-600 h-4 w-4 rounded"
//                       />
//                       <span className="text-gray-700">{priv.description}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
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

// ================================================================
// MODIFIED: 'onSave' and 'isReadOnly' have been added to the interface
// The 'onSave' prop is now optional using '?'
// ================================================================
interface RoleFormProps {
  role: RoleResponseDTO | null;
  allPrivileges: PrivilegeResponseDTO[];
  onSave?: (role: RoleResponseDTO) => void;
  onClose: () => void;
  isReadOnly: boolean;
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

// ================================================================
// MODIFIED: The component now accepts the 'isReadOnly' prop
// ================================================================
const RoleForm: React.FC<RoleFormProps> = ({ role, allPrivileges, onSave, onClose, isReadOnly }) => {
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
    if (isReadOnly) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrivilegeCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) return;
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
    if (onSave) {
      onSave(formData);
    }
  };

  const groupedPrivileges = groupPrivileges(allPrivileges);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left */}
        <div className="p-8 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isReadOnly ? "View Role" : (role ? "Edit Role" : "Create Role")}
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
              disabled={isReadOnly}
            />

            <FormField
              label="Role Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g. ADMIN001"
              disabled={isReadOnly}
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
                className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm disabled:bg-gray-200 disabled:text-gray-500"
                placeholder="Briefly describe this role"
                disabled={isReadOnly}
              />
            </div>

            {!isReadOnly && (
              <p className="text-yellow-600 text-sm font-medium mt-2">
                Don't forget to configure privileges for this role.
                If not, only READ access will be assigned.
              </p>
            )}

            {!isReadOnly && (
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r button text-white font-semibold py-2 px-4 rounded-full shadow-md transition"
                >
                  {role ? "Update Role" : "Create Role"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border outline-button font-medium py-2 px-4 rounded-full  transition"
                >
                  Cancel
                </button>
              </div>
            )}
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
                <h3 className="text-center text-sm font-semibold text-white bg-primary rounded-full px-3 py-1 mb-3 uppercase tracking-wide">
                  {group}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {list.map((priv) => (
                    <label key={priv.privilegeId} className="flex items-center text-sm gap-2 disabled:text-gray-400">
                      <input
                        type="checkbox"
                        value={priv.privilegeId}
                        checked={formData.privileges.some(
                          (p) => p.privilegeId === priv.privilegeId
                        )}
                        onChange={handlePrivilegeCheckboxChange}
                        className="accent-blue-600 h-4 w-4 rounded disabled:accent-gray-400"
                        disabled={isReadOnly}
                      />
                      <span className="text-gray-700 disabled:text-gray-400">{priv.description}</span>
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