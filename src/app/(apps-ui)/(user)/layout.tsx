"use client";

import React, { ReactNode, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ButtonChat } from "@/components/buttonChat/buttonChat";
import { AnimatePresence } from "framer-motion";
import { SidebarDrawer } from "@/components/layout/SideBarDrawer";
import { AuthProvider, useAuth } from "@/context/authcontext";
import { useRouter } from "next/navigation";
import AuthGuard from "@/context/AuthGuran";

interface LayoutProps {
  children: ReactNode;
}

function DashboardContent({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const { user } = useAuth(); // Get user state

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        linkName="signin"
        roundedCustom="lg:rounded-bl-3xl"
        paddingLeftCustom="lg:pl-14"
        buttonName="Log in"
        backgroundColor="bg-palette-5"
        onOpenSidebar={() => setIsSidebarOpen(true)}
      />

      <main className="flex-grow">{children}</main>

      {user && (
        <div className="fixed -bottom-2 -right-1 z-[500] p-4">
          <ButtonChat
            isChatModalOpen={isChatModalOpen}
            onOpenChatModal={() => setIsChatModalOpen(true)}
            onCloseChatModal={() => setIsChatModalOpen(false)}
          />
        </div>
      )}

      <Footer />

      <AnimatePresence>
        {isSidebarOpen && (
          <SidebarDrawer
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            linkName="profile"
          />
        )}
      </AnimatePresence>
    </div>
  );
}


export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <AuthProvider>
      <AuthGuard>
        <DashboardContent>{children}</DashboardContent>
      </AuthGuard>
    </AuthProvider>
  );
}
