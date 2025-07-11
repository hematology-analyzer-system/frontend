"use client";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export const Navbar = () => {
  return (
    <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
      <div>
        <span className="text-sm text-gray-500">Healthcare Services System</span>
        <h1 className="text-lg font-bold">Group 2</h1>
      </div>
      <div className="flex items-center space-x-2">
        <UserCircleIcon className="h-6 w-6 text-black" />
        <span className="text-sm font-medium">Nguyen Huu Thanh</span>
      </div>
    </div>
  );
};
