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
import NotificationBell from "./NotificationBell";
import { useNotification } from "@/context/NotificationContext";

export const Navbar: React.FC = () => {
  const [fullName, setFullName] = useState<string | null>(null);
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

  return (
    <div className="flex justify-between items-center px-6 py-2 bg-[#fff] sticky top-0 shadow-sm z-10">
      <div>
        <span className="text-sm text-gray-500">Healthcare Services System</span>
        <h1 className="text-lg font-bold">Group 2</h1>
      </div>
      <div className="flex items-center space-x-4">
        <NotificationBell notifications={notifications} />
        <UserCircleIcon className="h-6 w-6 text-black" />
        <span className="text-sm font-medium">{fullName}</span>
      </div>
    </div>
  );
};