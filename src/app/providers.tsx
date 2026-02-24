"use client";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <SessionProvider
      basePath={isAdmin ? "/api/auth/admin" : "/api/auth/user"}
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
}
