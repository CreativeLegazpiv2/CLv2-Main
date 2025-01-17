'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useInView, useAnimation } from 'framer-motion';

const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
  const ref = useRef(null);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, value, isInView]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

const StatisticsBanner: React.FC = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: 'spring',
        damping: 20,
        stiffness: 100,
        duration: 0.8,
        when: 'beforeChildren',
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.section 
      ref={ref}
      className="bg-orange-400 py-8 overflow-hidden"
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      <div className="container mx-auto flex flex-col sm:flex-row justify-around items-center text-center">
        {/* Left Statistic */}
        <motion.div 
          className="mb-6 sm:mb-0"
          variants={itemVariants}
        >
          <motion.p 
            className="text-sm font-semibold text-stone-600"
            variants={itemVariants}
          >
            WITH OVER
          </motion.p>
          <motion.h2 className="text-5xl font-extrabold text-stone-700" variants={itemVariants}>
            <AnimatedNumber value={5000} />
          </motion.h2>
          <motion.p 
            className="text-sm font-semibold text-stone-600"
            variants={itemVariants}
          >
            CREATIVES ACROSS BICOL REGION
          </motion.p>
        </motion.div>

        {/* Right Statistic */}
        <motion.div variants={itemVariants}>
          <motion.p 
            className="text-sm font-semibold text-stone-600"
            variants={itemVariants}
          >
            LISTED PRODUCTS AND SERVICES
          </motion.p>
          <motion.h2 className="text-5xl font-extrabold text-stone-700" variants={itemVariants}>
            <AnimatedNumber value={15234} />
          </motion.h2>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default StatisticsBanner;