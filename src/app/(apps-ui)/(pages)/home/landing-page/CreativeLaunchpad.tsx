"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function CreativeLaunchpad() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null); // Track the hovered image index
  return (
    <div className="w-dvw min-h-screen bg-palette-6">
      <div className="w-full flex">
        {/* Left side content */}
        <motion.div
          className="w-full flex justify-center items-center z-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="w-full h-fit flex flex-col gap-6 max-w-lg text-palette-5 relative">
            <h1 className="title text-6xl uppercase font-normal">
              Creative Launchpad
            </h1>
            <h2 className="text-7xl uppercase">Available soon</h2>
            <p className="font-normal text-2xl">
              Highlights local creative professionals by launching a campaign of
              their latest project, exhibits and services
            </p>

            <AnimatePresence>
              <motion.img
                key={"1"}
                className="absolute -top-[55%] -right-[25%]"
                src="/images/homepage/4.png"
                alt=""
                initial={{ opacity: 0, x: 50 }}
                transition={{ duration: 1, type: "spring", stiffness: 100 }}
                animate={{
                  opacity: [0, 1, 0.3, 1],
                  scale: [1, 0.9, 1],
                  rotate: [-35, -35, -35],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              />

              <motion.div
                key={"2"}
                className="absolute top-[20%] -right-[35%] bg-blue-800 rounded-md w-12 h-12"
                animate={{
                  opacity: [1, 0.3, 1],
                  scale: [1, 0.9, 1],
                  rotate: [-35, -35, -35],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              />

              <motion.div
                key={"3"}
                className="absolute top-[50%] -right-[25%] bg-yellow-600 rounded-md w-7 h-7"
                animate={{
                  opacity: [1, 0.3, 1],
                  scale: [1, 0.9, 1],
                  rotate: [-35, -35, -35],
                  transition: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              />
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right side grid */}
        <motion.div
          className="w-full h-fit grid grid-cols-3 grid-rows-3"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {clp.slice(0, 12).map((image, index) => (
            <motion.div
              key={index}
              className="w-full relative aspect-square"
              onHoverStart={() => setHoveredIndex(index)} // Set hovered index
              onHoverEnd={() => setHoveredIndex(null)} // Reset hovered index
            >
              <img
                className={`w-full object-cover transition-all duration-300 ${
                  hoveredIndex !== null && hoveredIndex !== index
                    ? "grayscale"
                    : "grayscale-0"
                }`}
                src={image.src}
                alt={image.alt}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

const clp = [
  {
    src: "/images/creativeLaunchpad/creativeLaunchpad_1.png",
    alt: "Creative Launchpad",
  },
  {
    src: "/images/creativeLaunchpad/creativeLaunchpad_2.png",
    alt: "Creative Launchpad",
  },
  {
    src: "/images/creativeLaunchpad/creativeLaunchpad_3.png",
    alt: "Creative Launchpad",
  },
  {
    src: "/images/creativeLaunchpad/creativeLaunchpad_4.png",
    alt: "Creative Launchpad",
  },
  {
    src: "/images/creativeLaunchpad/creativeLaunchpad_5.png",
    alt: "Creative Launchpad",
  },
  {
    src: "/images/creativeLaunchpad/creativeLaunchpad_6.png",
    alt: "Creative Launchpad",
  },
  {
    src: "/images/creativeLaunchpad/creativeLaunchpad_7.png",
    alt: "Creative Launchpad",
  },
  {
    src: "/images/creativeLaunchpad/creativeLaunchpad_8.png",
    alt: "Creative Launchpad",
  },
  {
    src: "/images/creativeLaunchpad/creativeLaunchpad_9.png",
    alt: "Creative Launchpad",
  },
  {
    src: "/images/creativeLaunchpad/creativeLaunchpad_10.png",
    alt: "Creative Launchpad",
  },
  {
    src: "/images/creativeLaunchpad/creativeLaunchpad_11.png",
    alt: "Creative Launchpad",
  },
  {
    src: "/images/creativeLaunchpad/creativeLaunchpad_12.png",
    alt: "Creative Launchpad",
  },
];
