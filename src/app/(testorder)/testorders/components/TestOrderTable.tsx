// src/app/testorder/components/TestOrderTable.tsx
'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import { TestOrder } from '../fetch';
import Header from './Header';

import NewTestOrderModal from './NewTestOrderModel';
// import OldTestOrderModal from './OldTestOrderModel';

interface Props {
  data: TestOrder[];
  reload: () => void;
}
function extractIdNum(runBy: string | null): string | null {
  if (!runBy) {
    return null
  }
  const m = runBy.match(/Email:\s*([^|]+)/);
  return m ? m[1] : null;
}
const TestOrderTable: FC<Props> = ({ data, reload }) => {
  const [showNew, setShowNew] = useState(false);
  // const [showOld, setShowOld] = useState(false);
  

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header với 2 nút New/Old */}
      <Header onNew={() => setShowNew(true)} />

      {/* Bảng Test Orders */}
      <div className="p-4 overflow-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              {/* <th className="p-2"><input type="checkbox" /></th> */}
              {['Patient name','Age','Gender','Phone','Status','Create by','Run date','Run by','View'].map(h => (
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
      <td colSpan={9} className="p-8 text-center text-gray-500">
        No data
      </td>
    </tr>
  </tbody>
) : (
  <tbody>
    {data.map(o => (
      <tr key={o.id} className="border-t hover:bg-green-50">
        <td className="p-2">{o.fullName}</td>
        <td className="p-2">{o.age}</td>
        <td className="p-2">{o.gender}</td>
        <td className="p-2">{o.phone}</td>
        <td
          className={`p-2 ${
            o.status.toLowerCase() === 'completed'
              ? 'text-green-600'
              : o.status.toLowerCase() === 'reviewed'
                ? 'text-blue-600'
                : 'text-orange-500'
          }`}
        >
          {o.status.toLowerCase()}
        </td>
        <td className="p-2">{extractIdNum(o.createdBy) || '-'}</td>
        <td className="p-2">{new Date(o.runAt).toLocaleDateString()}</td>
        <td className="p-2">{extractIdNum(o.runBy) || '-'}</td>
        <td className="p-2">
          <Link href={`/testorders/${o.id}`}>
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
        <NewTestOrderModal
          onClose={() => setShowNew(false)}
          onCreated={() => { setShowNew(false); reload(); }}
        />
      )}

      {/* Modal tạo old patient
      {showOld && (
        <OldTestOrderModal
          onClose={() => setShowOld(false)}
          onCreated={() => { setShowOld(false); reload(); }}
        />
      )} */}
    </div>
  );
};

export default TestOrderTable;
