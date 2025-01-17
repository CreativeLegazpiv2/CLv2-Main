'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import '../g-visitor.css';  // Import the CSS file for media queries

const IndividualWorks: React.FC = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: 'beforeChildren',
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100
      }
    }
  };

  const galleryVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100
      }
    }
  };

  return (
    <motion.section 
      ref={ref}
      className="individual-works-section"
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      {/* Header */}
      <motion.header variants={itemVariants}>
        <motion.h1 className="individual-works-header" variants={itemVariants}>
          INDIVIDUAL WORKS
        </motion.h1>
      </motion.header>

      {/* Description */}
      <motion.p className="individual-works-description" variants={itemVariants}>
        Our Creatives bring ideas to life through various forms, whether it's graphic design or art posters.
        <br />
        Their work combines creativity and technical proficiency to deliver engaging and <br />
        impactful results tailored to each project's unique needs.
      </motion.p>

      {/* Image Gallery */}
      <motion.div className="individual-works-gallery" variants={galleryVariants}>
        <motion.div className="list" variants={galleryVariants}>
          {[1, 4, 2, 5, 3, 6].map((num) => (
            <motion.img 
              key={num}
              src={`../images/indiworks/${num}.png`} 
              alt={`Individual work ${num}`}
              variants={imageVariants}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default IndividualWorks;