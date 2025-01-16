"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const Buttons = () => {
  return (
    <div className="w-full gap-4 flex items-center">
      <motion.button 
        className="w-36 tracking-wider rounded-full py-2 font-semibold bg-palette-5 text-palette-3 uppercase"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          duration: 0.5,
          type: "spring",
          bounce: 0.4
        }}
      >
        explore
      </motion.button>
      <motion.button 
        className="w-36 tracking-wider rounded-full py-2 font-semibold bg-palette-3 text-palette-5 uppercase"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          duration: 0.5,
          delay: 0.2,
          type: "spring",
          bounce: 0.4
        }}
      >
        register
      </motion.button>
    </div>
  );
};

export const CreativeDirectory = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  return (
    <div className="w-full md:h-dvh h-fit md:py-0 py-[10dvh] md:min-h-screen bg-palette-2 overflow-hidden">
      <motion.div 
        ref={ref}
        className="w-full h-full flex md:flex-row flex-col gap-12 justify-center items-center md:max-w-[70%] max-w-[90%] mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div 
          className="w-full h-full md:max-h-[70%] md:max-w-[40%] relative"
          variants={itemVariants}
        >
          <motion.img
            className="absolute md:-top-20 md:-right-20 -top-10 -right-10 md:scale-75 h-32 w-32 z-10"
            src="/images/landing-page/icon.png"
            alt=""
            initial={{ rotate: -10, scale: 0.5 }}
            animate={{ rotate: 0, scale: 0.75 }}
            transition={{
              type: "spring",
              bounce: 0.4,
              duration: 1
            }}
          />
          <motion.img
            className="w-full h-full md:min-h-fit min-h-[28rem] object-cover rounded-[2rem]"
            src="/images/landing-page/creatives.png"
            alt=""
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        </motion.div>
        
        <motion.div 
          className="w-full h-full max-h-[70%] md:max-w-[40%] flex flex-col px-1 justify-center items-start gap-6 text-palette-5"
          variants={itemVariants}
        >
          <motion.div 
            className="space-y-2"
            variants={containerVariants}
          >
            <motion.h1 
              className="title text-4xl font-normal"
              variants={itemVariants}
            >
              CREATIVE DIRECTORY
            </motion.h1>
            <motion.h2 
              className="text-5xl font-bold tracking-tight"
              variants={itemVariants}
            >
              EXPLORE, CONNECT AND NETWORK
            </motion.h2>
            <motion.p 
              className="text-xl"
              variants={itemVariants}
            >
              Creative Legazpi is a transformative initiative dedicated to
              cultivating a resilient and inclusive creative ecosystem, paving the
              way for a dynamic future in the Philippines.
            </motion.p>
          </motion.div>
          <Buttons />
        </motion.div>
      </motion.div>
    </div>
  );
};