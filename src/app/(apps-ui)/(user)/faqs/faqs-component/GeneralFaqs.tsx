"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from "@iconify/react";
import { FaqsArray } from "./FaqsArray";

interface StyleProps {
    backgroundColor?: string;
    textColor?: string;
    texthover?: string;
    hoverColor?: string;
    iconColor?: string;
    containerWidth?: string;
    spacing?: string;
    border?: string;
    hidden?: string
}

export const GeneralFaqs = ({
    backgroundColor = "",
    textColor = "text-primary-2",
    texthover = "border-primary-2",
    hoverColor = "",
    iconColor = "text-primary-2",
    containerWidth = "xl:max-w-[75%] lg:max-w-[80%] md:max-w-[90%]",
    spacing = "gap-4"
}: StyleProps = {}) => {
    return (
        <div className="w-full h-auto">
            <div className={`w-full h-full flex md:flex-row flex-col gap-6 pt-10 ${containerWidth} mx-auto ${textColor}`}>
                <LeftSideGen />
                <RightSideGen
                    backgroundColor={backgroundColor}
                    textColor={textColor}
                    texthover={texthover}
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
            className="w-full xl:max-w-xl lg:max-w-md flex flex-col gap-4 sticky px-4 md:pt-0 pt-[12dvh] md:top-[12dvh] top-0 z-50 self-start"
        >
            <h1 className="xl:text-5xl text-4xl font-extrabold uppercase tracking-tight">General FAQs</h1>
            <p className="font-medium text-lg">
                Need help? Worry no more, everything you need to know about Creative Legazpi and how it works. Can&apos;t find the answer? Talk to our team!
            </p>
        </div>
    );
};

export const RightSideGen = ({
    backgroundColor = "bg-palette-5",
    textColor = "text-primary-2",
    texthover = "border-primary-2",
    hoverColor = "",
    iconColor = "text-primary-2",
    containerWidth = "lg:max-w-[80%] max-w-[90%]",
    spacing = "gap-4",
    border = "border border-none",
    hidden = "flex"
}: StyleProps = {}) => {
    return (
        <div className={`w-full flex flex-col z-50  ${spacing}`}>
            <div className={`w-full flex flex-col  ${spacing} ${containerWidth} mx-auto`}>
                {FaqsArray.map((item, id) => (
                    <AccordionItem
                        key={id}
                        item={item}
                        backgroundColor={backgroundColor}
                        textColor={textColor}
                        texthover={texthover}
                        hoverColor={hoverColor}
                        iconColor={iconColor}
                        border={border}
                        hidden={hidden}
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
    backgroundColor = "bg-palette-5",
    textColor = "text-black/90",
    texthover = "group-hover:text-palette-1",
    hoverColor = "",
    iconColor = "text-primary-2",
    border = "border border-none",
    hidden = "flex"
}: AccordionItemProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`w-full flex flex-col gap-4 ${backgroundColor} ${textColor}`}>
            <div className={`w-full flex flex-col md:pl-4 group rounded-lg transition-colors duration-200`}>
                <hr className={`border w-full border-palette-1/20 ${hidden}`} />
                <div className={`w-full flex flex-row gap-20 justify-between group items-start p-2 duration-300 ${hoverColor} px-4 rounded-full ${border}`}>

                    <h1 className={`text-lg font-bold ${textColor} ${texthover}`}>{item.question}</h1>
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
                            className={`${iconColor} ${texthover}`}
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
                                className="overflow-hidden px-4"
                            >
                                <p className={`text-base font-medium pt-2 ${textColor}`}>{item.answer}</p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default GeneralFaqs;