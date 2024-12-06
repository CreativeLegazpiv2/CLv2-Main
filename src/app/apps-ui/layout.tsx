"use client";

import React, { useEffect, useState, useCallback } from "react";
// import { Header } from "@/components/layout/Header";
// import { Footer } from "@/components/layout/Footer";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/authcontext";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";

const LottieAnimation = dynamic(
  () => import("@/components/animations/_lottieloader"),
  { ssr: false }
);

export default function LoadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoutInProgress, setIsLogoutInProgress] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const pathname = usePathname();
  const handleOpenSideBar = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSideBar = () => {
    setIsSidebarOpen(false);
  };

  // Handle logout state
  const handleLogoutStart = useCallback(() => {
    setIsLogoutInProgress(true);
    setIsLoading(true);
  }, []);

  useEffect(() => {
    window.addEventListener("logoutStart", handleLogoutStart);

    return () => {
      window.removeEventListener("logoutStart", handleLogoutStart);
    };
  }, [handleLogoutStart]);

  // Initial mount effect
  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  // Loading and content effect
  useEffect(() => {
    if (!isLogoutInProgress) {
      const loadTimer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      const handleContentLoaded = () => {
        setContentLoaded(true);
      };

      window.addEventListener("contentLoaded", handleContentLoaded);

      if (pathname !== "/") {
        setContentLoaded(true);
      }

      return () => {
        clearTimeout(loadTimer);
        window.removeEventListener("contentLoaded", handleContentLoaded);
      };
    }
  }, [pathname, isLogoutInProgress]);

  // Reset states on route change
  useEffect(() => {
    if (isLogoutInProgress) {
      setIsLogoutInProgress(false);
      setIsLoading(true);
      setContentLoaded(false);

      const resetTimer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(resetTimer);
    }
  }, [pathname, isLogoutInProgress]);

  // Show loading animation
  if (!mounted || isLoading || isLogoutInProgress) {
    return (
      <main>
        <LottieAnimation />
      </main>
    );
  }

  return (
    <main className="w-full flex flex-col min-h-screen">
      <AuthProvider>
        <main className="flex-grow">{children}</main>
        {contentLoaded && !isLogoutInProgress}
      </AuthProvider>
    </main>
  );
}