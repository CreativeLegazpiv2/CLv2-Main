'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getRole, getSession } from '@/services/authservice';
import { jwtVerify } from 'jose';
import { div } from 'framer-motion/client';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';

interface Collection {
  id: string; // or number, depending on your schema
  image_path: string;
  artist: string;
  title: string;
  desc: string;
  slug: string;
}

export const CollectionsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [isRole, setRole] = useState<string | null>(null);
  // Fetch image collections when the component mounts

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the token from the session
        const token = getSession();
  
        // Check if the token exists
        if (!token) {
          throw new Error('No session token found');
        }
  
        // Verify and decode the token
        const { payload } = await jwtVerify(
          token,
          new TextEncoder().encode(JWT_SECRET)
        );
  
        // Extract the user ID from the token payload
        const userIdFromToken = payload.id as string;
  
        // Call the API with the userIdFromToken
        const response = await fetch('/api/user', {
          method: 'GET',
          headers: {
            'Authorization': userIdFromToken, // Pass the userId as the Authorization header
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
  
        // Parse the response JSON
        const data = await response.json();
  
        // Store the first_name in localStorage under the key "Fname"
        if (data.first_name) {
          localStorage.setItem('Fname', data.first_name);
          console.log('First name stored in localStorage:', data.first_name);
        } else {
          console.error('No first_name found in the response');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
  
    fetchUserData();
  }, []);


  useEffect(() => {
    const role = getRole() as string;
    setRole(role);
    if (role != 'buyer') {
      const fetchCollections = async () => {
        try {
          const token = getSession();
          if (!token) return;
          const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
          const userId = payload.id as string;
          const response = await fetch('/api/session_collection', {
            method: 'GET',
            headers: {
              Authorization: userId,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch collections');
          }

          const data = await response.json();
          setCollections(data.messages); // Update state with the fetched collections
        } catch (error) {
          console.error('Error fetching collections:', error);
        } finally {
          setLoading(false); // Set loading to false after fetching
        }
      };

      fetchCollections();
    }

  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % collections.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + collections.length) % collections.length);
  };

  if (collections.length === 0) {
    return (

      <div className="text-center">
        {isRole != 'buyer' && (
          <>
            No collections found.
            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/apps-ui/g-user/publish">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-700 transition duration-300 shadow-lg"
                >
                  ADD MORE COLLECTIONS
                </motion.button>
              </Link>
            </motion.div>
          </>
        )}

      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 py-20 px-4 sm:px-6 lg:px-8">
      {isRole != 'buyer' && (
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold text-gray-900 mb-2 text-center"
          >
            YOUR COLLECTIONS
          </motion.h2>
          <motion.hr
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.5 }}
            className="border-t-2 border-gray-300 w-24 mx-auto mb-12"
          />
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="h-[500px] md:h-[600px]">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute top-0 left-0 w-full h-full flex flex-col md:flex-row"
                >
                  <div className="w-full md:w-1/2 h-64 md:h-full relative">
                    <Image
                      src={collections[currentIndex].image_path}
                      alt={collections[currentIndex].title}
                      layout="fill"
                      objectFit="cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30" />
                  </div>
                  <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="text-3xl font-bold text-gray-900 mb-4"
                    >
                      {collections[currentIndex].title}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-gray-600 mb-8 leading-relaxed"
                    >
                      {collections[currentIndex].desc}
                    </motion.p>
                    <Link href={`/apps-ui/g-user/collections/${collections[currentIndex].slug}`}>
                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "#1a202c" }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gray-900 text-white px-8 py-3 rounded-full text-lg font-medium transition duration-300 ease-in-out transform hover:shadow-lg"
                      >
                        View This Collection
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/apps-ui/g-user/publish">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-700 transition duration-300 shadow-lg"
              >
                ADD MORE COLLECTIONS
              </motion.button>
            </Link>
          </motion.div>
        </div>
      )}

    </div>
  );
}
