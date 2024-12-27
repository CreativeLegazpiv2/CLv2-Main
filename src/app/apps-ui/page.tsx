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

export default function Home() {
  const [showPofconModal, setShowPofconModal] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const websiteContentRef = useRef<HTMLDivElement>(null);

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
          <Header />
          <PofconHeroPage setShowPofconModal={setShowPofconModal} />
        </div>
      </div>

      <Events />

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
