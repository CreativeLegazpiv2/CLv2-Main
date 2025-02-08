"use client";
import React from "react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import animationData from "../../../public/load.json";

// Enhanced Clouds Component
const Clouds = () => (
  <div className="absolute inset-0 overflow-hidden">
    {[...Array(3)].map((_, i) => {
      const speed = 15 + Math.random() * 10;
      return (
        <motion.div
          key={i}
          className="absolute w-48 h-12 bg-palette-5/30 rounded-full"
          style={{
            top: `${Math.random() * 80}vh`,
            left: `-${Math.random() * 50}%`,
            filter: "blur(15px)",
          }}
          animate={{
            x: ["calc(-50%)", "calc(100vw + 50%)"],
          }}
          transition={{
            x: {
              duration: speed,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        />
      );
    })}
  </div>
);

// Pulsating Background
const PulsatingBackground = () => (
  <motion.div
    className="absolute inset-0 bg-gradient-to-r from-palette-5/10 via-palette-6/5 to-palette-5/10"
    animate={{
      opacity: [0.5, 0.8, 0.5],
      scale: [1, 1.05, 1],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

export default function Custom404() {
  return (
    <div className="relative flex items-center justify-center w-full h-screen bg-palette-4  overflow-hidden">
      {/* Background Effects */}


      {/* Central Animation */}
      <div className="relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Lottie
            animationData={animationData}
            loop
            className="w-80 h-80 md:w-96 md:h-96"
          />
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.div
        className="absolute bottom-10 text-white text-lg font-medium"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Loading...
      </motion.div>
    </div>
  );
}