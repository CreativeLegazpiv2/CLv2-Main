"use client";

import { motion, AnimatePresence, wrap } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation"; // Import useRouter

const sliderVariants = {
  incoming: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  active: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

const sliderTransition = {
  duration: 0.5,
  ease: [0.43, 0.13, 0.23, 0.96],
};

const images = [
  "/images/landing-page/pader.png",
  "/images/landing-page/turog.png",
  "/images/landing-page/eabab.png",
];

export function GallerySection() {
  const [[imageCount, direction], setImageCount] = useState<[number, number]>([
    0, 0,
  ]);
  const activeImageIndex = wrap(0, images.length, imageCount);
  const router = useRouter(); // Initialize useRouter

  const swipeToImage = (swipeDirection: number) => {
    setImageCount(([prevCount, _]) => [prevCount + swipeDirection, swipeDirection]);
  };

  const dragEndHandler = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: {
      offset: { x: number; y: number };
      velocity: { x: number; y: number };
    }
  ) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      swipeToImage(-1);
    } else if (info.offset.x < -swipeThreshold) {
      swipeToImage(1);
    }
  };

  const getImageIndex = (offset: number) => {
    return wrap(0, images.length, imageCount + offset);
  };

  // Calculate positions including gaps
  const getImagePosition = (offset: number) => {
    const baseWidth = 'calc(33.333% - 1.33rem)'; // Approximately 1/3 width minus some space for gaps
    if (offset === -1) return { left: '0' };
    if (offset === 0) return { left: 'calc(33.333% + 1rem)' };
    return { left: 'calc(66.666% + 2rem)' };
  };

  const desktopSliderVariants = {
    incoming: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      height: '80%',
      scale: 0.8,
    }),
    active: (offset: number) => ({
      x: 0,
      opacity: 1,
      height: offset === 0 ? '100%' : '80%',
      scale: offset === 0 ? 1 : 0.8,
    }),
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      height: '80%',
      scale: 0.8,
    }),
  };
  
  const sliderTransition = {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 },
    scale: { duration: 0.5 },
    height: { duration: 0.5 },
  };

  // Function to handle Learn More button click
  const handleLearnMoreClick = () => {
    router.push("/apps-ui/g-visitor"); // Redirect to /apps-ui/g-visitor
  };

  return (
    <div className="w-full min-h-dvh bg-primary-1 flex flex-col gap-16 items-center justify-evenly p-8 pt-[10dvh]">
      <h1 className="md:text-5xl text-3xl font-extrabold md:text-left text-center">
        EXPLORE OUR GALLERY
      </h1>

      {/* Mobile layout (single-image slider) */}
      <div className="w-full lg:hidden flex flex-col gap-8 h-full justify-evenly items-center">
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
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="flex justify-center gap-4 mt-4">
          {images.map((src, index) => (
            <motion.div
              key={src}
              onClick={() =>
                setImageCount([index, index > activeImageIndex ? 1 : -1])
              }
              className={`relative h-[60px] w-[60px] cursor-pointer rounded-lg ${
                index === activeImageIndex ? "border-2 border-white" : ""
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Image
                src={src}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="rounded-lg object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Desktop layout (three-image slider) */}
      <div className="hidden lg:flex w-full flex-col gap-8 h-full justify-evenly items-center">
      <div className="relative w-full p-4 md:max-w-screen-xl min-h-96 overflow-hidden">
          <AnimatePresence initial={false} mode="popLayout" custom={direction}>
            {[-1, 0, 1].map((offset) => (
              <motion.div
                key={`${getImageIndex(offset)}-${imageCount}`}
                custom={offset}
                variants={desktopSliderVariants}
                initial="incoming"
                animate="active"
                exit="exit"
                transition={sliderTransition}
                className="absolute bottom-0 rounded-lg"
                style={{
                  ...getImagePosition(offset),
                  width: 'calc(33.333% - 1.33rem)',
                  zIndex: offset === 0 ? 10 : 0,
                }}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={images[getImageIndex(offset)]}
                    alt={`Gallery image ${getImageIndex(offset) + 1}`}
                    fill
                    className="rounded-lg shadow-lg object-cover"
                    priority={offset === 0}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex justify-center items-center gap-4 mt-4">
          <motion.button
            onClick={() => swipeToImage(-1)}
            className="p-2 bg-white text-primary-2 rounded-full shadow-md"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={24} />
          </motion.button>

          {images.map((src, index) => (
            <motion.div
              key={src}
              onClick={() =>
                setImageCount([index, index > activeImageIndex ? 1 : -1])
              }
              className={`relative h-[60px] w-[60px] cursor-pointer rounded-lg ${
                index === activeImageIndex ? "border-2 border-white" : ""
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Image
                src={src}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="rounded-lg object-cover"
              />
            </motion.div>
          ))}

          <motion.button
            onClick={() => swipeToImage(1)}
            className="p-2 bg-white text-primary-2 rounded-full shadow-md"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={24} />
          </motion.button>
        </div>
      </div>

      {/* Learn More Button */}
      <motion.button
        onClick={handleLearnMoreClick} // Redirect to /apps-ui/g-visitor
        className="max-w-60 w-full py-3 bg-white text-primary-2 rounded-full font-semibold shadow-md"
        whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
        whileTap={{ scale: 0.95 }}
      >
        LEARN MORE
      </motion.button>
    </div>
  );
}