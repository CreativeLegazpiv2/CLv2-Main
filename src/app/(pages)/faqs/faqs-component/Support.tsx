"use client"

import { Icon } from "@iconify/react/dist/iconify.js"

export const Support = () => {
    return (
        <div className="w-full h-fit pt-[15dvh]">
            <div className="w-full max-w-[75%] mx-auto min-h-[40dvh] bg-shade-1 px-[5dvh] py-[5dvh] rounded-3xl">
                <div className="w-full h-full flex flex-row text-primary-2">
                    <LeftSide />
                    <RightSide />
                </div>
            </div>
        </div>
    )
}

const LeftSide = () => {
    return (
        <div className="w-full h-full flex flex-col gap-2 justify-start items-start">
            <h2 className="font-semibold text-5xl uppercase pb-2">support</h2>
            <h1 className="font-extrabold text-5xl uppercase leading-snug w-full max-w-2xl">TOP QUESTIONS ABOUT CREATIVE LEGAZPI </h1>
            <p className="font-semibold w-full max-w-sm text-xl">Need to clear something? Here are frequently asked questions.</p>
            <SearchInput />
        </div>
    ) 
}

const RightSide = () => {
    return (
        <div className="w-full max-w-md h-full flex relative">
            <div className="w-full h-full absolute -bottom-[18dvh] -right-[14dvh]">
                <img className="" src={"images/landing-page/laptop.png"} alt="" />
            </div>
        </div>
    ) 
}

const SearchInput = () => {
    return (
        <div className="w-full max-w-sm h-fit relative text-secondary-1 rounded-full overflow-hidden mt-8">
            <input
                className="placeholder:text-secondary-1 bg-primary-2 ring-none outline-none w-full py-4 pl-16"
                type="text"
                placeholder="Search"
            />
            <Icon
                className="absolute top-1/2 -translate-y-1/2 left-4 text-secondary-1"
                icon="cil:search"
                width="35"
                height="35"
            />
        </div>
    );
};

