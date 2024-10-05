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
        <div className="w-full h-full flex flex-col gap-2 justify-start items-start border border-black">
            <h2 className="font-semibold text-5xl uppercase pb-2">support</h2>
            <h1 className="font-extrabold text-5xl uppercase leading-snug w-full max-w-2xl">TOP QUESTIONS ABOUT CREATIVE LEGAZPI </h1>
            <p className="font-semibold w-full max-w-sm text-xl">Need to clear something? Here are frequently asked questions.</p>
            <SearchInput />
        </div>
    )
}

const RightSide = () => {
    return (
        <div className="w-full max-w-md h-full flex relative border border-black">
            <div className="w-full h-full absolute -bottom-[18dvh] -right-[14dvh] border border-black">
                <img className="" src={"images/landing-page/laptop.png"} alt="" />
            </div>
        </div>
    )
}

const SearchInput = () => {
    return (
        <div className="w-full max-w-md h-fit relative text-secondary-1 rounded-2xl mt-8">
            <input
                className="placeholder:text-secondary-1 text-lg font-medium rounded-full bg-quaternary-1 ring-none outline-none w-full py-3 px-14"
                type="text"
                placeholder="Search"
            />
            <Icon
                className="absolute top-1/2 -translate-y-1/2 left-4 text-secondary-1"
                icon="cil:search"
                width="25"
                height="25"
            />
            <Icon
                // submit button for search
                onClick={() => console.log("submit")}
                className="rotate-[-36deg] cursor-pointer -mt-1 absolute top-[55%] -translate-y-1/2 -right-12 text-secondary-1"
                type="submit"
                icon="proicons:send"
                width="30"
                height="30"
            />
        </div>
    );
};

