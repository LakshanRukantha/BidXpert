"use client"; // Ensure it's client-side

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

// AuthProvider component for NextAuth
const AuthProvider = ({ children }: { children: ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;
