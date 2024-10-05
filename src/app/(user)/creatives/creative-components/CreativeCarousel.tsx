"use client"
import { CreativeArray } from "./CreativeArray"

interface CardProps {
    title: string,
    src: string,
    right: string,
    left: string
}

export const CreativeCarousel = () => {
    return (
        <div className="w-full border border-black h-[25dvh]">
            {CreativeArray.map((item, id) => (
                <CreativeCards key={id} item={item} />
            ))}
        </div>
    )
}

const CreativeCards: React.FC<CardProps> = ({
    
}) => {
    return (
        <div className="w-full h-full max-w-[90%] mx-auto border border-black p-4">
            <div className="w-full h-full max-w-xs bg-primary-1 overflow-visible relative rounded-3xl shadow-customShadow">
                <div className=" w-full h-full border border-black overflow-visible">
                    <img className="w-[75%] absolute z-50 -bottom-0 -right-0  object-cover" src="/images/creative-directory/2.png" alt="" />
                </div>
                <div className="absolute z-50 -bottom-5 -left-5 flex flex-col justify-center items-center rounded-full text-secondary-1 bg-quaternary-1 w-56 h-14">
                    <h4 className=" uppercase text-base font-semibold text-center ">creative services</h4>
                </div>
            </div>
        </div>
    )
}