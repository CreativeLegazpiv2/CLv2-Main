"use client";

import { GallerySection } from "@/app/user-interface/landing-page/GallerySection";
import { Malikhain } from "@/app/user-interface/landing-page/Malikhain";
import { Infinite } from "@/components/reusable-component/Infinite";
import { Events } from "@/components/reusable-component/LandingEventsPage";
import { Subscribe } from "@/components/reusable-component/Subscribe";
import { Transcribed } from "@/components/reusable-component/Transcribed";
import { PofconHeroPage } from "../../user-interface/landing-page/PofconHeroPage";
import { PofconModal } from "@/components/reusable-component/PofconModal";
import { useState } from "react";

export default function PofconLandingPage() {
  const [showPofconModal, setShowPofconModal] = useState(false); // Modal state
  return (
    <main className="w-full h-fit text-primary-2">
      <PofconHeroPage setShowPofconModal={setShowPofconModal} /> {/* Pass the state setter */}
      <Events />
      <GallerySection />
      <Malikhain />
      <Transcribed />
      <Infinite />
      <Subscribe />
      {showPofconModal && <PofconModal setShowPofconModal={setShowPofconModal} />}
    </main>
  );
}
