import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <main className="w-full max-w-md p-6 bg-white rounded shadow">{children}</main>
        </div>
      </body>
    </html>
  );
}
