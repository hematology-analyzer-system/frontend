// components/sidebar/Sidebar.tsx
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

// Updated data structure to include nested items and all design elements
const SIDEBAR_ITEMS = {
  ROLE_ADMIN: [
    { href: "/dashboard", label: "Dashboard", icon: <Squares2X2Icon className="h-5 w-5 text-gray-500" /> },
    {
      href: "#",
      label: "IAM",
      icon: <FingerPrintIcon className="h-5 w-5 text-gray-500" />,
      children: [
        { href: "/iam/users", label: "Users", icon: <UsersIcon className="h-5 w-5 text-gray-500" /> },
        { href: "/iam/roles", label: "Roles", icon: <TagIcon className="h-5 w-5 text-gray-500" /> },
      ],
    },
    { href: "/patients", label: "Patients", icon: <UsersIcon className="h-5 w-5 text-gray-500" /> },
    {
      href: "#",
      label: "Testorder",
      icon: <BeakerIcon className="h-5 w-5 text-gray-500" />,
      children: [
        { href: "/testorders", label: "Orders", icon: <ClipboardDocumentListIcon className="h-5 w-5 text-gray-500" /> },
        { href: "/testorderResult", label: "Results", icon: <ClipboardDocumentListIcon className="h-5 w-5 text-gray-500" /> },
      ],
    },
  ],
  ROLE_MANAGER: [
    { href: "/dashboard", label: "Dashboard", icon: <Squares2X2Icon className="h-5 w-5 text-gray-500" /> },
    { href: "/patients", label: "Patients", icon: <UsersIcon className="h-5 w-5 text-gray-500" /> },
    {
      href: "#",
      label: "Tests",
      icon: <BeakerIcon className="h-5 w-5 text-gray-500" />,
      children: [
        { href: "/testorders", label: "Orders", icon: <ClipboardDocumentListIcon className="h-5 w-5 text-gray-500" /> },
        { href: "/testorderResult", label: "Results", icon: <ClipboardDocumentListIcon className="h-5 w-5 text-gray-500" /> },
      ],
    },
  ],
  ROLE_USER: [
    { href: "/dashboard", label: "Dashboard", icon: <Squares2X2Icon className="h-5 w-5 text-gray-500" /> },
    { href: "/patients", label: "Patients", icon: <UsersIcon className="h-5 w-5 text-gray-500" /> },
    {
      href: "#",
      label: "Tests",
      icon: <BeakerIcon className="h-5 w-5 text-gray-500" />,
      children: [
        { href: "/testorders", label: "Orders", icon: <ClipboardDocumentListIcon className="h-5 w-5 text-gray-500" /> },
      ],
    },
  ],
};

export const Sidebar = () => {
  const [roleCode, setRoleCode] = useState<string | null>(null);

  useEffect(() => {
    const storedRoles = localStorage.getItem("roles");
    if (storedRoles) {
      try {
        // const roles = JSON.parse(storedRoles);
        // if (Array.isArray(roles) && roles.length > 0 && roles[0].code) {
        //   // setRoleCode(roles[0].code);
          
        // }
        setRoleCode("ROLE_ADMIN");
      } catch (e) {
        console.error("Invalid roles in localStorage", e);
      }
    }
  }, []);

  // Use a fallback to a default role or empty array if roleCode is not found
  const items = roleCode ? SIDEBAR_ITEMS[roleCode as keyof typeof SIDEBAR_ITEMS] ?? [] : [];

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

      {/* Settings, Helping Center, and Sign Out section */}
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