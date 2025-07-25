// src/app/testorder/fetch.ts
// import Cookies from 'js-cookie';
export interface Patient {
  id: number;
  fullName: string;
  address: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  // ... nếu còn thuộc tính khác
}
export interface Comment {
  id: number;
  content:   string;
  createdBy: string;
  updateBy:  string | null;
  createdAt: string;
}
export interface CommentTO {
  id: number;
  content:   string;
  createdBy: string;
  updateBy:  string | null;
  createdAt: string;
}
export interface Result {
  id:   number;
  reviewed:   boolean;
  updateBy:      string | null;
  detailResults:    ResultDetails[];
  comment_result:   Comment[];
  
  // testOrderId:number;
}
export interface TestOrderRaw {
  testId: number;
  status:     string;
  updateBy:   string | null;
  runBy:      string | null;
  runAt:      string;
  results:    {
    id:            number;
    reviewed:      boolean;
    updateBy:      string | null;
    detailResults: ResultDetails[];
    comment_result: Comment[];
  }[];
  comments: {
    id: number;
    content:  string;
    createdBy:string;
    updateBy: string | null;
    createdAt: string ;
  }[];
  fullName:    string;
  address:     string;
  gender:      string;
  dateOfBirth: string;
  phone:       string;
}

// Kết quả Paging từ API
export interface PageResponse<T> {
  list:          T[];
  totalElements: number;
  totalPages:    number;
  currentPage:   number;
  hasNext:       boolean;
  hasPrevious:   boolean;
  // ... các trường khác nếu cần
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
export interface ResultDetails {
  id: number;
  paramName: string;
  value: number;
  unit: string;
  rangeMin: number;
  rangeMax: number;
  resultId: number;
}

// Mỗi TestOrder gồm thêm object Patient
export interface TestOrder {
  id: number;
  fullName:    string;
  age: number;
  gender:      string;
  phone:       string;
  status:     string;
  createdBy:   string | null;
  runBy:      string | null;
  runAt:      string;
  
}

export const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082/testorder';

export async function fetchTestOrders(
): Promise<PageResponse<TestOrderRaw>> {
  const res = await fetch(
    `${BASE}/testorder/search`,
    {
      credentials: 'include',            // nếu bạn dùng cookie auth
      headers: {
    'Content-Type': 'application/json'
  }
    }
  );
  if (!res.ok) {
  const text = await res.text();             // grab the raw response body
  console.error('fetchTestOrders error:', res.status, text);
  throw new Error(`Fetch failed: ${res.status} — ${text}`);
}
return res.json();
}


export async function fetchTestOrderById(id: number): Promise<TestOrderRaw> {
  const res = await fetch(`${BASE}/testorder/${id}`, {
    method: 'GET',
    credentials: 'include',            // ◀️ gửi cookie kèm theo
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) throw new Error('Fetch test-order failed');
  return res.json();
}

export async function fetchPatient(id: number): Promise<Patient> {
  const res = await fetch(`${BASE}/patients/${id}`, {
    method: 'GET',
    credentials: 'include',            // ◀️ gửi cookie kèm theo
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) throw new Error(`Fetch patient ${id} failed`);
  return res.json();
}
