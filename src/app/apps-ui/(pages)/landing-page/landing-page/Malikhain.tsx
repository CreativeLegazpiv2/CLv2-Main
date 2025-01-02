"use client";
import { motion } from "framer-motion";

export const Malikhain = () => {
  // Function to handle Learn More button click
  const handleLearnMoreClick = () => {
    window.location.href = "https://www.dti.gov.ph/archives/2nd-creative-industries-summit-celebrates-malikhaing-pinoy/";
  };

  return (
    <div className="w-full max-w-[90%] mx-auto md:h-dvh h-fit md:py-0 py-12 bg-secondary-1">
      <div className="w-full h-full flex flex-col md:gap-8 gap-4 justify-center items-center">
        <img src="../images/landing-page/malikhain.png" alt="" />
        <p className="text-lg text-secondary-2 text-center w-full md:max-w-[70%]">
          Unveiling at the Philippine Creative Industries Summit, the Malikhaing
          Pinoy Program, an initiative spearheaded by the DTI, is set to
          redefine the landscape of creativity in the Philippines. This
          innovative program is strategically designed to leverage Filipino
          ingenuity as a catalyst for economic growth and recovery. Join us as
          we introduce a transformative initiative dedicated to cultivating a
          resilient and inclusive creative ecosystem, paving the way for a
          dynamic future in the Philippines. Witness the power of creativity at
          the heart of economic progress with the Malikhaing Pinoy Program.
        </p>
        <motion.button
          onClick={handleLearnMoreClick} // Redirect to the specified link
          className="w-full md:max-w-sm max-w-xs py-3 font-medium rounded-lg bg-shade-4 text-2xl text-secondary-1 relative flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Learn More
          <img className="absolute right-10 w-5 h-5" src="../SVG/navigate.svg" alt="" />
        </motion.button>
      </div>
    </div>
  );
};