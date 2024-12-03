'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

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

  // Fetch data from the API
  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await fetch('/api/collections');
        const data = await response.json();

        if (response.ok) {
          setFeaturedItems(data.imageCollection); // Assuming the API returns imageCollection
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch collections');
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, []);

  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Collections</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Showcasing your most exceptional artworks
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featuredItems.map((item, index) => (
            <motion.div
              key={item.id} // Now TypeScript knows 'id' exists
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64">
                <Image
                  src={item.image_path}
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-300">by {item.artist}</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{item.desc}</p>
                <Link href={`/apps-ui/g-user/collections/${item.slug}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-900 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition duration-300 text-sm font-medium"
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
}
