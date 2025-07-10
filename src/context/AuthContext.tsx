// context/AuthContext.tsx
'use client';

import React, { createContext, useContext } from 'react';

type Role = 'admin' | 'doctor' | 'staff';

const mockTokenPayload = {
  fullName: 'Nguyen Huu Thanh',
  role: 'admin' as Role,
};

const AuthContext = createContext(mockTokenPayload);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider value={mockTokenPayload}>
      {children}
    </AuthContext.Provider>
  );
};
