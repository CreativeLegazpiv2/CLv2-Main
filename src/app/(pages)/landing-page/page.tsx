"use client";

import { GallerySection } from "@/app/user-interface/landing-page/GallerySection";
import { HeroPage } from "@/app/user-interface/landing-page/HeroPage";
import { Malikhain } from "@/app/user-interface/landing-page/Malikhain";
import { Events } from "@/components/reusable-component/LandingEventsPage";
import { Infinite } from "@/components/reusable-component/Infinite";
import { Subscribe } from "@/components/reusable-component/Subscribe";
import { Transcribed } from "@/components/reusable-component/Transcribed";
import { useState } from "react";
import { PofconModal } from "@/components/reusable-component/PofconModal";


export default function LandingPage() {
  const [showPofconModal, setShowPofconModal] = useState(false); // Modal state
    return (
      <main className="w-full h-fit text-primary-2">
        <HeroPage setShowPofconModal={setShowPofconModal} />
        {showPofconModal && <PofconModal setShowPofconModal={setShowPofconModal} />}
        {/* <CreativeDirectory /> */}
        <Events />
        <GallerySection />
        <Malikhain />
        <Transcribed />
        <Infinite />
        <Subscribe />
      </main>
    );
  }