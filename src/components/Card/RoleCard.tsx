// // src/components/Card/RoleCard.tsx
// import React from 'react';
// import { RoleResponseDTO } from '@/type/user';
// import { PencilIcon, TrashIcon, TagIcon } from '@heroicons/react/24/outline';
// import {useRouter} from 'next/navigation';

// interface RoleCardProps {
//   role: RoleResponseDTO;
//   onEdit: (role: RoleResponseDTO) => void;
//   onDelete: (roleId: number) => void;
// }

// const router = useRouter();

// const RoleCard: React.FC<RoleCardProps> = ({ role, onEdit, onDelete }) => {
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
//           onClick={() => onEdit(role)}
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

// src/components/Card/RoleCard.tsx
"use client"; // Make sure this is a client component as it uses useRouter

import React from 'react';
import { RoleResponseDTO } from '@/type/user';
import { PencilIcon, TrashIcon, TagIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation'; // Import useRouter

interface RoleCardProps {
  role: RoleResponseDTO;
  // onEdit: (role: RoleResponseDTO) => void; // This prop will no longer be needed for navigation
  onDelete: (roleId: number) => void; // Keep for delete functionality
}

const RoleCard: React.FC<RoleCardProps> = ({ role, onDelete }) => {
  const router = useRouter(); // Initialize useRouter inside the component

  const handleEditClick = () => {
    router.push(`/iam/roles/${role.roleId}`); // Navigate to the dynamic edit page
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{role.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{role.description}</p>
        <div className="flex items-center text-gray-700 text-sm mb-2">
          <TagIcon className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="font-medium">Code:</span> {role.code}
        </div>
        <div className="flex flex-wrap items-center text-gray-700 text-sm">
          <TagIcon className="h-4 w-4 mr-2 flex-shrink-0" />
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
      <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
        <button
          onClick={handleEditClick} // Call the new handler for navigation
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PencilIcon className="h-4 w-4 mr-2" /> Edit
        </button>
        <button
          onClick={() => onDelete(role.roleId)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <TrashIcon className="h-4 w-4 mr-2" /> Delete
        </button>
      </div>
    </div>
  );
};

export default RoleCard;