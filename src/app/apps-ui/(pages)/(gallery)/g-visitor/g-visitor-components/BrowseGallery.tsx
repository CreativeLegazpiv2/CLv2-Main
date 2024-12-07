'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Link from 'next/link';
import { fetchArtworks, Artwork } from '@/services/Collections/fetchArtworks';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const GalleryItem: React.FC<Artwork> = ({
    slug,
    image_path,
    title,
    year,
    desc
}) => {
    const MAX_DESCRIPTION_LENGTH = 190;
    const truncatedDescription = desc?.length > MAX_DESCRIPTION_LENGTH
        ? desc.slice(0, MAX_DESCRIPTION_LENGTH) + '...'
        : desc;

    return (
        <div className="inline-block px-3 max-sm:px-0 w-full max-w-lg"> {/* Remove padding on mobile */}
        <Link href={`/apps-ui/g-visitor/artwork/${slug}`} passHref>
            <motion.article 
                className="relative rounded-lg shadow-lg w-full g-carousel h-auto max-md:max-w-full max-sm:w-[calc(100vw-32px)] bg-white cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                    <div className="relative overflow-hidden h-[30dvh] w-full rounded-lg">
                        <motion.img
                            src={image_path}
                            alt={`${title} artwork`}
                            className="object-cover w-full h-full"
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <div className="p-4">
                        <motion.h2 
                            className="text-2xl max-sm:text-xl font-bold text-gray-900"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {title} <span className="font-normal text-gray-600 text-lg max-sm:text-base">{year}</span>
                        </motion.h2>
                        <motion.p 
                            className="mt-2 text-gray-700 text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {truncatedDescription}
                        </motion.p>
                    </div>
                    <motion.div
                        className="g-carousel-button absolute bottom-4 right-[-30px] max-sm:right-[-20px] bg-primary-2 text-white font-bold py-3 px-10 max-sm:py-2 max-sm:px-6 rounded-lg transition hover:bg-quaternary-1"
                        style={{ zIndex: 10 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        SEE MORE
                    </motion.div>
                </motion.article>
            </Link>
        </div>
    );
};

const CustomArrow = ({ onClick, direction }: { onClick?: () => void; direction: 'prev' | 'next' }) => (
    <button
        onClick={onClick}
        className={`absolute z-20 top-1/2 -translate-y-1/2 ${
            direction === 'prev' ? 'left-4' : 'right-4'
        } bg-[#695C5C]/80 hover:bg-[#695C5C] p-3 rounded-lg shadow-lg transition-all duration-300`}
    >
        {direction === 'prev' ? (
            <ChevronLeft className="w-6 h-6 text-white" />
        ) : (
            <ChevronRight className="w-6 h-6 text-white" />
        )}
    </button>
);

const BrowseGallery: React.FC = () => {
    const [galleryItems, setGalleryItems] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState(true);

    // Updated slider settings with better mobile handling
  // Update the settings object in BrowseGallery component
const settings = {
    className: "center",
    centerMode: galleryItems.length > 1,
    infinite: galleryItems.length > 1,
    centerPadding: "60px",
    slidesToShow: Math.min(2, galleryItems.length),
    speed: 500,
    rows: 1,
    slidesPerRow: 1,
    prevArrow: galleryItems.length > 1 ? <CustomArrow direction="prev" /> : undefined,
    nextArrow: galleryItems.length > 1 ? <CustomArrow direction="next" /> : undefined,
    responsive: [
        {
            breakpoint: 1440,
            settings: {
                slidesToShow: 2,
                centerPadding: "40px",
                centerMode: true
            }
        },
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 1,
                centerPadding: "30px",
                centerMode: true
            }
        },
        {
            breakpoint: 768, // Tablet
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                centerPadding: "0px", // Remove padding for single item
                centerMode: false, // Disable center mode for mobile
                infinite: true,
                arrows: true, // Keep arrows for navigation
            }
        },
        {
            breakpoint: 480, // Mobile
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                centerPadding: "0px",
                centerMode: false,
                infinite: true,
                arrows: true,
            }
        }
    ]
};
    useEffect(() => {
        const loadArtworks = async () => {
            try {
                const artworks = await fetchArtworks();
                setGalleryItems(artworks);
            } catch (error) {
                console.error('Error loading artworks:', error);
            } finally {
                setLoading(false);
            }
        };
    
        loadArtworks();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#695C5C] border-t-transparent"></div>
            </div>
        );
    }

    if (galleryItems.length === 0) {
        return (
            <div className="py-12">
                <div className="max-w-[1800px] mx-auto px-4">
                    <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 mx-auto mb-4">
                                <svg 
                                    className="w-full h-full text-gray-400"
                                    fill="none" 
                                    strokeWidth="1.5"
                                    width="auto"
                                    height="auto"
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24" 
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No Artworks Available
                            </h3>
                            <p className="text-gray-600 max-w-sm mx-auto">
                                There are currently no artworks in the gallery. Please check back later for new additions.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        );
    }

    // Also update the GalleryItem component to be more responsive
    if (galleryItems.length === 1) {
        return (
            <div className="py-12">
                <div className="max-w-[1800px] mx-auto px-4">
                    <div className="flex justify-center">
                        <GalleryItem {...galleryItems[0]} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-12">
            <div className="max-w-[1800px] mx-auto px-4 max-sm:px-2">
                <div className="slider-container relative px-12 max-sm:px-0">
                    <Slider {...settings}>
                        {galleryItems.map((item, index) => (
                            <GalleryItem 
                                key={item.slug || index} 
                                {...item} 
                            />
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
};
export default BrowseGallery;