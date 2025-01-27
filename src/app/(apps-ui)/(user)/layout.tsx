"use client";

// app/dashboard/layout.tsx
import React, { ReactNode, useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ButtonChat } from "@/components/buttonChat/buttonChat";
import { AnimatePresence, motion } from "framer-motion";
import { SidebarDrawer } from "@/components/layout/SideBarDrawer";
import { getSession } from "@/services/authservice";

interface LayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isShowChat, setIsShowChat] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const session = await getSession();

        if (session) {
          // User is logged in
          setIsShowChat(true);
        } else {
          // User is not logged in
          setIsShowChat(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Handle error - maybe redirect to login or show error
        setIsShowChat(false);
      }
    };

    checkAuthAndRedirect();
  }, []);

  const handleOpenSideBar = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSideBar = () => {
    setIsSidebarOpen(false);
  };

  const handleOpenChatModal = () => {
    setIsChatModalOpen(true);
  };

  const handleCloseChatModal = () => {
    setIsChatModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
              linkName="signin"
              roundedCustom="lg:rounded-bl-3xl"
              paddingLeftCustom="lg:pl-14"
              buttonName="Logout"
              backgroundColor="bg-palette-5"
              onOpenSidebar={handleOpenSideBar}
            />
            
      <main className="flex-grow">{children}</main>
      {isShowChat && (
        <div className="fixed -bottom-2 -right-1 z-[500] p-4">
          <ButtonChat
            isChatModalOpen={isChatModalOpen}
            onOpenChatModal={handleOpenChatModal}
            onCloseChatModal={handleCloseChatModal}
          />
        </div>
      )}

      <Footer />

      <AnimatePresence>
        {isSidebarOpen && (
          <SidebarDrawer
            isOpen={isSidebarOpen}
            onClose={handleCloseSideBar}
            linkName="profile"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
