// "use client";
// import { UserCircleIcon } from "@heroicons/react/24/solid";

// export const Navbar = () => {
//   return (
//     <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
//       <div>
//         <span className="text-sm text-gray-500">Healthcare Services System</span>
//         <h1 className="text-lg font-bold">Group 2</h1>
//       </div>
//       <div className="flex items-center space-x-2">
//         <UserCircleIcon className="h-6 w-6 text-black" />
//         <span className="text-sm font-medium">{localStorage.getItem('fullName')}</span>
//       </div>
//     </div>
//   );
// };


// "use client";

// import { useEffect, useState } from "react";
// import { UserCircleIcon } from "@heroicons/react/24/solid";
// import React from "react";
// import NotificationBell from "../Notification/NotificationBell";

// export const Navbar = () => {
//   const [fullName, setFullName] = useState<string | null>(null);

//   useEffect(() => {
//     // Check if localStorage is available (i.e., we are on the client-side)
//     if (typeof window !== "undefined") {
//       const storedName = localStorage.getItem('fullName');
//       if (storedName) {
//         try {
//           // localStorage stores data as a string, so we need to parse it.
//           // The data was stored with JSON.stringify, so we parse it here.
//           setFullName(JSON.parse(storedName));
//         } catch (e) {
//           console.error("Failed to parse fullName from localStorage", e);
//         }
//       }
//     }
//   }, []); // The empty dependency array ensures this runs only once on mount.

//   return (
//     <div className="flex justify-between items-center px-6 py-2 bg-[#fff] sticky top-0 shadow-sm z-10">
//       <div>
//         <span className="text-sm text-gray-500">Healthcare Services System</span>
//         <h1 className="text-lg font-bold">Group 2</h1>
//       </div>

//       <div className="relative flex flex-row gap-x-5">
//         {/* Notification */}
//         <div className="relative pt-2">
//           <NotificationBell />
//         </div>

//         {/* User */}
//         <div className="flex items-center space-x-2">
//           <UserCircleIcon className="h-6 w-6 text-black" />
//           <span className="text-sm font-medium">{fullName}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

"use client";

import { useEffect, useState, useRef } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import React from "react";
import NotificationBell from "./NotificationBell";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";

export const Navbar: React.FC = () => {
  const [fullName, setFullName] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { notifications } = useNotification();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem('fullName');
      if (storedName) {
        try {
          setFullName(JSON.parse(storedName));
        } catch (e) {
          console.error("Failed to parse fullName from localStorage", e);
        }
      }
    }
  }, []);

  // Effect to handle clicks outside of the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    
    // Add the event listener to the document
    document.addEventListener("mousedown", handleClickOutside);
    
    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleProfileClick = () => {
    router.push('/iam/users/profile');
    setShowDropdown(false); // Close dropdown after navigation
  };

  return (
    <div className="flex justify-between items-center px-6 py-2 bg-[#fff] sticky top-0 shadow-sm z-10">
      <div>
        <span className="text-sm text-gray-500">Healthcare Services System</span>
        <h1 className="text-lg font-bold">Group 2</h1>
      </div>

      <div className="relative flex flex-row gap-x-5">
        {/* Notification */}
        <div className="relative pt-2">
          <NotificationBell />
        </div>

        {/* User Dropdown */}
        <div 
          className="flex items-center space-x-2 cursor-pointer relative" 
          onClick={toggleDropdown}
          ref={dropdownRef} // Attach ref to the clickable container
        >
          <UserCircleIcon className="h-6 w-6 text-black" />
          <span className="text-sm font-medium">{fullName}</span>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-20">
              <a 
                onClick={handleProfileClick}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Profile
              </a>
            </div>
          )}
        </div>
      {/* <div className="flex items-center space-x-4">
        <NotificationBell notifications={notifications} />
        <UserCircleIcon className="h-6 w-6 text-black" />
        <span className="text-sm font-medium">{fullName}</span>
      </div>
      {/* <div className="flex items-center space-x-4">
        <NotificationBell notifications={notifications} />
        <UserCircleIcon className="h-6 w-6 text-black" />
        <span className="text-sm font-medium">{fullName}</span>
      </div> */}
    </div>
  );
};