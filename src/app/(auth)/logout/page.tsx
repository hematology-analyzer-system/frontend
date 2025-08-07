"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiIAM from '@/lib/api/apiIAM';

const LogoutPage = () => {
  const router = useRouter();

  const handleLogout = async () => {
    // 1. Call the logout API endpoint
    // await apiIAM.post('auth/logout')
    await fetch("https://fhard.khoa.email/api/iam/auth/logout", {
      method: "POST",
      credentials: "include", 
    });

    localStorage.clear();

    router.push("/login");
  };


  useEffect(() => {
    handleLogout();
  }, []);

  // Return a simple loading message while the logout process is happening
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Logging out...</p>
    </div>
  );
};

export default LogoutPage;