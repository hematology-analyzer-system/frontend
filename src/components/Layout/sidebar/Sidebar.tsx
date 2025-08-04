// // components/sidebar/Sidebar.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { SidebarItem } from "./SidebarItem";
// import {
//   HomeIcon,
//   FingerPrintIcon,
//   UsersIcon,
//   TagIcon,
//   ClipboardDocumentListIcon,
//   BeakerIcon,
//   Cog6ToothIcon,
//   LifebuoyIcon,
//   ArrowLeftEndOnRectangleIcon,
//   Squares2X2Icon // Used for Dashboard
// } from "@heroicons/react/24/outline";
// import React from "react";

// // Updated data structure to include nested items and all design elements
// const SIDEBAR_ITEMS = {
//   ROLE_ADMIN: [
//     { href: "/dashboard", label: "Dashboard", icon: <Squares2X2Icon className="h-5 w-5 text-gray-500" /> },
//     {
//       href: "#",
//       label: "IAM",
//       icon: <FingerPrintIcon className="h-5 w-5 text-gray-500" />,
//       children: [
//         { href: "/iam/users", label: "Users", icon: <UsersIcon className="h-5 w-5 text-gray-500" /> },
//         { href: "/iam/roles", label: "Roles", icon: <TagIcon className="h-5 w-5 text-gray-500" /> },
//       ],
//     },
//     { href: "/patients", label: "Patients", icon: <UsersIcon className="h-5 w-5 text-gray-500" /> },
//     {
//       href: "#",
//       label: "Testorder",
//       icon: <BeakerIcon className="h-5 w-5 text-gray-500" />,
//       children: [
//         { href: "/testorders", label: "Orders", icon: <ClipboardDocumentListIcon className="h-5 w-5 text-gray-500" /> },
//         { href: "/testorderResult", label: "Results", icon: <ClipboardDocumentListIcon className="h-5 w-5 text-gray-500" /> },
//       ],
//     },
//   ],
//   ROLE_MANAGER: [
//     { href: "/dashboard", label: "Dashboard", icon: <Squares2X2Icon className="h-5 w-5 text-gray-500" /> },
//     { href: "/patients", label: "Patients", icon: <UsersIcon className="h-5 w-5 text-gray-500" /> },
//     {
//       href: "#",
//       label: "Tests",
//       icon: <BeakerIcon className="h-5 w-5 text-gray-500" />,
//       children: [
//         { href: "/testorders", label: "Orders", icon: <ClipboardDocumentListIcon className="h-5 w-5 text-gray-500" /> },
//         { href: "/testorderResult", label: "Results", icon: <ClipboardDocumentListIcon className="h-5 w-5 text-gray-500" /> },
//       ],
//     },
//   ],
//   ROLE_USER: [
//     { href: "/dashboard", label: "Dashboard", icon: <Squares2X2Icon className="h-5 w-5 text-gray-500" /> },
//     { href: "/patients", label: "Patients", icon: <UsersIcon className="h-5 w-5 text-gray-500" /> },
//     {
//       href: "#",
//       label: "Tests",
//       icon: <BeakerIcon className="h-5 w-5 text-gray-500" />,
//       children: [
//         { href: "/testorders", label: "Orders", icon: <ClipboardDocumentListIcon className="h-5 w-5 text-gray-500" /> },
//       ],
//     },
//   ],
// };

// export const Sidebar = () => {
//   const [roleCode, setRoleCode] = useState<string | null>(null);

//   useEffect(() => {
//     const storedRoles = localStorage.getItem("roles");
//     if (storedRoles) {
//       try {
//         // const roles = JSON.parse(storedRoles);
//         // if (Array.isArray(roles) && roles.length > 0 && roles[0].code) {
//         //   // setRoleCode(roles[0].code);
          
//         // }
//         setRoleCode("ROLE_ADMIN");
//       } catch (e) {
//         console.error("Invalid roles in localStorage", e);
//       }
//     }
//   }, []);

//   // Use a fallback to a default role or empty array if roleCode is not found
//   const items = roleCode ? SIDEBAR_ITEMS[roleCode as keyof typeof SIDEBAR_ITEMS] ?? [] : [];

//   return (
//     <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed overflow-y-auto">
//       <div className="p-6 text-center">
//         <h1 className="text-3xl font-bold text-gray-900 calistoga-regular">Healthcare</h1>
//       </div>
      
//       <nav className="flex-grow px-4 mt-4 space-y-1">
//         {items.map((item) => (
//           <SidebarItem key={item.href} item={item} />
//         ))}
//       </nav>

//       {/* Separator Line */}
//       <hr className="my-6 mx-4 border-t border-gray-200" />

//       {/* Settings, Helping Center, and Sign Out section */}
//       <nav className="px-4 space-y-1">
//         <SidebarItem
//           item={{ href: "/settings", label: "Settings", icon: <Cog6ToothIcon className="h-5 w-5 text-gray-500" /> }}
//         />
//         <SidebarItem
//           item={{ href: "/help", label: "Helping center", icon: <LifebuoyIcon className="h-5 w-5 text-gray-500" /> }}
//         />
//         <SidebarItem
//           item={{ href: "/logout", label: "Sign out", icon: <ArrowLeftEndOnRectangleIcon className="h-5 w-5 text-gray-500" /> }}
//         />
//       </nav>
//     </aside>
//   );
// };

