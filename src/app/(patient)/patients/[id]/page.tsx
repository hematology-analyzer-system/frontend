'use client';
import { fetchPatientId, Patient } from "../fetch";
import { PatientInfoCard } from "../components/PatientInfoCard";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function PatientDetailPage() { // Remove 'async' here
  const { id } = useParams();
  const [pageData, setPageData] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return; // Don't fetch if id is not available
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const patientIdNum = Number(id);
        
        if (isNaN(patientIdNum)) {
          throw new Error("Invalid Patient ID");
        }
        
        const raw: Patient = await fetchPatientId(patientIdNum);
        setPageData(raw);
      } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : "Failed to load patient data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]); // Only depend on id

  if (loading) {
    return <div className="p-4 text-center">Loading…</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  if (!pageData) {
    return <div className="p-4 text-center text-red-600">No patient data found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <PatientInfoCard patient={pageData} />
    </div>
  );
}