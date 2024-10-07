"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { CreativeLegazpiUsers } from "./CreativeArray";
import { motion } from "framer-motion";

interface CreativeArrayProps {
    name: string,
    bDay: string,
    description: string,
    imageSrc: string,
    imageBg: string
}

export const CreativeUsers = () => {
    return (
        <div className="w-full h-fit pb-[15dvh] ">
            <div className="w-full h-full flex flex-col md:max-w-[80%] max-w-[90%] mx-auto ">
                <div className="w-full p-6">
                    <h1 className="md:w-full w-fit mx-auto text-5xl font-semibold uppercase md:text-left text-center leading-tight">meet our creatives</h1>
                </div>
                <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 lg:gap-16 md:gap-8 lg:gap-y-24 md:gap-y-12 gap-y-8 p-6">
                    {CreativeLegazpiUsers.map((user, id) => (
                        <UserCard key={id} name={user.name} bDay={user.bDay} description={user.description} imageSrc={user.imageSrc} imageBg={user.imageBg} />
                    ))}
                </div>
            </div>
        </div>
    )
}

const calculateAge = (bDay: string | Date) => {
    const dateNow = new Date();
    const bDayDate = new Date(bDay);

    // Calculate the age based on year difference
    let age = dateNow.getFullYear() - bDayDate.getFullYear();

    // Check if the birthday has passed this year
    const hasBirthdayPassed = (dateNow.getMonth() > bDayDate.getMonth()) || 
                              (dateNow.getMonth() === bDayDate.getMonth() && dateNow.getDate() >= bDayDate.getDate());

    // If the birthday hasn't passed yet this year, subtract 1 from the age
    if (!hasBirthdayPassed) {
        age--;
    }

    return age;
};


const UserCard = ({ name, bDay, description, imageSrc, imageBg }: CreativeArrayProps) => {
    const age = calculateAge(bDay);
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="w-full border border-gray-400 rounded-xl p-4 bg-secondary-1 shadow-customShadow">
            <div className="flex flex-col ">
                <div className="w-full h-52 relative ">
                    <div className="w-full h-52">
                        <img className="w-full h-full object-cover" src={imageBg || "images/landing-page/eabab.png"} alt="" />
                    </div>
                </div>
                <div className="w-full h-full max-h-28 -mt-8 flex justify-between items-center">
                    <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Icon className="cursor-pointer" icon="jam:heart" width="35" height="35" /></motion.span>
                    <img className="h-28 w-28 z-50 rounded-full object-cover" src={imageSrc || ""} alt="" />
                    <div className="w-4"></div>
                </div>
                <div className="w-full min-h-32 max-h-fit mt-6 ">
                    <div className="w-full h-full max-w-[87%] mx-auto  flex flex-col gap-2 justify-center items-center">
                        <h6 className="text-center text-2xl font-bold">{name}, {age}</h6>
                        <p className={`text-center text-xs font-semibold ${description.length > 100 ? "line-clamp-6" : ""}`}>{description}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}