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


"use client";

import { useEffect, useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import React from "react";
import NotificationBell from "../Notification/NotificationBell";

export const Navbar = () => {
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    // Check if localStorage is available (i.e., we are on the client-side)
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem('fullName');
      if (storedName) {
        try {
          // localStorage stores data as a string, so we need to parse it.
          // The data was stored with JSON.stringify, so we parse it here.
          setFullName(JSON.parse(storedName));
        } catch (e) {
          console.error("Failed to parse fullName from localStorage", e);
        }
      }
    }
  }, []); // The empty dependency array ensures this runs only once on mount.

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

        {/* User */}
        <div className="flex items-center space-x-2">
          <UserCircleIcon className="h-6 w-6 text-black" />
          <span className="text-sm font-medium">{fullName}</span>
        </div>
      </div>
    </div>
  );
};