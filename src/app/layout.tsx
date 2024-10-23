"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/context/authcontext';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import LottieAnimation from '@/components/animations/_lottieloader';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoutInProgress, setIsLogoutInProgress] = useState(false);
  const pathname = usePathname();

  // Handle logout state
  const handleLogoutStart = useCallback(() => {
    setIsLogoutInProgress(true);
    setIsLoading(true);
  }, []);

  useEffect(() => {
    window.addEventListener('logoutStart', handleLogoutStart);
    
    return () => {
      window.removeEventListener('logoutStart', handleLogoutStart);
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

      window.addEventListener('contentLoaded', handleContentLoaded);

      if (pathname !== '/') {
        setContentLoaded(true);
      }

      return () => {
        clearTimeout(loadTimer);
        window.removeEventListener('contentLoaded', handleContentLoaded);
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
      <html lang="en">
        <body>
          <LottieAnimation />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          {contentLoaded && !isLogoutInProgress && (
            <Header
              linkName="/signin"
              roundedCustom="lg:rounded-bl-3xl"
              paddingLeftCustom="lg:pl-14"
              buttonName="Log in"
            />
          )}
          <main className="flex-grow">
            {children}
          </main>
          {contentLoaded && !isLogoutInProgress && <Footer />}
        </AuthProvider>
      </body>
    </html>
  );
}