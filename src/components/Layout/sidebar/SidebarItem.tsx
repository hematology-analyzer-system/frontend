// // components/sidebar/SidebarItem.tsx
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   ChevronDownIcon,
//   ChevronRightIcon
// } from "@heroicons/react/24/outline";
// import React from "react";

// // Define a type for the navigation items
// interface NavItem {
//   href: string;
//   label: string;
//   icon: React.ReactNode;
//   children?: NavItem[];
// }

// interface SidebarItemProps {
//   item: NavItem;
// }

// export const SidebarItem = ({ item }: SidebarItemProps) => {
//   const pathname = usePathname();
//   const isActive = item.href === pathname;
//   const [isOpen, setIsOpen] = useState(false);

//   // If the item has sub-items (children), render a dropdown
//   if (item.children) {
//     return (
//       <div className="space-y-1">
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className={`flex items-center w-full px-4 py-2 text-sm font-medium transition duration-150 rounded-md
//             ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-200'}`}
//         >
//           {item.icon}
//           <span className="ml-3">{item.label}</span>
//           <span className="ml-auto">
//             {isOpen ? (
//               <ChevronDownIcon className="h-4 w-4 text-gray-500" />
//             ) : (
//               <ChevronRightIcon className="h-4 w-4 text-gray-500" />
//             )}
//           </span>
//         </button>
//         {isOpen && (
//           <div className="ml-6 space-y-1">
//             {item.children.map((child) => (
//               <SidebarItem key={child.href} item={child} />
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   }

//   // If the item is a single link, render it as a button or a Link
//   return (
//     <Link
//       href={item.href}
//       className={`flex items-center px-4 py-2 text-sm font-medium transition duration-150 rounded-md
//         ${isActive ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-200'}`}
//     >
//       {item.icon}
//       <span className="ml-3">{item.label}</span>
//     </Link>
//   );
// };

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDownIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import React from "react";

// Define a type for the navigation items
interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  privilegeId?: number | null; // Added to match the new data structure
  children?: NavItem[];
}

interface SidebarItemProps {
  item: NavItem;
}

export const SidebarItem = ({ item }: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = item.href === pathname;
  const [isOpen, setIsOpen] = useState(false);

  // If the item has sub-items (children), render a dropdown
  if (item.children) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center w-full px-4 py-2 text-sm font-medium transition duration-150 rounded-md
            ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-200'}`}
        >
          {item.icon}
          <span className="ml-3">{item.label}</span>
          <span className="ml-auto">
            {isOpen ? (
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRightIcon className="h-4 w-4 text-gray-500" />
            )}
          </span>
        </button>
        {isOpen && (
          <div className="ml-6 space-y-1">
            {item.children.map((child) => (
              <SidebarItem key={child.href} item={child} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // If the item is a single link, render it as a button or a Link
  return (
    <Link
      href={item.href}
      className={`flex items-center px-4 py-2 text-sm font-medium transition duration-150 rounded-md
        ${isActive ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-200'}`}
    >
      {item.icon}
      <span className="ml-3">{item.label}</span>
    </Link>
  );
};
