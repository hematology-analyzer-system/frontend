// components/Navbar.tsx
'use client';

import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const { fullName } = useAuth();

  return (
    <header className="w-full bg-gray-50 border-b px-6 py-3 flex justify-between items-center">
      <h1 className="font-medium text-gray-700">Healthcare Services System</h1>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>{fullName}</span>
        <div className="w-8 h-8 bg-black rounded-full" />
      </div>
    </header>
  );
};

export default Navbar;
