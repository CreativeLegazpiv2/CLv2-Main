'use client';

// app/layout.tsx
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SidebarDrawer } from "@/components/layout/SideBarDrawer";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleOpenSideBar = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSideBar = () => {
    setIsSidebarOpen(false);
  };
  
  return (
    <main className="w-full flex flex-col min-h-screen">
      <Header
        linkName="/apps-ui/signin"
        roundedCustom="lg:rounded-bl-3xl"
        paddingLeftCustom="lg:pl-14"
        buttonName="Log in"
        onOpenSidebar={handleOpenSideBar}
      />
      <main className="flex-grow w-full">{children}</main>
      <Footer />
      <AnimatePresence>
        {isSidebarOpen && (
          <SidebarDrawer
            isOpen={isSidebarOpen} 
            onClose={handleCloseSideBar} 
            linkName="/apps-ui/profile"
            backgroundColor="bg-primary-1"
            textColor="text-secondary-2/60"
          />
        )}
      </AnimatePresence>
    </main>
  );
}
