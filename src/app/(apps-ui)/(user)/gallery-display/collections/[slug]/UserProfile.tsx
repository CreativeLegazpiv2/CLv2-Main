"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";
import { getSession } from "@/services/authservice";
import { jwtVerify } from "jose";
import { ProfileModal } from "./(collectionModal)/EditProfileDetails";
import PublishGallery from "./(collectionModal)/PublishGallery";
import { ArrowLeft } from "lucide-react";
import ProfileSkeletonUI from "@/components/Skeletal/ProfileSkeletonUI";

export interface UserDetail {
    detailsid: string;
    first_name: string;
    creative_field: string;
    address: string;
    mobileNo: string;
    bday?: string; // Add this line for the birthdate
    bio?: string;
    instagram: string;
    facebook: string;
    portfolioLink: string;
    profile_pic?: string;
    role: string;
    email?: string
}


interface CollectionItem {
    created_at: Date;
    generatedId: string;
    path: string;
    title: string;
    desc: string;
    artist: string;
    year: number;
    childid: string;
}

interface UserProfileProps {
    initialUserDetail: UserDetail;
    collection: CollectionItem[];
}
const JWT_SECRET = process.env.JWT_SECRET || "your-secret";

export const UserProfile: React.FC<UserProfileProps> = ({ initialUserDetail, collection }) => {



    const [showModal, setShowModal] = useState(false);
    const [getID, setID] = useState<string | null>(null);
    const [editModal, setEditModal] = useState(false)

    // Manage user details as a state
    const [userDetails, setUserDetails] = useState(initialUserDetail)


    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getSession();
                if (!token) return;
                const { payload } = await jwtVerify(
                    token,
                    new TextEncoder().encode(JWT_SECRET)
                );
                const userId = payload.id as string;
                setID(userId);
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        };

        fetchData();
    }, [initialUserDetail]);

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const slideIn = {
        initial: { x: -100, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        transition: {
            type: "spring",
            damping: 20,
            stiffness: 100
        }
    };

    return (
        <div className="min-h-dvh w-full text-primary-2 overflow-x-hidden">
            {/* User Profile Section */}
            <div className="w-full md:min-h-[80dvh] md:max-h-[80dvh] h-dvh relative ">
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <motion.img
                        initial={{ scale: 1.3 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 2.5, ease: "easeOut" }}
                        src={"/images/creative-profile/cover.png"}
                        className="w-full h-full object-cover absolute top-0 left-0"
                        alt=""
                    />
                </div>
                <div className="absolute w-full h-full flex z-10 bg-gradient-to-r from-palette-5 from-0% via-palette-5 md:via-15% via-25% to-transparent md:to-60% to-70%">
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="w-full h-fit pt-[20dvh] max-w-[80%] mx-auto relative flex flex-col gap-12 justify-center items-start"
                    >
                        <motion.div variants={fadeInUp} className="w-full flex flex-col gap-2">
                            <div className="w-full flex md:flex-row flex-col-reverse md:justify-between justify-start md:items-center items-start">
                                <motion.h1
                                    variants={fadeInUp}
                                    className="md:text-5xl text-4xl font-bold uppercase text-palette-2"
                                >
                                    {initialUserDetail.first_name}
                                </motion.h1>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <ArrowLeft onClick={() => window.history.back()} size={36} className="z-10 cursor-pointer text-palette-2 bg-palette-5 rounded-md p-1" />
                                </motion.div>
                            </div>
                            <motion.span variants={fadeInUp} className="italic text-palette-2 md:text-2xl text-xl font-bold">
                                {initialUserDetail.creative_field}
                            </motion.span>
                            {initialUserDetail.detailsid == getID && (
                                <motion.button
                                    variants={fadeInUp}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setEditModal(true)}
                                    className="bg-palette-6 py-2 px-4 w-32 text-palette-5 rounded-full tracking-wider uppercase mt-2"
                                >
                                    Edit
                                </motion.button>
                            )}
                        </motion.div>
                        <motion.div
                            variants={fadeInUp}
                            className="flex flex-col h-full md:justify-start md:items-start justify-center items-center w-full"
                        >
                            <motion.img
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                src={initialUserDetail.profile_pic || "/images/creative-profile/holder.png"}
                                className="w-full h-full rounded-xl md:max-w-[22rem] md:min-w-[22rem] md:max-h-[32rem] min-h-[32rem] max-h-[32rem] object-cover"
                                alt=""
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Second Section */}
            <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="w-full h-full min-h-[70dvh] flex relative justify-center items-center"
            >
                <motion.div
                    variants={slideIn}
                    className="md:max-w-[40%] lg:max-w-[50%] max-w-[90%] mx-auto w-full h-full flex flex-col gap-2 justify-center items-start md:absolute right-0"
                >
                    <motion.span variants={fadeInUp} className="flex gap-4 flex-row items-center">
                        Date Joined: February 15, 2024 <hr className="w-16" />
                    </motion.span>
                    <motion.h1 variants={fadeInUp} className="text-4xl font-bolder">
                        Introductory Title
                    </motion.h1>
                    <motion.div
                        variants={staggerContainer}
                        className="flex items-center gap-2 py-4 z-50"
                    >
                        {[
                            { href: initialUserDetail.facebook, icon: "arcticons:facebook" },
                            { href: initialUserDetail.instagram, icon: "arcticons:instagram" },
                            { href: `mailto:${initialUserDetail.email}`, icon: "arcticons:google-mail" }
                        ].map((social, index) => (
                            <motion.span
                                key={index}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                className="cursor-pointer"
                            >
                                <Link href={social.href} target="_blank" rel="noopener noreferrer">
                                    <Icon icon={social.icon} className="text-palette-2" width="48" height="48" />
                                </Link>
                            </motion.span>
                        ))}
                    </motion.div>
                    <motion.div variants={fadeInUp} className="pb-4">
                        <p className="font-thin w-full max-w-2xl">{initialUserDetail.bio}</p>
                    </motion.div>
                    <motion.div variants={fadeInUp} className="pt-4">
                        <h1 className="font-bolder capitalize">Address and Contact Number</h1>
                        <p className="font-thin">{initialUserDetail.address}, CN# {initialUserDetail.mobileNo}</p>
                    </motion.div>
                    {initialUserDetail.detailsid == getID && (
                        <motion.button
                            variants={fadeInUp}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowModal(true)}
                            className="bg-palette-6 py-3 px-4 w-56 mt-4 text-palette-5 rounded-full tracking-wider uppercase"
                        >
                            Publish Work
                        </motion.button>
                    )}
                </motion.div>
            </motion.div>

            {/* Featured Latest Collection */}
            {collection.slice(0, 1).map((item) => (
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2.5 }}
                    key={item.generatedId}
                    className="md:h-dvh h-fit w-full bg-palette-3 "
                >
                    <div className="w-full h-full flex md:flex-row flex-col md:pb-0 pb-[5dvh]">
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="w-full h-full text-palette-5 md:py-0 py-[5dvh]"
                        >
                            <div className="w-full h-full md:max-w-[70%] max-w-[90%] mx-auto flex flex-col gap-2 md:items-start items-center justify-center">
                                <motion.h1 variants={fadeInUp} className="uppercase title font-thin text-3xl flex w-fit items-center gap-2">
                                    featured work, <span className="italic font-bold text-xl py-4 block md:hidden w-fit">{item.year}</span>
                                </motion.h1>
                                <motion.h2 variants={fadeInUp} className="uppercase font-bolder text-5xl md:text-left text-center">
                                    {item.title}
                                </motion.h2>
                                <motion.span variants={fadeInUp} className="italic font-bold text-xl py-4 md:block hidden">
                                    {item.year}
                                </motion.span>
                                <motion.p variants={fadeInUp} className="text-xl w-full max-w-xl font-thin md:block hidden">
                                    {item.desc}
                                </motion.p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="w-full h-full min-h-[60dvh] relative"
                        >
                            <img src={item.path || "/images/creative-profile/cover.png"} className="w-full h-full md:object-cover object-contain absolute" alt="" />
                            <div className="w-full h-full absolute top-0 left-0 z-10 backdrop-blur-sm md:block hidden"></div>
                            <div className="p-12 absolute inset-0 z-20 flex items-center justify-center">
                                <motion.img
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8 }}
                                    src={item.path || "/images/creative-profile/cover.png"}
                                    className="max-w-full max-h-full object-contain shadow-lg rounded-xl md:block hidden"
                                    alt=""
                                />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            ))}

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="fixed top-0 left-0 w-full h-full bg-black/50 z-[1000] flex justify-center items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setShowModal(false)}
                    >
                        <PublishGallery
                            openModal={showModal}
                            setOpenModal={setShowModal} // Pass the state setter
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Modal for Editing Profile */}
            <AnimatePresence>
                {editModal && (
                    <motion.div
                        className="fixed top-0 left-0 w-full h-full bg-black/50 z-[1000] flex justify-center items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setEditModal(false)}
                    >
                        <ProfileModal
                            openModal={editModal}
                            setOpenModal={setEditModal}
                            formData={userDetails}
                            setFormData={setUserDetails}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

    );
};



