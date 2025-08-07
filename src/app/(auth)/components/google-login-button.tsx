// app/(auth)/google-login-button.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleLoginButton() {
  const router = useRouter();

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: "<YOUR_GOOGLE_CLIENT_ID>",
      callback: async (response: any) => {
        const res = await fetch("http://localhost:8080/iam/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential: response.credential }),
        });

        const data = await res.json();
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      },
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-signin")!,
      { theme: "outline", size: "large" }
    );
  }, []);

  return <div id="google-signin"></div>;
}