"use client";

import { useEffect, useState } from "react";
import { SidebarItem } from "./SidebarItem";
import {
  HomeIcon,
  FingerPrintIcon,
  UsersIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  BeakerIcon,
  Cog6ToothIcon,
  LifebuoyIcon,
  ArrowLeftEndOnRectangleIcon,
  Squares2X2Icon // Used for Dashboard
} from "@heroicons/react/24/outline";
import React from "react";

// Define a type for the navigation items, including an optional privilegeId
interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  privilegeId?: number | null; // Optional privilege ID required to view this item
  children?: NavItem[];
}

// Master list of all possible sidebar items with their required privilege ID.
// A 'null' privilegeId means the item is visible to all authenticated users.
const MASTER_SIDEBAR_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: <Squares2X2Icon className="h-5 w-5 text-gray-500" />, privilegeId: null },
  {
    href: "#",
    label: "IAM",
    icon: <FingerPrintIcon className="h-5 w-5 text-gray-500" />,
    privilegeId: null, // A parent item doesn't need a privilege, it's shown if any children are visible
    children: [
      // Privilege ID 13 is required to view the "Users" link
      { href: "/iam/users", label: "Users", icon: <UsersIcon className="h-5 w-5 text-gray-500" />, privilegeId: 13 },
      // Privilege ID 18 is required to view the "Roles" link
      { href: "/iam/roles", label: "Roles", icon: <TagIcon className="h-5 w-5 text-gray-500" />, privilegeId: 18 },
    ],
  },
  // Privilege ID 1 is required to view the "Patients" link
  { href: "/patients", label: "Patients", icon: <UsersIcon className="h-5 w-5 text-gray-500" />, privilegeId: 1 },
  {
    href: "#",
    label: "Testorder",
    icon: <BeakerIcon className="h-5 w-5 text-gray-500" />,
    privilegeId: null, // A parent item doesn't need a privilege, it's shown if any children are visible
    children: [
      // Privilege ID 1 is required to view the "Orders" link
      { href: "/testorders", label: "Orders", icon: <ClipboardDocumentListIcon className="h-5 w-5 text-gray-500" />, privilegeId: 1 },
      { href: "/testorderResult", label: "Results", icon: <ClipboardDocumentListIcon className="h-5 w-5 text-gray-500" />, privilegeId: 1 },
    ],
  },
];

// Helper function to recursively filter the sidebar items based on privileges
const filterMenuItems = (items: NavItem[], privileges: Set<number>): NavItem[] => {
  return items
    .map(item => {
      // Create a copy of the item to avoid direct mutation
      const newItem = { ...item };

      // If the item has children, filter them recursively
      if (newItem.children) {
        newItem.children = filterMenuItems(newItem.children, privileges);
      }

      // Check if the item should be included in the final menu
      // FIX: Add a check for newItem.privilegeId !== undefined to satisfy the type checker.
      const hasPrivilege = newItem.privilegeId === null || (newItem.privilegeId !== undefined && privileges.has(newItem.privilegeId));
      const hasVisibleChildren = newItem.children && newItem.children.length > 0;

      // The item is included if it meets the privilege requirement OR
      // if it's a parent item with at least one visible child.
      if (hasPrivilege || hasVisibleChildren) {
        return newItem;
      }

      // Return null to filter out this item
      return null;
    })
    .filter((item): item is NavItem => item !== null); // Filter out null items
};

export const Sidebar = () => {
  const [userPrivileges, setUserPrivileges] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData"); // Assuming you store the user data here
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        // Assuming your backend response has a "privilege_ids" key with a Set<Long>
        if (userData.privilege_ids) {
          // Convert the array of IDs to a Set for efficient lookups
          setUserPrivileges(new Set(userData.privilege_ids));
        }
      } catch (e) {
        console.error("Invalid user data in localStorage", e);
      }
    }
    setIsLoading(false);
  }, []);

  // Filter the master list based on the user's privileges
  const items = filterMenuItems(MASTER_SIDEBAR_ITEMS, userPrivileges);

  // You can render a loading state if needed
  if (isLoading) {
    return (
      <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed overflow-y-auto">
        <div className="p-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 calistoga-regular">Healthcare</h1>
        </div>
        <div className="flex justify-center items-center h-full">
          <p>Loading...</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed overflow-y-auto">
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 calistoga-regular">Healthcare</h1>
      </div>
      
      <nav className="flex-grow px-4 mt-4 space-y-1">
        {items.map((item) => (
          <SidebarItem key={item.href} item={item} />
        ))}
      </nav>

      {/* Separator Line */}
      <hr className="my-6 mx-4 border-t border-gray-200" />

      {/* Static items for all authenticated users */}
      <nav className="px-4 space-y-1">
        <SidebarItem
          item={{ href: "/settings", label: "Settings", icon: <Cog6ToothIcon className="h-5 w-5 text-gray-500" /> }}
        />
        <SidebarItem
          item={{ href: "/help", label: "Helping center", icon: <LifebuoyIcon className="h-5 w-5 text-gray-500" /> }}
        />
        <SidebarItem
          item={{ href: "/logout", label: "Sign out", icon: <ArrowLeftEndOnRectangleIcon className="h-5 w-5 text-gray-500" /> }}
        />
      </nav>
    </aside>
  );
};
