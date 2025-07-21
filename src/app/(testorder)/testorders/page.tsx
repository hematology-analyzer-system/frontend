'use client';

import { useEffect, useState } from 'react';
import { fetchTestOrders, fetchPatient, TestOrderRaw, TestOrder } from './fetch';
import TestOrderTable from './components/TestOrderTable';

export default function TestOrderPage() {
  const [data, setData] = useState<TestOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // 1. Lấy mảng TestOrderRaw
        const raws = await fetchTestOrders();

        // 2. Lấy unique patientId list
        const ids = Array.from(new Set(raws.map(o => o.patientId)));

        // 3. Fetch song song tất cả patients
        const patients = await Promise.all(ids.map(id => fetchPatient(id)));
        // Map từ id → Patient
        const patientMap = new Map<number, typeof patients[0]>(
          patients.map(p => [p.id, p])
        );

        // 4. Ghép lại thành TestOrder[] có patient object
        const orders: TestOrder[] = raws.map(o => ({
          ...o,
          patient: patientMap.get(o.patientId)!,
        }));

        setData(orders);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Loading…</div>;
  return <TestOrderTable data={data} />;
}
