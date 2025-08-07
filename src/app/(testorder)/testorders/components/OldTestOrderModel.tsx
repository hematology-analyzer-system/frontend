// src/app/testorder/components/OldTestOrderModal.tsx
'use client';

import { FC, useState } from 'react';
import { X } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL + '/testorder'
  : 'https://fhard.khoa.email/api/testorders';

interface Props {
  onClose(): void;
  onCreated(): void;
}

const OldTestOrderModal: FC<Props> = ({ onClose, onCreated }) => {
  const [patientId, setPatientId] = useState('');

  const handleSave = async () => {
    const idNum = Number(patientId);
    if (!idNum) {
      alert('Please enter a valid Patient ID');
      return;
    }

    const res = await fetch(
      `${BASE}/testorder/create/${patientId}`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    if (!res.ok) {
      alert('Failed to create testorder for existing patient');
      return;
    }
    onCreated();
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg border border-teal-500 p-6 w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">
          Testorder for old patient
        </h2>

        <label className="block mb-4">
          <div className="text-sm font-medium mb-1">Patient ID</div>
          <input
            type="number"
            value={patientId}
            onChange={e => setPatientId(e.target.value)}
            placeholder="Enter existing Patient ID"
            className="w-full py-2 px-3 rounded-full bg-cyan-100 focus:outline-none"
          />
        </label>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
          >
            Create &amp; Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default OldTestOrderModal;
