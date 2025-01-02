"use client";

import { CreativeDirectory } from "@/components/reusable-component/CreativeDirectory";
import { Logo } from "@/components/reusable-component/Logo";
import { motion } from "framer-motion";

interface PofconHeroPageProps {
  setShowPofconModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export const PofconHeroPage: React.FC<PofconHeroPageProps> = ({
  setShowPofconModal,
}) => {
  return (
    <motion.div
      className="w-full min-h-screen pb-[10dvh] relative"
      style={{
        backgroundImage: "url('/intro/img7.png')",
        backgroundPosition: "47.5% 53.5%", // Shift the image slightly to the right
        backgroundSize: "cover",
        backgroundAttachment: "fixed", // This creates the parallax effect
        backgroundRepeat: "no-repeat",
      }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="w-full h-full absolute inset-0 bg-black bg-opacity-10 z-10"></div>
      <motion.div
        className="w-full md:max-w-[80%] max-w-[90%] min-h-[30dvh] mx-auto flex flex-col gap-8 justify-center pt-[20.4vh] items-center z-20 relative"
        variants={itemVariants}
      >
        <motion.div
          className="w-full flex flex-col lg:justify-start lg:items-start justify-center items-center gap-4"
          variants={itemVariants}
        >
          <motion.h1
            className="font-bold lg:text-6xl text-5xl text-left text-secondary-1"
            variants={itemVariants}
          >
            Welcome to{" "}
          </motion.h1>
          <motion.div variants={itemVariants}>
            <Logo
              width={"auto"}
              height={"auto"}
              color="text-secondary-1"
              justifyContent="justify-center"
              itemPosition="items-center"
            />
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <CreativeDirectory
            textColor="text-primary-2"
            textFont="title"
            borderColor="border-primary-2 border-2"
            trackingWide="tracking-widest"
            roundedEdges="rounded-none"
            setShowPofconModal={setShowPofconModal}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};