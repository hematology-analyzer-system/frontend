"use client";

import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

interface Role {
  code: string;
  name: string;
  id: number;
}

interface TokenPayload {
  sub: string;
  roles: Role[];
  status: string;
  exp: number;
  iat: number;
}

export const useAuth = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      const decoded = jwtDecode<TokenPayload>(token);
      setRole(decoded.roles?.[0]?.code); // Only use first role
      
    }
  }, []);
  return { role };
};
