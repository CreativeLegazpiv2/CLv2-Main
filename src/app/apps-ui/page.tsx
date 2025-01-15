"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Events } from "./(pages)/landing-page/landing-page/EventsCarousel";
import { GallerySection } from "./(pages)/landing-page/landing-page/GallerySection";
import { Malikhain } from "./(pages)/landing-page/landing-page/Malikhain";
import { Transcribed } from "@/components/reusable-component/Transcribed";
import { Infinite } from "@/components/reusable-component/Infinite";
import { Subscribe } from "@/components/reusable-component/Subscribe";
import { PofconModal } from "@/components/reusable-component/PofconModal";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PofconHeroPage } from "./(pages)/landing-page/landing-page/PofconHeroPage";
import { AnimatePresence } from "framer-motion";
import { SidebarDrawer } from "@/components/layout/SideBarDrawer";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPofconModal, setShowPofconModal] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const websiteContentRef = useRef<HTMLDivElement>(null);
  const handleOpenSideBar = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSideBar = () => {
    setIsSidebarOpen(false);
  };
  return (
    <main className="overflow-x-hidden">
      <section ref={heroRef} className="hero">
        <div className="hero-imgs">
          <Image
            src="/intro/img7.png"
            alt="Hero image"
            layout="fill"
            objectFit="cover"
            className="imahe"
          />
        </div>
      </section>

      <div
        ref={websiteContentRef}
        className="website-content w-full min-h-screen relative"
      >
        <div className="w-full h-fit">
          <Header
            linkName="/apps-ui/signin"
            roundedCustom="lg:rounded-bl-3xl"
            backgroundColor="bg-palette-3"
            paddingLeftCustom="lg:pl-14"
            buttonName="Log in"
            onOpenSidebar={handleOpenSideBar}
          />
          <PofconHeroPage setShowPofconModal={setShowPofconModal} />
        </div>
      </div>
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

      <Events />

      <GallerySection />
      <Malikhain />
      <Transcribed />
      <Infinite />
      <Footer />

      {showPofconModal && (
        <PofconModal setShowPofconModal={setShowPofconModal} />
      )}
    </main>
  );
}
