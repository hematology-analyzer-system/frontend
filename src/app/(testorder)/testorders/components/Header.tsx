// src/app/testorder/components/Header.tsx
'use client';

import { Plus, Sun, Moon, Sliders } from 'lucide-react';
import { FC, useState } from 'react';

interface Props {
  onNew: () => void;   // mở modal new‐patient
}
const Header: FC<Props> = ({ onNew }) => {
  const [dark, setDark] = useState(false);
  const storedRoles = localStorage.getItem("privilege_ids");
  const hasCreatePrivilege = storedRoles && JSON.parse(storedRoles).includes(2);

  return (
    <div className="flex justify-between items-center p-4">
      {hasCreatePrivilege && (<div className="flex items-center space-x-3">
        <button
          onClick={onNew}
          className="flex items-center bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
        >
          <Plus className="mr-2" />Testorder for new patient
        </button>
        {/* <button
          onClick={onOld}
          className="flex items-center bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
        >
          <Plus className="mr-2" />Testorder for old patient
        </button> */}
      </div>)}
      {/* <div className="flex items-center space-x-3">
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded hover:bg-gray-200"
        >
          {dark ? <Moon /> : <Sun />}
        </button>
        <button className="p-2 rounded hover:bg-gray-200">
          <Sliders />
        </button>
      </div> */}
    </div>
  );
};

export default Header;
