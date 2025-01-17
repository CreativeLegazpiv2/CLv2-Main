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

export const CreativeCarousel = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1536) {
        // xl screens and up
        setCardsPerPage(5);
      } else if (window.innerWidth >= 1280) {
        // lg screens
        setCardsPerPage(5);
      } else if (window.innerWidth >= 1024) {
        // md screens
        setCardsPerPage(4);
      } else if (window.innerWidth >= 768) {
        // sm screens
        setCardsPerPage(3);
      } else if (window.innerWidth >= 640) {
        // sm screens
        setCardsPerPage(2);
      } else {
        // xs screens
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
            {CreativeArray.map((item, id) => (
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
                />
              </motion.div>
            ))}
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
const CreativeCards: React.FC<CardProps> = ({
  title,
  src,
  right,
  left,
  translate,
  link,
}) => {
  return (
    <div className="w-full h-full  ">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="w-full h-full max-w-60 mx-auto bg-primary-1 overflow-visible relative rounded-3xl shadow-customShadow"
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
  if (!link) return null; // Return null if `link` is undefined

  return (
    <Link href={link}>
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        className="absolute z-50 -bottom-5 -left-5 flex flex-col justify-center items-center rounded-full text-secondary-1 bg-quaternary-1 w-56 lg:h-14 md:h-12 h-10"
      >
        <span className="uppercase text-xs font-semibold text-center w-full max-w-48">
          {title}
        </span>
      </motion.button>
    </Link>
  );
};
