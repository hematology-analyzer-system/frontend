import axios from 'axios';
import { Patient } from '@/type/Patient';

const apiPatient = axios.create({
  baseURL : "https://fhard.khoa.email/api/patients",
  withCredentials : true
});

export default apiPatient;

export async function fetchPatientById(id: string): Promise<Patient> {
  const res = await fetch(`https://fhard.khoa.email/api/patients/patients/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch patient data");
  }

  return res.json();
}
