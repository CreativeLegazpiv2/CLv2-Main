'use client';

import { motion } from 'framer-motion';

export const BackGroundDesign = () => {
  const layers = [
    { size: '24rem', top: '-6rem', left: '-9rem', zIndex: 50, bgColor: 'bg-new-5' },
    { size: '30rem', top: '-7rem', left: '-10rem', zIndex: 40, bgColor: 'bg-new-4' },
    { size: '36rem', top: '-8rem', left: '-11rem', zIndex: 30, bgColor: 'bg-new-3' },
    { size: '42rem', top: '-9rem', left: '-12rem', zIndex: 20, bgColor: 'bg-new-2' },
    { size: '48rem', top: '-10rem', left: '-13rem', zIndex: 10, bgColor: 'bg-new-1' },
    { size: '54rem', top: '-11rem', left: '-14rem', zIndex: 5, bgColor: 'bg-new-5' },
  ];

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-new-1 via-new-4 to-new-5">
      {layers.map((layer, index) => (
        <motion.div
          key={index}
          className={`absolute ${layer.bgColor} rounded-full`}
          style={{
            top: layer.top,
            left: layer.left,
            width: layer.size,
            height: layer.size,
            zIndex: layer.zIndex,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: index * 0.5, // Stagger the layers by 0.2 seconds
            duration: 1.5, // Duration of the fade-in animation
          }}
        />
      ))}
    </div>
  );
};
