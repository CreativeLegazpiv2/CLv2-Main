"use client";

import { Infinite } from "@/components/reusable-component/Infinite";
import { Subscribe } from "@/components/reusable-component/Subscribe";
import { Transcribed } from "@/components/reusable-component/Transcribed";
import { PofconModal } from "@/components/reusable-component/PofconModal";
import { useEffect, useRef, useState } from "react";
import { useAnimation, useInView, motion } from "framer-motion";
import { CreativeDirectory } from "./landing-page/CreativeDirectory";
import { Events } from "./landing-page/EventsCarousel";
import { GallerySection } from "./landing-page/GallerySection";
import { Hero } from "./landing-page/Hero";
import { Malikhain } from "./landing-page/Malikhain";


export default function PofconLandingPage() {
  const [showPofconModal, setShowPofconModal] = useState(false); // Modal state

  return (
    <main className="w-full h-fit text-primary-2">
      {/* <PofconHeroPage setShowPofconModal={setShowPofconModal} />{" "} */}
      {/* Pass the state setter */}
      <Hero />
      <CreativeDirectory />

      <ScrollAnimationSection>
        <Events />
      </ScrollAnimationSection>
      <ScrollAnimationSection>
        <GallerySection />
      </ScrollAnimationSection>
      <ScrollAnimationSection>
        <Malikhain />
      </ScrollAnimationSection>
      <Infinite />
      <Transcribed />

      {showPofconModal && (
        <PofconModal setShowPofconModal={setShowPofconModal} />
      )}
    </main>
  );
}

const ScrollAnimationSection: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
