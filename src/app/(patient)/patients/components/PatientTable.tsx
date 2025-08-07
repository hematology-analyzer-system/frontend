// src/app/testorder/components/TestOrderTable.tsx
'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import { Patient,BASE } from '../fetch';
import Header from './Header';

import NewPatientModel from './NewPatientModel';

interface Props {
  data: Patient[];
  reload: () => void;
}
function extractIdNum(runBy: string | null): string | null {
  if (!runBy) {
    return null
  }
  const m = runBy.match(/Email:\s*([^|]+)/);
  return m ? m[1] : null;
}
const handleCreate = async (id: Number) => {
    const res = await fetch(
      `http://localhost:8082/testorder/testorder/create/${id}`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    if (!res.ok) {
      alert('Failed to create testorder for patient');
      return;
    }
    alert('Create testorder successfully');
  };

const PatientTable: FC<Props> = ({ data, reload }) => {
  const [showNew, setShowNew] = useState(false);
  const storedRoles = localStorage.getItem("privilege_ids");
  const hasCreatePrivilege = storedRoles && JSON.parse(storedRoles).includes(2);

// Dynamic headers based on privileges
  const getTableHeaders = () => {
  const baseHeaders = ['Patient name', 'Age', 'Gender', 'Email', 'Phone', 'Address'];
  const endHeaders = ['View'];
  
  if (hasCreatePrivilege) {
    return [...baseHeaders, 'New Testorder', ...endHeaders];
  }
  return [...baseHeaders, ...endHeaders];
};
  return (
    <div className="max-w-6xl mx-auto">

      {/* Header với 2 nút New/Old */}
      <Header onNew={() => setShowNew(true)} />

      

      {/* Bảng Test Orders */}
      <div className="p-4 overflow-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
    <thead className="bg-gray-100">
      <tr>
        {getTableHeaders().map(h => (
          <th
            key={h}
            className="p-2 text-left text-sm font-medium text-gray-600"
          >
            {h}
          </th>
        ))}
      </tr>
    </thead>
    {data.length === 0 ? (
      <tbody>
        <tr>
          <td colSpan={hasCreatePrivilege ? 8 : 7} className="p-8 text-center text-gray-500">
            No data
          </td>
        </tr>
      </tbody>
    ) : (
      <tbody>
        {data.map(o => (
          <tr key={o.id} className="border-t hover:bg-green-50">
            <td className="p-2">{o.fullName}</td>
            <td className="p-2">{new Date().getFullYear() - new Date(o.dateOfBirth).getFullYear()}</td>
            <td className="p-2">{o.gender}</td>
            <td className="p-2">{o.email}</td>
            <td className="p-2">{o.phone}</td>
            <td className="p-2">{o.address}</td>
            {hasCreatePrivilege && (
              <td className="p-2">
                <button
                  onClick={() => handleCreate(o.id)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-blue-700"
                >
                  Create
                </button>
              </td>
            )}
            <td className="p-2">
              <Link href={`/patients/${o.id}`}>
                <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                  View
                </button>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    )}
  </table>
      </div>

      {/* Modal tạo new patient */}
      {showNew && (
        <NewPatientModel
          onClose={() => setShowNew(false)}
          onCreated={() => { setShowNew(false); reload(); }}
        />
      )}

    </div>
  );
};

export default PatientTable;
