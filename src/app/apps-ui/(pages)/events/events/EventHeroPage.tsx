"use client";

import { Subscribe } from "@/components/reusable-component/Subscribe";
import { motion } from "framer-motion";

export const EventHeroPage = () => {
  return (
    <div className="relative w-full h-dvh bg-[url('/images/events/hero.jpg')] bg-cover bg-no-repeat bg-center">
      {/* Gradient overlay for a modern look */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>

      {/* Contents of the page here */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-white font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight mb-8"
          >
            Mastering 2D Digital Character Animation
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="mb-12"
          >
            <HeroButton />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="w-full max-w-md mx-auto pl-14"
          >
            <Subscribe
              textColor="text-white"
              bgColor="bg-transparent"
              placeHolder="Enter your email"
              borderColor="border-white"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const HeroButton = () => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="w-fit px-8 py-3 bg-transparent text-white text-lg uppercase border-2 border-white rounded-full hover:bg-white hover:text-black transition-colors duration-300"
    >
      {/* This must be a dynamic date for the button name */}
      January 11-25, 2025
    </motion.button>
  );
};