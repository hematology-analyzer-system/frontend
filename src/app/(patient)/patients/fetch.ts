export interface Patient {
  id: number;
  fullName: string;
  address: string;
  gender: "MALE" | "FEMALE"|"OTHER";
  dateOfBirth: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  // ... nếu còn thuộc tính khác
}
export interface PageFilter<T> {
  content:  T[];
  last: boolean,
  totalElements: number,
  totalPages: number,
  first: boolean,
  size: number,
  number: number, 
}

export const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/patient';

export async function fetchPatientId(id: Number): Promise<Patient> {
  const res = await fetch(`${BASE}/patients/${id}`, {
    method: 'GET',
    credentials: 'include',           // ◀️ gửi cookie kèm theo
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
  const text = await res.text();             // grab the raw response body
  console.error('fetchPatient error:', res.status, text);
  throw new Error(`Fetch failed: ${res.status} — ${text}`);
};
  return res.json();
}

export async function fetchPatient(): Promise<PageFilter<Patient>> {
  const res = await fetch(`${BASE}/patients`, {
    method: 'GET',
    credentials: 'include',            // ◀️ gửi cookie kèm theo
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
  const text = await res.text();             // grab the raw response body
  console.error('fetchPatient error:', res.status, text);
  throw new Error(`Fetch failed: ${res.status} — ${text}`);
}
  return res.json();
}
export async function fetchPatientFilter(): Promise<PageFilter<Patient>> {
  const res = await fetch(`${BASE}/patients/filter`, {
    method: 'GET',
    credentials: 'include',            // ◀️ gửi cookie kèm theo
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
  const text = await res.text();             // grab the raw response body
  console.error('fetchPatient error:', res.status, text);
  throw new Error(`Fetch failed: ${res.status} — ${text}`);
}
  return res.json();
}