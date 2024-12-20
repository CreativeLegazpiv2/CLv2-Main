"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { AuthProvider } from "@/context/authcontext";

const LottieAnimation = dynamic(
  () => import("@/components/animations/_lottieloader"),
  { ssr: false }
);

export default function LoadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Trigger loading on route change
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000); // Customize delay

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [pathname]);

  if (isLoading) {
    return (
      <main className="w-full h-screen flex justify-center items-center">
        <LottieAnimation />
      </main>
    );
  }

  return (
    <main className="w-full flex flex-col min-h-screen">
      <AuthProvider>
        <main className="flex-grow">{children}</main>
      </AuthProvider>
    </main>
  );
}
