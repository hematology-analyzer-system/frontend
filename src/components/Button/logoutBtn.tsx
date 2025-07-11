"use client";

import React from "react";
import { redirect, useRouter } from "next/navigation";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("http://localhost:8080/iam/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    localStorage.clear();

    router.push("/login");
    window.location.reload();
    // redirect("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition"
    >
      <ArrowRightOnRectangleIcon className="h-5 w-5" />
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;
