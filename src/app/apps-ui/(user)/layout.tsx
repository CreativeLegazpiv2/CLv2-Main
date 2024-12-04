"use client";

// app/dashboard/layout.tsx
import React, { ReactNode, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ButtonChat } from "@/components/buttonChat/buttonChat";
import { AnimatePresence, motion } from "framer-motion";
import { SidebarDrawer } from "@/components/layout/SideBarDrawer";
interface LayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleOpenSideBar = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSideBar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        backgroundColor="bg-secondary-1"
        textColor="text-secondary-2"
        linkName="/apps-ui/profile"
        paddingLeftCustom="pl-0"
        roundedCustom="rounded-bl-none"
        onOpenSidebar={handleOpenSideBar}
      />
      <main className="flex-grow bg-secondary-1">{children}</main>
      <div className="fixed bottom-10 right-10 z-500">
        <ButtonChat />
      </div>
      <Footer />

      <AnimatePresence>
        {isSidebarOpen && (
          <SidebarDrawer
            isOpen={isSidebarOpen} 
            onClose={handleCloseSideBar} 
            linkName="/apps-ui/profile"
            
          />
        )}
      </AnimatePresence>
    </div>
  );
}
