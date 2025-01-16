"use client";

import { Infinite } from "@/components/reusable-component/Infinite";
import { Subscribe } from "@/components/reusable-component/Subscribe";
import { Transcribed } from "@/components/reusable-component/Transcribed";
import { PofconModal } from "@/components/reusable-component/PofconModal";
import { useState } from "react";
import { Malikhain } from "../landing-page/landing-page/Malikhain";
import { PofconHeroPage } from "../landing-page/landing-page/PofconHeroPage";
import { Events } from "../landing-page/landing-page/EventsCarousel";
import { GallerySection } from "../landing-page/landing-page/GallerySection";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

export default function PofconLandingPage() {
  const [showPofconModal, setShowPofconModal] = useState(false); // Modal state

  return (
    <main className="w-full h-fit text-primary-2">
      <PofconHeroPage setShowPofconModal={setShowPofconModal} />{" "}
      {/* Pass the state setter */}
      <ScrollAnimationSection>
        <Events />
      </ScrollAnimationSection>
      <ScrollAnimationSection>
        <GallerySection />
      </ScrollAnimationSection>
      <ScrollAnimationSection>
        <Malikhain />
      </ScrollAnimationSection>
        <Transcribed />
        <Infinite />   

      {showPofconModal && (
        <PofconModal setShowPofconModal={setShowPofconModal} />
      )}
    </main>
  );
}

const ScrollAnimationSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
    >
      {children}
    </motion.div>
  );
};