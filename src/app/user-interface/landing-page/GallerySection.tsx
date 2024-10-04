"use client";

import { motion, AnimatePresence, wrap } from "framer-motion";
import Image from 'next/image';
import { useState } from "react";

const sliderVariants = {
  incoming: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    scale: 1.2,
    opacity: 0
  }),
  active: { x: 0, scale: 1, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    scale: 1,
    opacity: 0.2
  })
};

const sliderTransition = {
  duration: 1,
  ease: [0.56, 0.03, 0.12, 1.04]
};

const images = [
  "/images/landing-page/pader.png",
  "/images/landing-page/turog.png",
  "/images/landing-page/eabab.png",
];

export const GallerySection: React.FC = () => {
  const [[imageCount, direction], setImageCount] = useState<[number, number]>([0, 0]);
  const activeImageIndex = wrap(0, images.length, imageCount);

  const swipeToImage = (swipeDirection: number) => {
    setImageCount([imageCount + swipeDirection, swipeDirection]);
  };

  const dragEndHandler = (event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      swipeToImage(-1);
    } else if (info.offset.x < -swipeThreshold) {
      swipeToImage(1);
    }
  };

  return (
    <div className="w-full min-h-screen bg-primary-1 flex flex-col gap-8 items-center justify-evenly p-8 pt-[10dvh]">
      <h1 className="md:text-5xl text-3xl font-extrabold md:text-left text-center">EXPLORE OUR GALLERY</h1>
      
      <div className="w-full flex flex-col gap-4 h-full justify-evenly items-center">
        <motion.div 
          className="relative w-full md:max-w-xl h-96 overflow-hidden rounded-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={imageCount}
              custom={direction}
              variants={sliderVariants}
              initial="incoming"
              animate="active"
              exit="exit"
              transition={sliderTransition}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={dragEndHandler}
              className="absolute inset-0"
            >
              <Image
                src={images[activeImageIndex]}
                alt={`Gallery image ${activeImageIndex + 1}`}
                layout="fill"
                objectFit="cover"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
        
        <div className="flex justify-center gap-4 mt-4">
          {images.map((src, index) => (
            <motion.div
              key={src}
              onClick={() => setImageCount([index, index > activeImageIndex ? 1 : -1])}
              className={`cursor-pointer rounded-lg ${index === activeImageIndex ? 'border-2 border-white' : ''}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Image
                src={src}
                alt={`Thumbnail ${index + 1}`}
                width={60}
                height={60}
                className="rounded-lg"
              />
            </motion.div>
          ))}
        </div>
      </div>

      <motion.button
        className="max-w-60 w-full py-3 bg-white text-primary-2 rounded-full font-semibold shadow-md"
        whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
        whileTap={{ scale: 0.95 }}
      >
        LEARN MORE
      </motion.button>
    </div>
  );
};