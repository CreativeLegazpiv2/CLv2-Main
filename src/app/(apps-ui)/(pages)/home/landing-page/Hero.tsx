"use client";

import { AnimatePresence, motion } from "framer-motion";
import { div } from "framer-motion/client";
import { useState, useEffect } from "react";

export const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="w-full h-screen bg-palette-5 overflow-hidden">
      <div className="w-full h-full flex justify-end items-center relative">
        <img
          className="absolute right-[15%] top-[25%] z-20 "
          src="/images/homepage/3.png"
          alt=""
        />
        <div className="absolute right-[12%] top-[40%] z-10 bg-palette-3 rounded-full w-6 h-6"></div>
        <LeftSide currentIndex={currentIndex} />
        <RightSide
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      </div>
    </div>
  );
};

const LeftSide = ({ currentIndex }: { currentIndex: number }) => {
  return (
    <motion.div
      className="md:w-[40%] w-full absolute top-0 md:left-[5%] left-[2%] z-20 h-full"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{
        opacity: 1,
        x: 0,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 20,
        },
      }}
      viewport={{ once: true }}
    >
      <div className="w-full h-full flex flex-col gap-6 justify-center items-center relative">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          {[
            {
              key: "circle-1",
              className: "absolute left-[10%] bottom-[20%] z-10 bg-palette-2 rounded-full w-6 h-6",
              initialTransform: { y: 50 },
              twinkleParams: {
                opacity: [1, 0.8, 1],
                scale: [1, 1.2, 1],
              },
            },
            {
              key: "circle-2",
              className: "absolute right-[30%] bottom-[20%] z-10 bg-palette-3 rounded-full w-5 h-5",
              initialTransform: { y: 50 },
              twinkleParams: {
                opacity: [1, 0.3, 1],
                scale: [1, 0.9, 1],
                rotate: [-35, -35, -35],
              },
            },
            {
              key: "circle-3",
              className: "absolute right-[10%] bottom-[10%] z-10 bg-yellow-500 rounded-md w-7 h-7 rotate-[-35deg]",
              initialTransform: { y: 50 },
              twinkleParams: {
                opacity: [1, 0.8, 1],
                scale: [1, 1.2, 1],
                rotate: [-35, -35, -35],
              },
            },
            {
              key: "circle-4",
              className: "absolute right-[15%] md:bottom-[35%] z-10 bg-palette-3 rounded-md w-7 h-7 rotate-45",
              initialTransform: { y: 50 },
              twinkleParams: {
                opacity: [1, 0.8, 1],
                scale: [1, 1.1, 1],
                rotate: [45, 45, 45],
              },
            },
            {
              key: "circle-5",
              className: "absolute left-[38%] top-[22%] z-10 bg-palette-3 rounded-md w-5 h-5",
              initialTransform: { y: 50 },
              twinkleParams: {
                opacity: [1, 0.8, 1],
                scale: [1, 1.2, 1],
              },
            },
          ].map((item) => (
            <motion.div
              key={item.key}
              className={item.className}
              variants={{
                hidden: { opacity: 0, scale: 0, y: 50 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 10
                  }
                }
              }}
              animate={{
                ...item.twinkleParams,
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                },
              }}
            />
          ))}

          {[
            {
              key: "image-1",
              src: "/images/homepage/1.png",
              className: "absolute right-[0%] bottom-[20%]",
              initialTransform: { x: 50 },
              twinkleParams: {
                opacity: [1, 0.9, 1],
                scale: [1, 0.9, 1],
                rotate: [-35, -35, -35],
              },
            },
            {
              key: "image-2",
              src: "/images/homepage/2.png",
              className: "absolute left-[45%] top-[15%] z-10",
              initialTransform: { y: 50 },
              twinkleParams: {
                opacity: [1, 0.9, 1],
                scale: [1, 0.9, 1],
              },
            },
          ].map((item) => (
            <motion.img
              key={item.key}
              className={item.className}
              src={item.src}
              alt=""
              variants={{
                hidden: { opacity: 0, scale: 0, ...item.initialTransform },
                visible: {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  x: 0,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 10
                  }
                }
              }}
              animate={{
                ...item.twinkleParams,
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                },
              }}
            />
          ))}
        </motion.div>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, type: "spring", stiffness: 100 }}
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, type: "spring", stiffness: 100 }}
            className="w-full max-w-sm md:text-8xl text-6xl font-sans uppercase font-[700] text-palette-2"
          >
            This is creative legazpi
          </motion.h1>

          <Buttons />
          <Indicator currentIndex={currentIndex} />
        </motion.div>
      </div>
    </motion.div>
  );
};


const imageSet = [
  {
    src: "/images/homepage/bread.png",
    alt: "Bread",
  },
  {
    src: "/images/homepage/ea.png",
    alt: "idk",
  },
  {
    src: "/images/homepage/plates.png",
    alt: "plates",
  },
  {
    src: "/images/homepage/cake.png",
    alt: "Cakes",
  },
  {
    src: "/images/homepage/sili.png",
    alt: "Sili",
  },
];

const RightSide = ({
  currentIndex,
  setCurrentIndex,
}: {
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>; // Updated type
}) => {
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Total slides (includes duplicates for seamless looping)
  const totalSlides = imageSet.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (totalSlides + 1));
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [setCurrentIndex, totalSlides]);

  const handleTransitionEnd = () => {
    // If we're at the end of the duplicated slides, reset position to the start
    if (currentIndex === totalSlides) {
      setIsTransitioning(false); // Temporarily disable transition
      setCurrentIndex(0); // Reset to the first slide
    }
  };

  // Re-enable transition after resetting position
  useEffect(() => {
    if (!isTransitioning) {
      const timeout = setTimeout(() => {
        setIsTransitioning(true);
      }, 50); // Short delay to re-enable transition
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);

  return (
    <div className="w-full md:max-w-[65%] h-full overflow-hidden relative">
      {/* Gradient overlay */}
      <div className="md:block hidden absolute inset-0 bg-gradient-to-r from-palette-5 via-palette-5/10 to-transparent z-10" />
      <div className="block md:hidden absolute inset-0 bg-gradient-to-r from-palette-5 via-palette-5/70 to-transparent z-10" />
      {/* Image container with sliding effect */}
      <div
        className={`flex w-full h-full ${
          isTransitioning ? "transition-transform duration-500 ease-in-out" : ""
        }`}
        style={{
          transform: `translateX(-${
            (currentIndex % (totalSlides + 1)) * 100
          }%)`,
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {/* Duplicate the imageSet and append the first image for seamless looping */}
        {[...imageSet, imageSet[0]].map((image, index) => (
          <div key={index} className="w-full h-full flex-shrink-0">
            <img
              className="w-full h-full object-cover md:object-right-top"
              src={image.src}
              alt={image.alt}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const Indicator = ({ currentIndex }: { currentIndex: number }) => {
  return (
    <div className="px-4 flex gap-2">
      {imageSet.map((_, index) => (
        <div
          key={index}
          className={`w-4 h-4 border-2 border-palette-2 rounded-full ${
            index === currentIndex % imageSet.length
              ? "bg-transparent"
              : "bg-palette-2"
          }`}
        ></div>
      ))}
    </div>
  );
};

const Buttons = () => {
  return (
    <div className="w-fit flex gap-6 ">
      <button className="w-36 py-2 z-20 bg-palette-6 uppercase text-palette-5 rounded-full font-semibold tracking-wider">
        Join
      </button>
      <button className="w-36 py-2 z-20 bg-palette-3 uppercase text-palette-5 rounded-full font-semibold tracking-wider">
        Explore
      </button>
    </div>
  );
};
