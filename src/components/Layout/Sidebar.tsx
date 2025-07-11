"use client";
import { useEffect, useState } from "react";
import { SidebarLink } from "@/components/Link/SidebarLink";
import { HomeIcon, UsersIcon, ClipboardIcon } from "@heroicons/react/24/outline";

const SIDEBAR_ITEMS = {
  ROLE_ADMIN: [
    { href: "/dashboard", label: "Dashboard", icon: <HomeIcon className="h-5 w-5" /> },
    { href: "/iam/users", label: "Users", icon: <UsersIcon className="h-5 w-5" /> },
    { href: "/iam/roles", label: "Roles", icon: <ClipboardIcon className="h-5 w-5" /> },
    { href: "/patients", label: "Patients", icon: <ClipboardIcon className="h-5 w-5" /> },
    { href: "/tests", label: "Tests", icon: <ClipboardIcon className="h-5 w-5" /> },
    { href: "/orders", label: "Orders", icon: <ClipboardIcon className="h-5 w-5" /> },
    { href: "/results", label: "Results", icon: <ClipboardIcon className="h-5 w-5" /> },
  ],
  ROLE_USER: [ // manager
    { href: "/tests", label: "Tests", icon: <ClipboardIcon className="h-5 w-5" /> },
    { href: "/orders", label: "Orders", icon: <ClipboardIcon className="h-5 w-5" /> },
  ],
  ROLE_EDITOR: [ // user
    { href: "/orders", label: "Orders", icon: <ClipboardIcon className="h-5 w-5" /> },
  ],
};

export const Sidebar = () => {
  const [roleCode, setRoleCode] = useState<string | null>(null);

  useEffect(() => {
    const storedRoles = localStorage.getItem("roles");
    if (storedRoles) {
      try {
        const roles = JSON.parse(storedRoles);
        if (Array.isArray(roles) && roles.length > 0 && roles[0].code) {
          setRoleCode(roles[0].code); // ✅ safely set after hydration
        }
      } catch (e) {
        console.error("Invalid roles in localStorage", e);
      }
    }
  }, []);

  const items = roleCode ? SIDEBAR_ITEMS[roleCode as keyof typeof SIDEBAR_ITEMS] ?? [] : [];

  return (
    <aside className="w-64 bg-white border-r h-screen fixed">
      <div className="p-4 font-bold text-xl">Healthcare</div>
      <nav className="mt-4 space-y-2">
        {items.map((item) => (
          <SidebarLink key={item.href} {...item} />
        ))}
      </nav>
    </aside>
  );
};
