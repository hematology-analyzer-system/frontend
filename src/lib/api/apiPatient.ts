import axios from 'axios';
import { Patient } from '@/type/Patient';

const apiPatient = axios.create({
  baseURL : "http://localhost:8081/patient",
  withCredentials : true
});

export default apiPatient;

export async function fetchPatientById(id: string): Promise<Patient> {
  const res = await fetch(`http://localhost:8081/patient/patients/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch patient data");
  }

  return res.json();
}
