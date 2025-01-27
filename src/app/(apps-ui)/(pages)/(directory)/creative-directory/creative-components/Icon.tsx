"use client";
import { motion, AnimatePresence } from "framer-motion";
import React, { ReactNode } from "react";

const TwinkleElement = ({
  children,
  delay = 0,
  id,
}: {
  children: ReactNode;
  delay?: number;
  id: string;
}) => {
  const twinkleVariants = {
    initial: { opacity: 0.5, scale: 0.95 },
    animate: {
      opacity: [0.8, 1, 0.6, 0.7, 0.8],
      scale: [0.95, 1.05, 0.95],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: Math.random() * 2,
        delay: delay,
      },
    },
  };

  return (
    <motion.div
      key={id}
      initial="initial"
      animate="animate"
      variants={twinkleVariants}
      style={{ display: "inline-block" }}
    >
      {children}
    </motion.div>
  );
};

const StaggeredEffect = ({
  children,
  delay = 0,
  id,
}: {
  children: ReactNode;
  delay?: number;
  id: string;
}) => {
  const staggeredVariants = {
    initial: { opacity: 0, scale: 0.8, y: 20 },
    whileInView: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: delay,
      },
    },
  };
  return (
    <motion.div
      key={id}
      initial="initial"
      whileInView="whileInView"
      viewport={{ once: true }}
      variants={staggeredVariants}
    >
      {children}
    </motion.div>
  );
};

export const IconPage = () => {
  return (
    <div className="w-full h-full">
      <AnimatePresence>
        <motion.div className="w-full h-full relative" key="icons-container">
          <div className="absolute bottom-[40%] left-[10%]">
            <StaggeredEffect id="stagger1" delay={0}>
              <TwinkleElement id="icon1" delay={0}>
                <img src="images/creative-directory/icon/1.png" alt="" />
              </TwinkleElement>
            </StaggeredEffect>
          </div>
          <div className="absolute -bottom-[5%] right-[20%]">
            <StaggeredEffect id="stagger2" delay={0.2}>
              <TwinkleElement id="icon2" delay={0.2}>
                <img src="images/creative-directory/icon/2.png" alt="" />
              </TwinkleElement>
            </StaggeredEffect>
          </div>
          <div className="absolute top-[10%] right-[15%]">
            <StaggeredEffect id="stagger3" delay={0.4}>
              <TwinkleElement id="icon3" delay={0.4}>
                <img src="images/creative-directory/icon/3.png" alt="" />
              </TwinkleElement>
            </StaggeredEffect>
          </div>
          <div className="absolute top-[12%] right-[40%]">
            <StaggeredEffect id="stagger4" delay={0.6}>
              <TwinkleElement id="icon4" delay={0.6}>
                <img src="images/creative-directory/icon/4.png" alt="" />
              </TwinkleElement>
            </StaggeredEffect>
          </div>
          <div className="absolute bottom-[40%] left-[25%]">
            <StaggeredEffect id="stagger5" delay={0.8}>
              <TwinkleElement id="shape1" delay={0.8}>
                <div className="bg-[#EB2C5E] w-6 h-6 rounded-full" />
              </TwinkleElement>
            </StaggeredEffect>
          </div>
          <div className="absolute bottom-[5%] left-[15%]">
            <StaggeredEffect id="stagger6" delay={1.0}>
              <TwinkleElement id="shape2" delay={1.0}>
                <div className="bg-[#A01789] w-10 h-10 rounded-lg -rotate-12" />
              </TwinkleElement>
            </StaggeredEffect>
          </div>
          <div className="absolute bottom-[5%] right-[35%]">
            <StaggeredEffect id="stagger7" delay={1.2}>
              <TwinkleElement id="shape3" delay={1.2}>
                <div className="bg-shade-1 w-6 h-6 rotate-6 rounded-lg" />
              </TwinkleElement>
            </StaggeredEffect>
          </div>
          <div className="absolute bottom-[40%] right-[10%]">
            <StaggeredEffect id="stagger8" delay={1.4}>
              <TwinkleElement id="shape4" delay={1.4}>
                <div className="bg-palette-3 w-6 h-6 rounded-full" />
              </TwinkleElement>
            </StaggeredEffect>
          </div>
          <div className="absolute top-[20%] right-[27%]">
            <StaggeredEffect id="stagger9" delay={1.6}>
              <TwinkleElement id="shape5" delay={1.6}>
                <div className="bg-palette-2 w-5 h-5 rounded-full" />
              </TwinkleElement>
            </StaggeredEffect>
          </div>
          <div className="absolute top-[13%] right-[30%]">
            <StaggeredEffect id="stagger10" delay={1.8}>
              <TwinkleElement id="shape6" delay={1.8}>
                <div className="bg-palette-3 w-7 h-7 rounded-lg" />
              </TwinkleElement>
            </StaggeredEffect>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default IconPage;
