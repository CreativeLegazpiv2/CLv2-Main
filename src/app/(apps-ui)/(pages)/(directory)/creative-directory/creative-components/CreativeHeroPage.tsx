"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.6
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

export const CreativeHeroPage = () => {
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
                <motion.div className="w-full flex md:flex-col flex-col md:gap-12 gap-6" variants={staggerChildren}>
                    <motion.div className="w-full flex md:flex-row flex-col-reverse gap-4 md:justify-between justify-center items-center" variants={childVariants}>
                        <h1 className="md:w-full w-fit md:block hidden text-5xl font-semibold uppercase">Discover</h1>
                        <div className="w-full flex md:justify-end md:items-end justify-center items-center">
                            <SearchInput />
                        </div>
                    </motion.div>
                    <motion.div className="w-full flex flex-col gap-8 md:justify-start md:items-start items-center justify-center" variants={childVariants}>
                        <TitleDetails />
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    )
}

const TitleDetails = () => {
    return (
        <motion.div className="flex flex-col gap-8 md:justify-start md:items-start items-center justify-center" variants={staggerChildren}>
            <motion.h1 className="md:w-full w-fit max-w-sm md:text-6xl text-5xl font-black uppercase leading-tight md:text-left text-center" variants={childVariants}>
                creative directory
            </motion.h1>
            <motion.p className="font-normal text-lg md:w-full w-fit max-w-lg md:text-left text-center" variants={childVariants}>
                Creative Legazpi is a vibrant hub of creativity that brings together a diverse range
                of artistic and cultural disciplines.
            </motion.p>
        </motion.div>
    )
}

const SearchInput = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/creative-directory/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <motion.form 
            onSubmit={handleSubmit}
            className="w-full lg:max-w-xl max-w-sm h-fit relative text-primary-2 rounded-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
        >
            <input
                className="placeholder:text-primary-2 text-lg font-medium rounded-full bg-quaternary-2 ring-none 
                outline-none w-full py-2.5 px-14"
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Icon
                className="absolute top-1/2 -translate-y-1/2 left-4 text-primary-2"
                icon="cil:search"
                width="23"
                height="23"
            />
            <button type="submit">
                <Icon
                    className="cursor-pointer -mt-1 absolute top-[55%] -translate-y-1/2 right-4 text-primary-2"
                    icon="iconamoon:send-thin" 
                    width="28" 
                    height="28" 
                />
            </button>
        </motion.form>
    );
};

export default CreativeHeroPage;