"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreativeArray } from "./CreativeArray";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

interface CardProps {
  title: string;
  src: string;
  right: string;
  left: string;
  translate: string;
  link: string;
}

const gradientColors = [
  { from: "#A845E6", to: "#FAAD37" }, // 1 and 2
  { from: "#6F82D8", to: "#B5F59A" }, // 3 and 4
  { from: "#9364E0", to: "#7ECFE1" }, // 5 and 6
  { from: "#99B20F", to: "#D2E357" }, // 7 and 8
  { from: "#F99E9F", to: "#8B58E8" }, // 9 and 10
  { from: "#E25E20", to: "#F2C65E" }, // 11 and 12
  { from: "#D13977", to: "#F2C65E" }, // 13 and 14
  { from: "#DB429B", to: "#81CFCB" }, // 15 and 16
  { from: "#D78E40", to: "#F4EA8E" }, // 17 and 18
];

export const CreativeCarousel = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1536) {
        setCardsPerPage(5);
      } else if (window.innerWidth >= 1280) {
        setCardsPerPage(5);
      } else if (window.innerWidth >= 1024) {
        setCardsPerPage(4);
      } else if (window.innerWidth >= 768) {
        setCardsPerPage(3);
      } else if (window.innerWidth >= 640) {
        setCardsPerPage(2);
      } else {
        setCardsPerPage(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(CreativeArray.length / cardsPerPage);

  const next = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <div className="w-full md:h-[45dvh] h-[40dvh] relative">
      <div className="w-full md:max-w-[90%] h-full flex justify-center items-center overflow-hidden mx-auto">
        <div className="w-full lg:h-[11rem] h-[10rem]">
          <motion.div
            className="flex h-full md:px-2 md:gap-1"
            initial={false}
            animate={{ x: `${-currentPage * 100}%` }}
            transition={{ duration: 0.5 }}
          >
            {CreativeArray.map((item, id) => {
              const gradientIndex = id % gradientColors.length;
              const { from, to } = gradientColors[gradientIndex];

              return (
                <motion.div
                  key={id}
                  className={`flex-shrink-0 h-full ${
                    cardsPerPage === 1
                      ? "w-full"
                      : cardsPerPage === 2
                      ? "w-1/2"
                      : cardsPerPage === 3
                      ? "w-1/3"
                      : cardsPerPage === 4
                      ? "w-1/4"
                      : "w-1/5"
                  } p-4`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: id * 0.2 }}
                >
                  <CreativeCards
                    title={item.title}
                    src={item.src}
                    right={item.right}
                    left={item.left}
                    translate={item.translate}
                    link={item.link!}
                    fromColor={from}
                    toColor={to}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
      <button
        onClick={prev}
        className="absolute md:left-3 left-2 top-1/2 z-50 transform -translate-y-1/2 text-primary-2 lg:p-2 p-0.5 border border-gray-400 bg-white rounded-full shadow-md"
        disabled={currentPage === 0}
      >
        <Icon icon="ep:arrow-left" width="24" height="24" />
      </button>
      <button
        onClick={next}
        className="absolute md:right-3 right-2 top-1/2 z-50 transform -translate-y-1/2 text-primary-2 lg:p-2 p-0.5 border border-gray-400 bg-white rounded-full shadow-md"
        disabled={currentPage === totalPages - 1}
      >
        <Icon icon="ep:arrow-right" width="24" height="24" />
      </button>
    </div>
  );
};

// card details
const CreativeCards: React.FC<CardProps & { fromColor: string; toColor: string }> = ({
  title,
  src,
  right,
  left,
  translate,
  link,
  fromColor,
  toColor,
}) => {
  return (
    <div className="w-full h-full">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="w-full h-full max-w-60 mx-auto overflow-visible relative rounded-3xl shadow-customShadow"
        style={{
          background: `linear-gradient(to right, ${fromColor}, ${toColor})`,
        }}
      >
        <div className="w-full h-full overflow-visible relative">
          <img
            className={`w-[75%] absolute -bottom-0 object-cover ${right} ${left} ${translate}`}
            src={src}
            alt={title}
          />
        </div>
        <CreativeButton title={title} link={link} />
      </motion.div>
    </div>
  );
};

// Button
export const CreativeButton: React.FC<{ title: string; link: string }> = ({
  title,
  link,
}) => {
  if (!link) return null;

  return (
    <Link href={link}>
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        className="absolute z-50 -bottom-5 -left-5 flex flex-col justify-center items-center rounded-full text-secondary-1 bg-palette-3 w-56 lg:h-14 md:h-12 h-10"
      >
        <span className="uppercase text-xs font-semibold text-center w-full max-w-48">
          {title}
        </span>
      </motion.button>
    </Link>
  );
};