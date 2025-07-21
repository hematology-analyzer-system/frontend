// src/app/testorder/components/TestOrderTable.tsx
'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import { TestOrder } from '../fetch';
import Header from './Header';
import FilterBar from './FilterBar';
import NewTestOrderModal from './NewTestOrderModel';
import OldTestOrderModal from './OldTestOrderModel';

interface Props {
  data: TestOrder[];
  reload: () => void;
}

const TestOrderTable: FC<Props> = ({ data, reload }) => {
  const [showNew, setShowNew] = useState(false);
  const [showOld, setShowOld] = useState(false);

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header với 2 nút New/Old */}
      <Header onNew={() => setShowNew(true)} onOld={() => setShowOld(true)} />

      {/* Filter Bar */}
      <FilterBar onSearch={() => {}} onSort={() => {}} onFilter={() => {}} />

      {/* Table */}
      <div className="p-4 overflow-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2"><input type="checkbox" /></th>
              {['Patient name','Age','Gender','Phone','Status','Created','Run by','View'].map(h => (
                <th key={h} className="p-2 text-left text-sm font-medium text-gray-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(o => (
              <tr key={o.testId} className="border-t hover:bg-green-50">
                <td className="p-2"><input type="checkbox" /></td>
                <td className="p-2">{o.patient.fullName}</td>
                <td className="p-2">
                  {new Date().getFullYear() - new Date(o.patient.dateOfBirth).getFullYear()}
                </td>
                <td className="p-2">{o.patient.gender}</td>
                <td className="p-2">{o.patient.phone}</td>
                <td className="p-2">{o.status}</td>
                <td className="p-2">{new Date(o.runAt).toLocaleDateString()}</td>
                <td className="p-2">{o.runBy}</td>
                <td className="p-2">
                  <Link href={`/testorders/${o.testId}`}>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                      View
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal tạo new patient */}
      {showNew && (
        <NewTestOrderModal
          onClose={() => setShowNew(false)}
          onCreated={() => { setShowNew(false); reload(); }}
        />
      )}

      {/* Modal tạo old patient */}
      {showOld && (
        <OldTestOrderModal
          onClose={() => setShowOld(false)}
          onCreated={() => { setShowOld(false); reload(); }}
        />
      )}
    </div>
  );
};

export default TestOrderTable;
