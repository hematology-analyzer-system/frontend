import React from "react";
import AppLayout from "@/components/Layout/AppLayout";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout>{children}</AppLayout>
  );
}