// 'use client';

// import React from 'react';
// import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

// interface SearchFilterBarProps {
//   searchText: string;
//   onSearchChange: (text: string) => void;
//   selectedRole: string;
//   onRoleChange: (role: string) => void;
//   selectedLocation: string;
//   onLocationChange: (location: string) => void;
//   selectedSort: string;
//   onSortChange: (sort: string) => void;
// }

// const ROLES = ['Admin', 'Doctor', 'Staff'];
// const LOCATIONS = ['TPHCM', 'Hanoi', 'Danang'];
// const SORTS = ['A - Z', 'Z - A'];

// const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
//   searchText,
//   onSearchChange,
//   selectedRole,
//   onRoleChange,
//   selectedLocation,
//   onLocationChange,
//   selectedSort,
//   onSortChange,
// }) => {
//   return (
//     <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 bg-white p-4 rounded-xl shadow-md border border-gray-100 mb-6">
      
//       {/* Search Input */}
//       <div className="relative flex-grow w-full sm:w-auto">
//         <input
//           type="text"
//           placeholder="Search anything..."
//           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           value={searchText}
//           onChange={(e) => onSearchChange(e.target.value)}
//         />
//         <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//       </div>

//       {/* Role Dropdown */}
//       <select
//         className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-40"
//         value={selectedRole}
//         onChange={(e) => onRoleChange(e.target.value)}
//       >
//         <option value="">Role: All</option>
//         {ROLES.map(role => (
//           <option key={role} value={role}>{role}</option>
//         ))}
//       </select>

//       {/* Location Dropdown */}
//       <select
//         className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-40"
//         value={selectedLocation}
//         onChange={(e) => onLocationChange(e.target.value)}
//       >
//         <option value="">Location: All</option>
//         {LOCATIONS.map(location => (
//           <option key={location} value={location}>{location}</option>
//         ))}
//       </select>

//       {/* Sort Dropdown */}
//       <select
//         className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-40"
//         value={selectedSort}
//         onChange={(e) => onSortChange(e.target.value)}
//       >
//         {SORTS.map(sort => (
//           <option key={sort} value={sort}>{sort}</option>
//         ))}
//       </select>

//       {/* Apply Filters Button */}
//       <button
//         type="button"
//         className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
//       >
//         <FunnelIcon className="h-5 w-5 mr-2" />
//         Apply Filters
//       </button>

//     </div>
//   );
// };

// export default SearchFilterBar;

'use client';

import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface SearchFilterBarProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
  rolesOptions?: string[];     // Optional custom roles
  locationOptions?: string[];  // Optional custom locations
}

const DEFAULT_ROLES = ['Admin', 'Doctor', 'Staff'];
const DEFAULT_LOCATIONS = ['TPHCM', 'Hanoi', 'Danang'];
const SORTS = ['A - Z', 'Z - A'];

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchText,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedLocation,
  onLocationChange,
  selectedSort,
  onSortChange,
  rolesOptions,
  locationOptions,
}) => {
  const roles = rolesOptions || DEFAULT_ROLES;
  const locations = locationOptions || DEFAULT_LOCATIONS;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 bg-white p-4 rounded-xl shadow-md border border-gray-100 mb-6">
      
      {/* Search Input */}
      <div className="relative flex-grow w-full sm:w-auto">
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {/* Role Dropdown */}
      <select
        className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-40"
        value={selectedRole}
        onChange={(e) => onRoleChange(e.target.value)}
      >
        <option value="">Role: All</option>
        {roles.map(role => (
          <option key={role} value={role}>{role}</option>
        ))}
      </select>

      {/* Location Dropdown */}
      <select
        className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-40"
        value={selectedLocation}
        onChange={(e) => onLocationChange(e.target.value)}
      >
        <option value="">Location: All</option>
        {locations.map(location => (
          <option key={location} value={location}>{location}</option>
        ))}
      </select>

      {/* Sort Dropdown */}
      <select
        className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-40"
        value={selectedSort}
        onChange={(e) => onSortChange(e.target.value)}
      >
        {SORTS.map(sort => (
          <option key={sort} value={sort}>{sort}</option>
        ))}
      </select>

      {/* Apply Filters Button */}
      <button
        type="button"
        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
      >
        <FunnelIcon className="h-5 w-5 mr-2" />
        Apply Filters
      </button>

    </div>
  );
};

export default SearchFilterBar;
