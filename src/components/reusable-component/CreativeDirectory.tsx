"use client";
import { motion } from "framer-motion";

interface CreativeDirectoryProps {
  textFont?: string;
  textColor?: string;
  textBold?: string;
  trackingWide?: string;
  borderColor?: string;
  roundedEdges?: string;
  textGap?: string;
  textSize?: string;
  setShowPofconModal: React.Dispatch<React.SetStateAction<boolean>>; // Accept prop for modal state
}

export const CreativeDirectory: React.FC<CreativeDirectoryProps> = ({
  textFont = "",
  textSize = "lg:text-6xl",
  textBold = "font-bold",
  textColor = "text-secondary-2",
  borderColor = "bg-shade-1",
  trackingWide = "tracking-normal",
  roundedEdges = "rounded-3xl",
  textGap = "gap-12",
  setShowPofconModal // Destructure the prop
}) => {
  return (
    <div className={`w-full lg:h-[70dvh] h-fit p-6 bg-shade-1 ${roundedEdges}`}>
      <div className={`w-full h-full flex lg:flex-row flex-col ${borderColor}`}>
        <div className={`w-full h-full flex flex-col p-6 md:justify-center justify-evenly md:items-start items-center lg:pl-16 px-2 ${textGap}`}>
          <div className="w-full flex flex-col justify-start lg:items-start items-center gap-6">
            <h1 className={`xl:text-6xl lg:text-5xl md:text-4xl text-5xl lg:text-left text-center ${textBold} ${textColor} ${textFont} ${trackingWide} ${textSize}`}>
              Creative Directory
            </h1>
            <p className="font-medium text-2xl w-full max-w-xs lg:text-left text-center">
              Explore, connect and network with the creative minds of Legazpi City
            </p>
          </div>
          <img className="w-full lg:h-full block lg:hidden" src={"images/landing-page/laptop.png"} alt="" />
          <div className="lg:w-fit w-full flex flex-row md:justify-center justify-evenly items-center md:gap-6 gap-4 font-semibold">
            <motion.button
              className={`bg-primary-2 text-secondary-1 md:w-36 w-32 py-2 rounded-full uppercase ${trackingWide} ${textFont}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              join
            </motion.button>
            <motion.button
              onClick={() => setShowPofconModal(true)} // Use the prop to set modal state
              className={`bg-secondary-1 text-primary-2 md:w-36 w-32 py-2 rounded-full uppercase ${trackingWide} ${textFont}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              explore
            </motion.button>
          </div>
        </div>
        <div className="w-full lg:block hidden h-full">
          <div className="w-full h-full flex justify-center items-center">
            <img className="w-full" src={"images/landing-page/laptop.png"} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};
