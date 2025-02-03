"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from "@iconify/react";
import { FaqsArray } from "./FaqsArray";

interface StyleProps {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    hoverColor?: string;
    iconColor?: string;
    containerWidth?: string;
    spacing?: string;
}

export const GeneralFaqs = ({
    backgroundColor = "bg-secondary-1",
    textColor = "text-primary-2",
    borderColor = "border-primary-2",
    hoverColor = "hover:bg-gray-100",
    iconColor = "text-primary-2",
    containerWidth = "xl:max-w-[75%] lg:max-w-[80%] md:max-w-[90%]",
    spacing = "gap-4"
}: StyleProps = {}) => {
    return (
        <div className="w-full h-auto">
            <div className={`w-full h-full flex md:flex-row flex-col ${containerWidth} mx-auto ${textColor}`}>
                <LeftSideGen />
                <RightSideGen 
                    backgroundColor={backgroundColor}
                    textColor={textColor}
                    borderColor={borderColor}
                    hoverColor={hoverColor}
                    iconColor={iconColor}
                    containerWidth={containerWidth}
                    spacing={spacing}
                />
            </div>
        </div>
    );
};

const LeftSideGen = () => {
    return (
        <div
            className="w-full xl:max-w-xl lg:max-w-md flex flex-col gap-4 sticky p-8 md:pt-0 pt-[12dvh] md:top-[12dvh] top-0 z-50 self-start bg-secondary-1"
        >
            <h1 className="xl:text-5xl text-4xl font-extrabold uppercase tracking-tight">General FAQs</h1>
            <p className="font-medium text-lg">
                Need help? Worry no more, everything you need to know about Creative Legazpi and how it works. Can&apos;t find the answer? Talk to our team!
            </p>
        </div>
    );
};

export const RightSideGen = ({
    backgroundColor = "bg-secondary-1",
    textColor = "text-primary-2",
    borderColor = "border-primary-2",
    hoverColor = "hover:bg-gray-100",
    iconColor = "text-primary-2",
    containerWidth = "lg:max-w-[80%] max-w-[90%]",
    spacing = "gap-4"
}: StyleProps = {}) => {
    return (
        <div className={`w-full flex flex-col ${spacing}`}>
            <div className={`w-full flex flex-col ${spacing} ${containerWidth} mx-auto`}>
                {FaqsArray.map((item, id) => (
                    <AccordionItem 
                        key={id} 
                        item={item}
                        backgroundColor={backgroundColor}
                        textColor={textColor}
                        borderColor={borderColor}
                        hoverColor={hoverColor}
                        iconColor={iconColor}
                    />
                ))}
            </div>
        </div>
    );
};

interface AccordionItemProps extends StyleProps {
    item: {
        question: string;
        answer: string;
    };
}

const AccordionItem = ({ 
    item,
    backgroundColor = "bg-secondary-1",
    textColor = "text-primary-2",
    borderColor = "border-primary-2",
    hoverColor = "hover:bg-gray-100",
    iconColor = "text-primary-2"
}: AccordionItemProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`w-full flex flex-col gap-4 ${backgroundColor} ${textColor}`}>
            <hr className={`w-full border-[-1px] ${borderColor}`} />
            <div className={`w-full flex flex-col gap-2 md:pl-4 ${hoverColor} rounded-lg transition-colors duration-200`}>
                <div className="w-full flex flex-row gap-20 justify-between items-start">
                    <h1 className="text-lg font-bold">{item.question}</h1>
                    <motion.div
                        initial={false}
                        animate={{ rotate: isOpen ? 360 : 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setIsOpen(!isOpen)}
                        className={`cursor-pointer ${iconColor}`}
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
                                collapsed: { opacity: 0, height: 0, minHeight: 0 },
                            }}
                            transition={{
                                duration: 0.4,
                                ease: [0.04, 0.62, 0.23, 0.98],
                            }}
                        >
                            <motion.div
                                variants={{
                                    collapsed: { y: -10, opacity: 0 },
                                    open: { y: 0, opacity: 1 },
                                }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeInOut",
                                }}
                                className="overflow-hidden"
                            >
                                <p className="text-base font-medium">{item.answer}</p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default GeneralFaqs;