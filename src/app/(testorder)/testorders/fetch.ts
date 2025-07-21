// src/app/testorder/fetch.ts

export interface Patient {
  id: number;
  fullName: string;
  address: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  // ... nếu còn thuộc tính khác
}
export interface Comment {
  id: number;
  createdAt: string;
  modifiedAt: string;
  content: string;
  resultId?: number;
  testOrderId?: number;
}
export interface Result {
  resultId:   number;
  reviewed:   boolean;
  details:    ResultDetails;
  comments:   Comment[];
  testOrderId:number;
}
export interface TestOrderRaw {
  testId:    number;
  runBy:     string;
  runAt:     string;
  status:    string;
  results:   any[];     // giữ nguyên hoặc định nghĩa thêm
  comments:  any[];
  patientId: number;
}
export interface ResultDetails {
  id: number;
  parameterName: string;
  value: string;
  unit: string;
  rangeMin: number;
  rangeMax: number;
  resultId: number;
}

// Mỗi TestOrder gồm thêm object Patient
export interface TestOrder extends TestOrderRaw {
  patient: Patient;
}

export const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082/testorder';

export async function fetchTestOrders(): Promise<TestOrderRaw[]> {
  const res = await fetch(`${BASE}/api/test-orders`);
  if (!res.ok) throw new Error('Fetch test-orders failed');
  return res.json();
}



export async function fetchTestOrderById(id: number): Promise<TestOrderRaw> {
  const res = await fetch(`${BASE}/api/test-orders/${id}`);
  if (!res.ok) throw new Error('Fetch test-order failed');
  return res.json();
}

export async function fetchPatient(id: number): Promise<Patient> {
  const res = await fetch(`${BASE}/patients/${id}`);
  if (!res.ok) throw new Error(`Fetch patient ${id} failed`);
  return res.json();
}
