"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from 'next/link';
import { CreativeArray, CreativeService } from '../creative-components/CreativeArray';

// Define the page variants for animations
const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

// Define the CreativeUser interface
interface CreativeUser {
    detailsid: number;
    first_name: string;
    bio: string;
    imageBg: string;
    profile_pic: string;
    bday: string;   
}

const calculateAge = (birthday: string): number => {
    const birthDate = new Date(birthday);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const SearchResultsPage = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState(query || '');
    const [filteredUsers, setFilteredUsers] = useState<CreativeUser[]>([]);
    const [isInView, setIsInView] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await CreativeService.fetchCreativeUsers();
                setFilteredUsers(users);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsInView(entry.isIntersecting);
        }, {
            threshold: 0.1,
        });

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref]);

    // Filter categories based on search query
    const filteredCategories = CreativeArray.filter(category =>
        category.title.toLowerCase().includes((query || '').toLowerCase())
    );

    // Filter users based on search query
    const filteredUsersList = filteredUsers.filter(user =>
        user.first_name.toLowerCase().includes((query || '').toLowerCase()) ||
        user.bio.toLowerCase().includes((query || '').toLowerCase())
    );

    const handleNewSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/creative-directory/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <motion.div
            className="w-full min-h-screen bg-palette-4 pt-[5dvh] pb-20 text-palette-7"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.5 }}
        >
            <div className="w-full lg:max-w-[70%] md:max-w-[80%] max-w-[90%] mx-auto">
                <motion.div className="w-full flex flex-col gap-8">
                    {/* Header with Back Button */}
                    <motion.div className="flex items-center gap-4">
                        <Link href="/" className="text-palette-1 hover:opacity-80 transition-opacity">
                            <Icon icon="eva:arrow-back-fill" width="24" height="24" />
                        </Link>
                        <h1 className="text-3xl font-semibold text-palette-7">Search Results</h1>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.form 
                        onSubmit={handleNewSearch}
                        className="w-full max-w-2xl relative"
                    >
                        <input
                            className="placeholder:text-palette-6 text-palette-7 text-lg font-medium rounded-full bg-palette-5 
                            ring-2 ring-transparent focus:ring-palette-1 outline-none w-full py-2.5 px-14 transition-all duration-300"
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Icon
                            className="absolute top-1/2 -translate-y-1/2 left-4 text-palette-6"
                            icon="cil:search"
                            width="23"
                            height="23"
                        />
                        <button type="submit">
                            <Icon
                                className="cursor-pointer -mt-1 absolute top-[55%] -translate-y-1/2 right-4 text-palette-6 hover:text-palette-1 transition-colors"
                                icon="iconamoon:send-thin" 
                                width="28" 
                                height="28" 
                            />
                        </button>
                    </motion.form>

                    {/* Search Query Display */}
                    <motion.div>
                        <p className="text-lg text-palette-7 opacity-80">
                            Showing results for "<span className="font-semibold text-palette-2">{query}</span>"
                        </p>
                    </motion.div>

                    {/* Categories Results */}
                    {filteredCategories.length > 0 && (
                        <motion.div>
                            <h2 className="text-2xl font-semibold mb-4 text-palette-7">Categories</h2>
                            <motion.div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                                {filteredCategories.map((category) => (
                                    <Link href={category.link} key={category.id}>
                                        <motion.div
                                            className="bg-palette-5 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                                        >
                                            <img
                                                src={category.src}
                                                alt={category.title}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="p-6">
                                                <h3 className="text-xl font-semibold text-palette-7">{category.title}</h3>
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))}
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Artists/Users Results */}
                    {filteredUsersList.length > 0 && (
                        <motion.div className="mt-8">
                            <h2 className="text-2xl font-semibold mb-4 text-palette-7">Artists</h2>
                            <motion.div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 pt-[5dvh]">
                                {filteredUsersList.map((user) => (
                                    <motion.div
                                        key={user.detailsid}
                                        ref={ref}
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={!isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        whileHover={{ scale: 1.02 }}
                                        className="w-full border border-palette-6 rounded-xl p-4 bg-palette-5 shadow-lg"
                                    >
                                        <div className="flex flex-col">
                                            <div className="w-full h-full max-h-28 -mt-12 flex justify-center items-center">
                                                <img 
                                                    className="h-32 w-32 z-50 rounded-full object-cover border-2 border-palette-6" 
                                                    src={user.profile_pic || "../../images/creative-directory/profile.jpg"} 
                                                    alt={user.first_name}
                                                />
                                                <div className="w-4"></div>
                                            </div>
                                            <div className="w-full min-h-32 max-h-fit mt-6">
                                                <div className="w-full h-full max-w-[87%] mx-auto flex flex-col gap-2 justify-center items-center">
                                                    <h6 className="text-center text-2xl font-bold text-palette-7">{user.first_name}, {calculateAge(user.bday)}</h6>
                                                    <p className={`text-center text-xs font-semibold text-palette-6 ${user.bio.length > 100 ? "line-clamp-6" : ""}`}>{user.bio}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default SearchResultsPage;