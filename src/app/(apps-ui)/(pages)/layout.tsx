"use client";

import { ButtonChat } from "@/components/buttonChat/buttonChat";
// app/layout.tsx
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SidebarDrawer } from "@/components/layout/SideBarDrawer";
import Infinite from "@/components/reusable-component/Infinite";
import { getSession } from "@/services/authservice";
import { AnimatePresence } from "framer-motion";
import React, { ReactNode, useEffect, useState } from "react";
interface LayoutProps {
  children: ReactNode;
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <main className="w-full flex flex-col h-fit">
      <Header
        linkName="signin"
        roundedCustom="lg:rounded-bl-3xl"
        paddingLeftCustom="lg:pl-14"
        buttonName="Log in"
        backgroundColor="bg-palette-5"
        onOpenSidebar={handleOpenSideBar}
      />
      
      <main className="flex-grow w-full">{children}</main>

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
      {isShowChat && (
        <div className=" z-[500]">
          <ButtonChat
            isChatModalOpen={isChatModalOpen}
            onOpenChatModal={handleOpenChatModal}
            onCloseChatModal={handleCloseChatModal}
          />
        </div>
      )}
    </main>
  );
}