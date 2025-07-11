import { fetchPatientById } from "@/lib/api/apiPatient";
import { PatientInfoCard } from "@/components/Card/PatientInfoCard";

interface Props {
  params: { id: string };
}

export default async function PatientPage({ params }: Props) {
  const patient = await fetchPatientById(params.id); // SSR fetch

  return (
    <div className="max-w-5xl mx-auto p-6">
      <PatientInfoCard patient={patient} />
    </div>
  );
}
