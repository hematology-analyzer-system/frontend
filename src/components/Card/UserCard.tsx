// components/Card/UserCard.tsx
import React from 'react';
import { UserResponseDTO } from '@/type/user';
import { EyeIcon, PencilIcon, TrashIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';

interface UserCardProps {
  user: UserResponseDTO;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  // ================================================================
  // NEW: Add a prop for the current user's privileges
  // ================================================================
  currentUserPrivileges: number[];
}

const UserCard: React.FC<UserCardProps> = ({ user, onView, onEdit, onDelete, currentUserPrivileges }) => {
  const displayRole = user.roles && user.roles.length > 0 ? user.roles[0].name : 'N/A Role';
  
  // ================================================================
  // NEW: Define booleans to check for each privilege
  // ================================================================
  const canView = currentUserPrivileges.includes(13);
  const canEdit = currentUserPrivileges.includes(15);
  const canDelete = currentUserPrivileges.includes(16);

  // Check if any action button should be shown
  const showActionsDropdown = canView || canEdit || canDelete;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center transition-transform duration-200 hover:scale-[1.02] border border-gray-100 relative">
      
      {/* ================================================================ */}
      {/* NEW: Conditionally render the dropdown menu based on any privilege */}
      {/* ================================================================ */}
      {showActionsDropdown && (
        <div className="absolute top-4 right-4">
          <div className="relative group">
            <button className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition duration-150">
              <EllipsisVerticalIcon className="h-6 w-6" />
            </button>
            
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition duration-200 ease-in-out transform scale-95 group-hover:scale-100 z-10 origin-top-right">
              {/* ================================================================ */}
              {/* NEW: Conditionally render each action button based on its privilege */}
              {/* ================================================================ */}
              {canView && (
                <button
                  onClick={() => onView(user.id)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-md"
                >
                  <EyeIcon className="h-4 w-4 mr-2 text-blue-500" /> View
                </button>
              )}
              {canEdit && (
                <button
                  onClick={() => onEdit(user.id)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <PencilIcon className="h-4 w-4 mr-2 text-yellow-500" /> Edit
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => onDelete(user.id)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-md"
                >
                  <TrashIcon className="h-4 w-4 mr-2 text-red-500" /> Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Image */}
      <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-blue-100">
        <img
          src={user.profileImageUrl || `https://placehold.co/96x96/ADD8E6/000000?text=${user.fullName.charAt(0)}`}
          alt={user.fullName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name, Role, Email, and Status */}
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{user.fullName}</h3>
      <p className="text-sm text-gray-500 mb-1">{displayRole}</p>
      <p className="text-sm text-gray-500 mb-1">{user.email}</p>
      <p className={`text-sm font-medium ${user.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
        {user.status}
      </p>
    </div>
  );
};

export default UserCard;