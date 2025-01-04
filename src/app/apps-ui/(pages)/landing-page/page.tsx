"use client";

import { Infinite } from "@/components/reusable-component/Infinite";
import { Subscribe } from "@/components/reusable-component/Subscribe";
import { Transcribed } from "@/components/reusable-component/Transcribed";
import { useState } from "react";
import { PofconModal } from "@/components/reusable-component/PofconModal";
import { Events } from "./landing-page/EventsCarousel";
import { HeroPage } from "./landing-page/HeroPage";
import { Malikhain } from "./landing-page/Malikhain";
import { GallerySection } from "./landing-page/GallerySection";

export default function LandingPage() {
  const [showPofconModal, setShowPofconModal] = useState(false); // Modal state

  return (
    <main className="w-full h-fit text-primary-2 relative">
      {/* Hero Section */}
      <HeroPage setShowPofconModal={setShowPofconModal} />

      {/* Pofcon Modal */}
      {showPofconModal && (
        <div className="fixed inset-0 z-[1002]">
          <PofconModal setShowPofconModal={setShowPofconModal} />
        </div>
      )}

      {/* Events Section */}
      <Events />

      {/* Other Sections */}
      <GallerySection />
      <Malikhain />
      <Transcribed />
      <Infinite />
      <Subscribe />
    </main>
  );
}