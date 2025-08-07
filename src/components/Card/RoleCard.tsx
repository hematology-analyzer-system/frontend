// // src/components/Card/RoleCard.tsx
// "use client"; // Make sure this is a client component as it uses useRouter

// import React from 'react';
// import { RoleResponseDTO } from '@/type/user';
// import { PencilIcon, TrashIcon, TagIcon } from '@heroicons/react/24/outline';
// import { useRouter } from 'next/navigation'; // Import useRouter

// interface RoleCardProps {
//   role: RoleResponseDTO;
//   // onEdit: (role: RoleResponseDTO) => void; // This prop will no longer be needed for navigation
//   onDelete: (roleId: number) => void; // Keep for delete functionality
// }

// const RoleCard: React.FC<RoleCardProps> = ({ role, onDelete }) => {
//   const router = useRouter(); // Initialize useRouter inside the component

//   const handleEditClick = () => {
//     router.push(`/iam/roles/${role.roleId}`); // Navigate to the dynamic edit page
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
//       <div className="p-6">
//         <h3 className="text-xl font-semibold text-gray-900 mb-2">{role.name}</h3>
//         <p className="text-gray-600 text-sm mb-4">{role.description}</p>
//         <div className="flex items-center text-gray-700 text-sm mb-2">
//           <TagIcon className="h-4 w-4 mr-2 flex-shrink-0" />
//           <span className="font-medium">Code:</span> {role.code}
//         </div>
//         <div className="flex flex-wrap items-center text-gray-700 text-sm">
//           <TagIcon className="h-4 w-4 mr-2 flex-shrink-0" />
//           <span className="font-medium mr-1">Privileges:</span>
//           {role.privileges && role.privileges.length > 0 ? (
//             role.privileges.map(p => (
//               <span key={p.privilegeId} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mr-2 mb-1">
//                 {p.code}
//               </span>
//             ))
//           ) : (
//             <span className="text-gray-500 text-xs">No privileges assigned</span>
//           )}
//         </div>
//       </div>
//       <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
//         <button
//           onClick={handleEditClick} // Call the new handler for navigation
//           className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//         >
//           <PencilIcon className="h-4 w-4 mr-2" /> Edit
//         </button>
//         <button
//           onClick={() => onDelete(role.roleId)}
//           className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//         >
//           <TrashIcon className="h-4 w-4 mr-2" /> Delete
//         </button>
//       </div>
//     </div>
//   );
// };

// export default RoleCard;

"use client";

import React from 'react';
import { RoleResponseDTO } from '@/type/user';
import { PencilIcon, TrashIcon, EllipsisVerticalIcon, EyeIcon, TagIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface RoleCardProps {
  role: RoleResponseDTO;
  onDelete: (roleId: number) => void;
  currentUserPrivileges: number[];
  // ================================================================
  // ADDED: isProtected prop to handle non-editable/deletable roles
  // ================================================================
  isProtected: boolean;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, onDelete, currentUserPrivileges, isProtected }) => {
  const router = useRouter();

  // Determine which actions the user can perform based on privileges
  // Note: Privilege 19 is now assumed to handle both View and Create
  const canView = currentUserPrivileges.includes(19);
  const canEdit = currentUserPrivileges.includes(20);
  const canDelete = currentUserPrivileges.includes(21);

  // Combine privilege checks with the protected flag
  const canActuallyEdit = canEdit && !isProtected;
  const canActuallyDelete = canDelete && !isProtected;

  const showActionsDropdown = canView || canActuallyEdit || canActuallyDelete;

  const handleEditClick = (e: React.MouseEvent) => {
    if (!canActuallyEdit) {
      e.preventDefault();
      toast.error(isProtected ? "This is a system role and cannot be edited." : "You do not have permission to edit this role.");
    } else {
      router.push(`/iam/roles/${role.roleId}?mode=edit`);
    }
  };

  const handleDeleteClick = () => {
    if (!canActuallyDelete) {
      toast.error(isProtected ? "This is a system role and cannot be deleted." : "You do not have permission to delete this role.");
    } else {
      onDelete(role.roleId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 relative">
      
      {/* ================================================================ */}
      {/* MODIFIED: Conditionally render the dropdown menu based on any allowed privilege/action */}
      {/* ================================================================ */}
      {showActionsDropdown && (
        <div className="absolute top-4 right-4">
          <div className="relative group">
            <button className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition duration-150">
              <EllipsisVerticalIcon className="h-6 w-6" />
            </button>
            
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition duration-200 ease-in-out transform scale-95 group-hover:scale-100 z-10 origin-top-right">
              
              {canView && (
                <button
                  onClick={() => router.push(`/iam/roles/${role.roleId}?mode=view`)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-md"
                >
                  <EyeIcon className="h-4 w-4 mr-2 text-blue-500" /> View
                </button>
              )}
              {canEdit && (
                <button
                  onClick={handleEditClick}
                  disabled={!canActuallyEdit}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    !canActuallyEdit ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <PencilIcon className={`h-4 w-4 mr-2 ${!canActuallyEdit ? 'text-gray-400' : 'text-yellow-500'}`} /> Edit
                </button>
              )}
              {canDelete && (
                <button
                  onClick={handleDeleteClick}
                  disabled={!canActuallyDelete}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    !canActuallyDelete ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                  } rounded-b-md`}
                >
                  <TrashIcon className={`h-4 w-4 mr-2 ${!canActuallyDelete ? 'text-gray-400' : 'text-red-500'}`} /> Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{role.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{role.description}</p>
        <div className="flex items-center text-gray-700 text-sm mb-2">
          <TagIcon className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="font-medium">Code:</span> {role.code}
        </div>
        <div className="flex flex-wrap items-center text-gray-700 text-sm">
          <span className="font-medium mr-1">Privileges:</span>
          {role.privileges && role.privileges.length > 0 ? (
            role.privileges.map(p => (
              <span key={p.privilegeId} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mr-2 mb-1">
                {p.code}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-xs">No privileges assigned</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleCard;