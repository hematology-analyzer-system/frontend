import AppLayout from "@/components/Layout/AppLayout";

export default function PatientsPage() {
  return <div>This is the patient page content</div>;
}

PatientsPage.getLayout = function getLayout(page: React.ReactNode) {
  return <AppLayout>{page}</AppLayout>;
};
