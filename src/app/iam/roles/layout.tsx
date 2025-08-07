// app/patients/layout.tsx

import AppLayout from "@/components/Layout/AppLayout";
import React from 'react';

// This layout will wrap all pages within the /patients segment
export default function PatientsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
}