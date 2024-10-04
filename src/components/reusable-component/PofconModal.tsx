"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

interface PofconModalProps {
    setShowPofconModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PofconModal: React.FC<PofconModalProps> = ({ setShowPofconModal }) => {
    const [isVisible, setIsVisible] = useState(true); // Local state to manage visibility
    const [isExiting, setIsExiting] = useState(false); // State to manage exit animation

    const handleClose = () => {
        setIsExiting(true); // Start exit animation
    };

    const handleAnimationComplete = () => {
        if (isExiting) {
            setShowPofconModal(false); // Hide modal after exit animation completes
        }
    };

    return (
        <motion.div
            className="w-full h-dvh fixed z-[1000] inset-0 bg-secondary-2/50"
            initial={{ opacity: 0 }} // Initial state
            animate={{ opacity: isExiting ? 0 : 1 }}  // Animate to full opacity or fade out
            transition={{ duration: 0.3, ease: "easeInOut" }} // Duration of the transition
            onClick={handleClose} // Handle modal click to close
            onAnimationComplete={handleAnimationComplete} // Handle animation completion
        >
            <div className="w-full h-full flex justify-center items-center">
                <div
                    className="w-full h-full max-h-[70%] md:max-w-[55%] max-w-[90%] mx-auto bg-secondary-1 p-3 rounded-2xl relative overflow-hidden"
                    onClick={(e) => e.stopPropagation()} // Prevent close on inner click
                >
                    <div className="w-full h-full flex flex-col overflow-hidden relative px-4 lg:py-0 py-12">
                        <div className="h-4/5 w-full flex xl:justify-end justify-center xl:items-end items-center">
                            <div className="h-full w-full max-w-72 pr-4">
                                <Logo color="text-primary-2" width="auto" height="auto" />
                            </div>
                        </div>
                        <div className="h-full w-full text-primary-2 z-50">
                            <div className="w-full h-full flex flex-col justify-evenly items-center">
                                <h1 className="font-bold lg:text-xl md:text-lg text-base max-w-xl mx-auto text-center">
                                    EXPLORE AND GET TO KNOW MORE ABOUT WHAT CREATIVE LEGAZPI OFFERS BY SIGNING UP.
                                </h1>
                                <RegisterButton />
                            </div>
                        </div>
                        {/* design lang to */}
                        <div className="h-fit w-fit absolute lg:-bottom-[19rem] -top-[23rem] lg:right-[-15rem] left-[-20rem]">
                            <div className="bg-primary-2/20 xl:w-[40rem] w-[35rem]  h-[35rem] xl:h-[40rem]  rounded-full z-20"></div>
                        </div>
                    </div>
                    {/* design lang to */}
                    <div className="h-fit w-fit absolute lg:-bottom-[23rem] -bottom-[30rem] right-[-20rem]">
                        <div className="bg-primary-2/70 w-[40rem] h-[40rem] rounded-full z-20"></div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const RegisterButton = () => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="uppercase text-secondary-1 bg-primary-2 rounded-lg text-xl py-3 w-56 font-semibold"
        >
            register here
        </motion.button>
    );
};
