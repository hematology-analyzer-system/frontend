import React from "react";
import AppLayoutSearch from "@/components/Layout/AppLayoutSearch";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppLayoutSearch>{children}</AppLayoutSearch>
      </body>
    </html>
  );
}