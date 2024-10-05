// app/dashboard/layout.tsx (or layout.js)

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <div>
      <main className="bg-secondary-1">
        <Header
          backgroundColor="bg-secondary-1"
          textColor="text-secondary-2"
          buttonName="Account"
          paddingLeftCustom="pl-0"
          roundedCustom="rounded-bl-none"
          bgBlur="backdrop-blur-lg"
          bgOpacity="bg-opacity-20"
        />
        {children}
        <Footer />
      </main>
    </div>
  );
}
