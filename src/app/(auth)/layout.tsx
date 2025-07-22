// File: src/app/(auth)/layout.tsx

import React from "react";
import { Toaster } from 'react-hot-toast';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-green-50 to-blue-100 min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          {children}
          <Toaster position="top-right" reverseOrder={false} />
        </div>
      </body>
    </html>
  );
}
