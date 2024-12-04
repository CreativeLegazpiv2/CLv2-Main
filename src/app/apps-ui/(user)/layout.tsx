"use client";

// app/dashboard/layout.tsx
import React, { ReactNode, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ButtonChat } from "@/components/buttonChat/buttonChat";
import { AnimatePresence, motion } from "framer-motion";
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            onClick={handleCloseSideBar}
            className="w-full h-[90dvh] fixed bottom-0 left-0 z-[600] bg-black bg-opacity-50"
          >
            <motion.div
            onClick={(e) => e.stopPropagation()}
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full md:max-w-md max-w-sm h-full bg-primary-1 relative"
            >
              <button
                onClick={handleCloseSideBar}
                className="absolute top-4 right-4 text-white"
              >
                Close
              </button>
              {/* Sidebar content goes here */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
