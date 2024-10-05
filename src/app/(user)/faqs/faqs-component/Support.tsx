"use client"

import { Icon } from "@iconify/react/dist/iconify.js"

export const Support = () => {
    return (
        <div className="w-full h-fit pt-[15dvh]">
            <div className="w-full md:max-w-[75%] max-w-[90%] mx-auto min-h-[40dvh] bg-shade-1 px-[5dvh] py-[5dvh] rounded-3xl relative">
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
        <div className="w-full h-full flex flex-col lg:gap-2 gap-4 lg:justify-start justify-center lg:items-start items-center">
            <h2 className="font-semibold xl:text-5xl text-4xl uppercase pb-2">support</h2>
            <h1 className="font-extrabold xl:text-5xl text-4xl uppercase leading-snug w-full xl:max-w-2xl max-w-lg lg:text-left text-center">TOP QUESTIONS ABOUT CREATIVE LEGAZPI </h1>
            <p className="font-semibold w-full max-w-sm text-xl lg:text-left text-center">Need to clear something? Here are frequently asked questions.</p>
            <img className="w-full max-w-md lg:hidden block" src={"images/landing-page/laptop.png"} alt="" />
            <SearchInput />
        </div>
    )
}

const RightSide = () => {
    return (
        <div className="w-full lg:flex hidden max-w-md h-fit absolute -bottom-4 -right-20">
            <div className="w-full h-full">
                <img className="w-full max-w-md" src={"images/landing-page/laptop.png"} alt="" />
            </div>
        </div>
    )
}

const SearchInput = () => {
    return (
        <div className="w-full xl:max-w-md lg:max-w-xs max-w-[90%] h-fit relative text-secondary-1 rounded-2xl mt-8">
            <input
                className="placeholder:text-secondary-1 text-lg font-medium rounded-full bg-quaternary-1 ring-none outline-none w-full py-3 px-14"
                type="text"
                placeholder="Search"
            />
            <Icon
                className="absolute top-1/2 -translate-y-1/2 left-4 text-secondary-1"
                icon="cil:search"
                width="23"
                height="23"
            />
            <Icon // submit button for search
                onClick={() => console.log("submit")}
                className=" cursor-pointer -mt-1 absolute top-[55%] -translate-y-1/2 right-4  text-secondary-1"
                 icon="iconamoon:send-thin" width="28" height="28" />
        </div>
    );
};

