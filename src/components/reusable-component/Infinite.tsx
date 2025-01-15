"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export const Infinite = () => {
  return (
    <div className="w-full h-[35dvh] bg-palette-5">
      <InfiniteImages />
    </div>
  );
};

const InfiniteImages = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [imageWidth, setImageWidth] = useState(200); 
  const [numOfImageSets, setNumOfImageSets] = useState(2); 

  const scrollSpeed = 20000; 

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      setWidth(containerWidth);

      const totalImageWidth = imageWidth * infinitImages.length;
      const sets = Math.ceil(containerWidth / totalImageWidth) + 1;
      setNumOfImageSets(sets);
    }
  }, [imageWidth]);

  return (
    <div
      ref={containerRef}
      className="w-full md:max-w-[80%] mx-auto overflow-hidden h-full flex items-center"
    >
      <motion.div
        className="flex gap-24"
        initial={{ x: 0 }}
        animate={{ x: `-${width}px` }} 
        transition={{
          ease: "linear",
          duration: scrollSpeed / 1000, 
          repeat: Infinity, 
        }}
      >
        {Array(numOfImageSets)
          .fill([...infinitImages, ...infinitImages]) 
          .flat()
          .map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Infinite image ${index + 1}`}
              className="h-full object-cover"
              style={{ width: `${imageWidth}px` }} 
            />
          ))}
      </motion.div>
    </div>
  );
};

const infinitImages = [
  "/images/infinite/dti.png",
  "/images/infinite/legazpi.png",
  "/images/infinite/logo.png",
  "/images/infinite/quanby.png",
];

export default Infinite;