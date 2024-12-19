"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Define the type for the collection items
interface CollectionItem {
  id: number;
  title: string;
  desc: string;
  image_path: string; // Use the correct field from the database
  artist: string;
  slug: string;
}

export const FeaturedCollections = () => {
  const [featuredItems, setFeaturedItems] = useState<CollectionItem[]>([]); // Array of CollectionItem
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Allow both string and null types
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current index

  // Fetch data from the API
  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await fetch("/api/collections");
        const data = await response.json();

        if (response.ok) {
          setFeaturedItems(data.imageCollection); // Assuming the API returns imageCollection
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to fetch collections");
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, []);

  // Load the current index from localStorage when the component mounts
  useEffect(() => {
    const storedIndex = localStorage.getItem("currentIndex");
    if (storedIndex) {
      setCurrentIndex(parseInt(storedIndex, 10)); // Parse the stored value as an integer
    }
  }, []);

  // Save the current index to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("currentIndex", currentIndex.toString());
  }, [currentIndex]);

  // Increment the index every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % Math.ceil(featuredItems.length / 6)
      );
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    return () => clearInterval(interval);
  }, [featuredItems.length]);

  // Get the items to display for the current index
  const itemsToDisplay = featuredItems.slice(
    currentIndex * 6,
    (currentIndex + 1) * 6
  );

  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Collections
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Showcasing your most exceptional artworks
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {itemsToDisplay.map((item, index) => (
            <motion.div
              key={item.id} // Now TypeScript knows 'id' exists
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-500"
            >
              <div className="relative h-72  rounded-2xl overflow-hidden">
                <Image
                  src={item.image_path}
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105 rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
              </div>
              <div className="">
                <div className="py-4 px-2">
                  <h3 className="text-xl font-bold mb-1 capitalize">
                    {item.title}
                  </h3>
                  <p className="text-sm">by {item.artist}</p>
                </div>
                <Link href={`/apps-ui/g-user/collections/${item.slug}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border border-gray-600 w-full py-3 rounded-full hover:bg-gray-700 hover:text-white transition duration-300 text-sm font-medium"
                  >
                    View Collection
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
