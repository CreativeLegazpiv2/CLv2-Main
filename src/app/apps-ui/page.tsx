"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Events } from "./(pages)/landing-page/landing-page/EventsCarousel";
import { GallerySection } from "./(pages)/landing-page/landing-page/GallerySection";
import { Malikhain } from "./(pages)/landing-page/landing-page/Malikhain";
import { Transcribed } from "@/components/reusable-component/Transcribed";
import { Infinite } from "@/components/reusable-component/Infinite";
import { Subscribe } from "@/components/reusable-component/Subscribe";
import { PofconModal } from "@/components/reusable-component/PofconModal";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PofconHeroPage } from "./(pages)/landing-page/landing-page/PofconHeroPage";

interface HomeProps {
  setContentLoaded?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Loader({ setContentLoaded }: HomeProps) {
  const [showPofconModal, setShowPofconModal] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [contentFullyLoaded, setContentFullyLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const websiteContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simplified loading logic
    setTimeout(() => {
      setShowContent(true);
      if (setContentLoaded) {
        setContentLoaded(true);
      }
      window.dispatchEvent(new Event("contentLoaded"));
      setContentFullyLoaded(true);
    }, 1000); // Short delay to ensure everything is ready
  }, [setContentLoaded]);

  return (
    <main
      className={`overflow-x-hidden ${
        !contentFullyLoaded ? "no-scroll" : ""
      }`}
    >
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
        className="website-content w-full min-h-screen pb-[10dvh] relative"
      >
        {showContent && (
          <div className="w-full h-fit">
            <Header />
            <PofconHeroPage setShowPofconModal={setShowPofconModal} />
          </div>
        )}
      </div>
      
      <div className="pt-[15dvh]">
        <Events />
      </div>
      <GallerySection />
      <Malikhain />
      <Transcribed />
      <Infinite />
      <Subscribe />
      <Footer />

      {showPofconModal && (
        <PofconModal setShowPofconModal={setShowPofconModal} />
      )}
    </main>
  );
}