"use client";
import { motion } from "framer-motion";

interface TranscribedProps {
  bgColor?: string;
  textColor?: string;
}

export const Transcribed = ({
  bgColor = "bg-palette-7",
  textColor = "text-secondary-1",
}: TranscribedProps = {}) => {
  return (
    <div className="w-full md:h-[35dvh] h-fit relative overflow-hidden bg-palette-5">
      {/* Sliding background animation */}
      <motion.div
        className={`absolute inset-0 ${bgColor}`}
        initial={{ x: "-100%" }}
        whileInView={{ x: 0 }}
        viewport={{ once: true }} // Trigger only once
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Content container */}
      <div className={`w-full h-full ${textColor} relative z-10`}>
        <div className="w-full h-full flex md:flex-row md:py-0 py-12 flex-col md:justify-between justify-center items-center md:max-w-[70%] max-w-[90%] mx-auto md:gap-0 gap-12">
          {/* Left section */}
          <motion.div
            className="md:w-fit md:h-full h-fit flex flex-col gap-4 text-lg justify-center items-center uppercase font-semibold"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} // Trigger only once
            transition={{
              duration: 0.6,
              delay: 0.6, // Starts after background slide
              ease: "easeOut",
            }}
          >
            <div className="w-fit flex flex-col gap-3 justify-center items-center">
              <motion.p
                className="text-center w-fit text-base"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} // Trigger only once
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <span className="text-4xl">CREATIVES</span> <br />
                ACROSS BICOL REGION
              </motion.p>
              <motion.p
                className="text-[55px]"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} // Trigger only once
                transition={{ delay: 1, duration: 0.4 }}
              >
                5,000+
              </motion.p>
            </div>
          </motion.div>

          {/* Right section */}
          <motion.div
            className="md:w-fit md:h-full h-fit flex justify-end items-center font-semibold"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} // Trigger only once
            transition={{
              duration: 0.6,
              delay: 0.6, // Starts after background slide
              ease: "easeOut",
            }}
          >
            <div className="w-fit flex md:flex-col flex-col-reverse md:justify-start justify-center md:items-center items-center gap-0.5">
              <motion.p
                className="md:text-left text-center text-2xl -tracking-wide"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} // Trigger only once
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                LISTED PRODUCTS <br />
                <span className="text-3xl">AND SERVICES</span>
              </motion.p>
              <motion.p
                className="text-5xl tracking-widest"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} // Trigger only once
                transition={{ delay: 1, duration: 0.4 }}
              >
                15,234
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Transcribed;