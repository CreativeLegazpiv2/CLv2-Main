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
    detailsid: number; // Adjust according to your data structure
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
    return Math.abs(ageDate.getUTCFullYear() - 1970); // Calculate age
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
                const users = await CreativeService.fetchCreativeUsers(); // Fetch users from the service
                setFilteredUsers(users); // Set the fetched users to state
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };

        fetchUsers(); // Call the fetch function
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsInView(entry.isIntersecting);
        }, {
            threshold: 0.1, // Adjust the threshold as needed
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
            router.push(`/creative-dashboard/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <motion.div
            className="w-full min-h-screen pt-[5dvh] pb-20 text-primary-2"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.5 }} // Optional transition properties
        >
            <div className="w-full lg:max-w-[70%] md:max-w-[80%] max-w-[90%] mx-auto">
                <motion.div className="w-full flex flex-col gap-8">
                    {/* Header with Back Button */}
                    <motion.div className="flex items-center gap-4">
                        <Link href="/" className="text-primary-2 hover:opacity-80 transition-opacity">
                            <Icon icon="eva:arrow-back-fill" width="24" height="24" />
                        </Link>
                        <h1 className="text-3xl font-semibold">Search Results</h1>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.form 
                        onSubmit={handleNewSearch}
                        className="w-full max-w-2xl relative"
                    >
                        <input
                            className="placeholder:text-primary-2 text-lg font-medium rounded-full bg-quaternary-2 ring-none 
                            outline-none w-full py-2.5 px-14"
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Icon
                            className="absolute top-1/2 -translate-y-1/2 left-4 text-primary-2"
                            icon="cil:search"
                            width="23"
                            height="23"
                        />
                        <button type="submit">
                            <Icon
                                className="cursor-pointer -mt-1 absolute top-[55%] -translate-y-1/2 right-4 text-primary-2"
                                icon="iconamoon:send-thin" 
                                width="28" 
                                height="28" 
                            />
                        </button>
                    </motion.form>

                    {/* Search Query Display */}
                    <motion.div>
                        <p className="text-lg opacity-80">
                            Showing results for "<span className="font-semibold">{query}</span>"
                        </p>
                    </motion.div>

                    {/* Categories Results */}
                    {filteredCategories.length > 0 && (
                        <motion.div>
                            <h2 className="text-2xl font-semibold mb-4">Categories</h2>
                            <motion.div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                                {filteredCategories.map((category) => (
                                    <Link href={category.link} key={category.id}>
                                        <motion.div
                                            className="bg-quaternary-2 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                                        >
                                            <img
                                                src={category.src}
                                                alt={category.title}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="p-6">
                                                <h3 className="text-xl font-semibold">{category.title}</h3>
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
                            <h2 className="text-2xl font-semibold mb-4">Artists</h2>
                            <motion.div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                                {filteredUsersList.map((user) => (
                                    <motion.div
                                        key={user.detailsid}
                                        ref={ref} // Attach the ref here
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={!isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        whileHover={{ scale: 1.02 }}
                                        className="w-full border border-gray-400 rounded-xl p-4 bg-secondary-1 shadow-customShadow"
                                    >
                                        <div className="flex flex-col">
                                            <div className="w-full h-52 relative">
                                                <img 
                                                    className="w-full h-full object-cover" 
                                                    src={user.imageBg || "../../images/landing-page/eabab.png"} 
                                                    alt={user.first_name} 

                                                />
                                            </div>
                                            <div className="w-full h-full max-h-28 -mt-12 flex justify-center items-center">
                                                {/* <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Icon className="cursor-pointer" icon="jam:heart" width="35" height="35" />
                                                </motion.span> */}
                                                <img 
                                                    className="h-32 w-32 z-50 rounded-full object-cover border-2 border-gray-400" 
                                                    src={user.profile_pic || "../../images/creative-directory/profile.jpg"} 
                                                    alt={user.first_name}
                                                />
                                                <div className="w-4"></div>
                                            </div>
                                            <div className="w-full min-h-32 max-h-fit mt-6">
                                                <div className="w-full h-full max-w-[87%] mx-auto flex flex-col gap-2 justify-center items-center">
                                                    <h6 className="text-center text-2xl font-bold">{user.first_name}, {calculateAge(user.bday)}</h6>
                                                    <p className={`text-center text-xs font-semibold ${user.bio.length > 100 ? "line-clamp-6" : ""}`}>{user.bio}</p>
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
