"use client"

import { Icon } from "@iconify/react/dist/iconify.js"
import { FaqsArray } from "./FaqsArray"

export const GeneralFaqs = () => {
    return(
        <div className="w-full h-full  border border-black">
            <div className="w-full h-full flex max-w-[75%] mx-auto border border-black text-primary-2">
                <LeftSideGen />
                <RightSideGen />
            </div>
        </div>
    )
}

const LeftSideGen = () => {
    return(
        <div className="w-full max-w-xl border border-black flex flex-col gap-4 sticky top-0">
            <h1 className="text-5xl font-bold uppercase">Genereal faqs</h1>
            <p className="font-medium text-lg">Need help? Worry no more, everything you need to know about Creative Legazpi and how it works. Can&apos;t find the answer? Talk to our team!</p>
        </div>
    )
}

const RightSideGen = () => {
    return(
        <div className="w-full flex flex-col pt-6 border border-black">
            <div className="w-full flex flex-col gap-4">
                <div className="w-full bg-primary-2 h-0.5"></div>
                <div className="w-full flex flex-row justify-between items-center">
                    <h1>Can I collaborate with Creative Legazpi ?</h1>
                    <Icon className="cursor-pointer" icon="icons8:plus" width="30" height="30" />
                </div>
            </div>
        </div>
    )
}