"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from "@iconify/react/dist/iconify.js";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.8
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const childVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

export const GalleryTitle = () => {
  return (
    <motion.div
      className="w-full pt-[5dvh] h-fit text-primary-2"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className="w-full lg:max-w-[70%] md:max-w-[80%] max-w-[90%] mx-auto">
        <motion.div className="w-full flex flex-col gap-6" variants={staggerChildren}>
          <motion.div
            className="w-full flex flex-col-reverse md:flex-row gap-4 md:justify-between justify-start items-start"
            variants={childVariants}
          >
            <h1 className="md:w-full w-fit text-left text-4xl md:text-5xl font-semibold uppercase">
              BROWSER GALLERY
            </h1>
          </motion.div>
          <motion.div
            className="w-full flex flex-col gap-8 justify-start items-start"
            variants={childVariants}
          >
            <TitleDetails />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const TitleDetails = () => {
  return (
    <motion.div
      className="flex flex-col gap-8 items-start justify-start"
      variants={staggerChildren}
    >
      <motion.h1
        className="w-full text-left max-w-sm text-3xl md:text-5xl font-black uppercase leading-tight"
        variants={childVariants}
      >
        PORTFOLIO
      </motion.h1>
    </motion.div>
  );
};

export default GalleryTitle;
