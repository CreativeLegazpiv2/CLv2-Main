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
      <div className="w-full lg:max-w-[70%] md:max-w-[80%] max-w-[90%] mx-auto py-[10dvh]">
        <motion.div className="w-full flex flex-col justify-center items-center gap-6 text-palette-2" variants={staggerChildren}>
          <motion.div
            className="w-full flex flex-col-reverse md:flex-row gap-4 md:justify-center justify-start items-start"
            variants={childVariants}
          >
            <h1 className="w-fit text-left text-4xl md:text-5xl font-semibold uppercase">
              Creative gallery
            </h1>
          </motion.div>
          <motion.div
            className="w-full flex flex-col gap-8 justify-center items-center"
            variants={childVariants}
          >
            <p className='text-lg font-semibold w-full max-w-2xl text-center'>
              Creative Legazpi is a vibrant hub of creativity that brings together
              a diverse range of artistic and cultural disciplines.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};  

export default GalleryTitle;
