// src/app/testorder/components/Header.tsx
'use client';

import { Plus, Sun, Moon, Sliders } from 'lucide-react';
import { FC, useState } from 'react';

interface Props {
  onNew: () => void;   // mở modal new‐patient
}
const Header: FC<Props> = ({ onNew }) => {
  const [dark, setDark] = useState(false);

  return (
    <div className="flex justify-between items-center p-4">
      {/* <div className="flex items-center space-x-3">
        <button
          onClick={onNew}
          className="button flex items-center text-white px-4 py-2 rounded-lg"
        >
          <Plus className="mr-2" />New patient
        </button>
        
      </div> */}
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
