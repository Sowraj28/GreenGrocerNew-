"use client";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import UserNavbar from "@/components/user/Navbar";

const PROTECTED_PATHS = ["/checkout", "/orders", "/profile"];

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;
    const isProtected = PROTECTED_PATHS.some((p) => pathname?.startsWith(p));
    if (isProtected && status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <main>{children}</main>
    </div>
  );
}
