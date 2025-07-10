// components/Sidebar.tsx
'use client';

import {useAuth} from '@/context/AuthContext';
import Link from 'next/link';

const Sidebar = () => {
  const { role } = useAuth();

  const commonLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/iam/users', label: 'Users', roles: ['admin'] },
    { href: '/iam/roles', label: 'Roles', roles: ['admin'] },
    { href: '/patients', label: 'Patients' },
    { href: '/tests/orders', label: 'Orders' },
    { href: '/tests/results', label: 'Results' },
    { href: '/settings', label: 'Settings' },
    { href: '/help', label: 'Helping center' },
  ];

  return (
    <aside className="w-64 bg-white border-r h-full p-4 space-y-3">
      <h2 className="text-xl font-semibold mb-6">Healthcare</h2>
      <nav className="space-y-2">
        {commonLinks.map(
          (link) =>
            (!link.roles || link.roles.includes(role)) && (
              <Link
                key={link.href}
                href={link.href}
                className="block p-2 hover:bg-blue-100 rounded"
              >
                {link.label}
              </Link>
            )
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
