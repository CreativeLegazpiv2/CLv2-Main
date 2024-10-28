"use client";


import { Infinite } from "@/components/reusable-component/Infinite";

import { Subscribe } from "@/components/reusable-component/Subscribe";
import { Transcribed } from "@/components/reusable-component/Transcribed";
import { PofconModal } from "@/components/reusable-component/PofconModal";
import { useState } from "react";
import { GallerySection } from "../landing-page/landing-page/GallerySection";
import { Malikhain } from "../landing-page/landing-page/Malikhain";
import { PofconHeroPage } from "../landing-page/landing-page/PofconHeroPage";
import { Events } from "../landing-page/landing-page/EventsCarousel";

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
