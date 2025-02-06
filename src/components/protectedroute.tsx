"use client";

import { useAuth } from '@/context/authcontext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import React from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/signin');
    }
  }, [user, router]);

  if (!user) {
    return null; // or a loading spinner while redirecting
  }

  return <>{children}</>;
};

export default ProtectedRoute;
