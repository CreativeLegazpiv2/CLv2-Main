"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from "@iconify/react";
import { FaqsArray } from "./FaqsArray";

export const GeneralFaqs = () => {
  return (
    <div className="w-full h-auto">
      <div className="w-full h-full flex max-w-[75%] mx-auto text-primary-2">
        <LeftSideGen />
        <RightSideGen />
      </div>
    </div>
  );
};

const LeftSideGen = () => {
  return (
    <div
      className="w-full max-w-xl flex flex-col gap-4 sticky p-8 top-0 self-start"
    >
      <h1 className="text-5xl font-extrabold uppercase tracking-tight">General FAQs</h1>
      <p className="font-medium text-lg">
        Need help? Worry no more, everything you need to know about Creative Legazpi and how it works. Can&apos;t find the answer? Talk to our team!
      </p>
    </div>
  );
};

const RightSideGen = () => {
  return (
    <div className="w-full flex flex-col gap-4 pt-6">
      {FaqsArray.map((item, id) => (
        <AccordionItem key={id} item={item} />
      ))}
    </div>
  );
};

const AccordionItem = ({ item }: { item: { question: string; answer: string } }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full flex flex-col gap-4">
      <hr className="w-full border-[-1px] border-primary-2" />
      <div className="w-full flex flex-col gap-2 pl-4">
        <div className="w-full flex flex-row gap-20 justify-between items-start">
          <h1 className="text-lg font-bold">{item.question}</h1>
          <motion.div
            initial={false}
            animate={{ rotate: isOpen ? 360 : 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer"
          >
            <Icon
              icon={isOpen ? "icons8:minus" : "icons8:plus"}
              width="28"
              height="28"
            />
          </motion.div>
        </div>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="content"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: "auto" },
                collapsed: { opacity: 0, height: 0 },
              }}
              transition={{
                duration: 0.3,
                ease: [0.04, 0.62, 0.23, 0.98],
              }}
            >
              <motion.div
                variants={{
                  collapsed: { y: -10 },
                  open: { y: 0 },
                }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden"
              >
                <p className='text-base font-medium'>{item.answer}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
