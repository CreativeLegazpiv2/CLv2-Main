// app/dashboard/layout.tsx
import React, { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ButtonChat } from "@/components/buttonChat/buttonChat";
interface LayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header
        backgroundColor="bg-secondary-1"
        textColor="text-secondary-2"
        linkName="/apps-ui/profile"
        paddingLeftCustom="pl-0"
        roundedCustom="rounded-bl-none"
      />
      <main className="flex-grow bg-secondary-1">
        {children}

      </main>
      <div className="fixed bottom-10 right-10 z-500">
        <ButtonChat />
      </div>
      <Footer />
      <div className="w-full h-[90dvh] fixed bottom-0 left-0 z-[600] bg-black bg-opacity-50">
        <div className="w-full max-w-md h-full bg-primary-1"></div>
      </div>
    </div>

  );
}