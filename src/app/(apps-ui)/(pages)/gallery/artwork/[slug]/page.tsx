// pages/g-visitor/artwork/[id].tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { fetchArtworks, Artwork } from '@/services/Collections/fetchArtworks';

const ArtworkDetailPage: React.FC = () => {
  const params = useParams();
  const slug = params?.slug as string; // Dynamic route parameter

  const [artworksData, setArtworksData] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);


  const handleSelect = (index: number) => {
    setSelectedIndex(index); // Update selected index on click
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchArtworks();
        setArtworksData(data);
        console.log("Fetched Artworks Data:", data); // Log the fetched data
      } catch (err) {
        console.error('Error fetching artworks:', err);
        setError('Failed to fetch artworks');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  if (error) {
    return <div>{error}</div>;
  }

  // Find the artwork by matching the 'id' with 'related.sluger'
  const artwork = artworksData.find(art => art.relatedWorks?.some(related => related.slug === slug));

  if (!artwork) {
    return <div>Artwork not found</div>;
  }

  return (
    <div className="artwork-detail-page bg-white min-h-screen pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {artwork.relatedWorks && artwork.relatedWorks.length > 0 && (
          <>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              {artwork.relatedWorks[selectedIndex].title}
            </motion.h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative h-96 rounded-lg overflow-hidden shadow-lg"
              >
                <Image
                  src={artwork.relatedWorks[selectedIndex].path} // Use selected artwork path
                  alt={artwork.relatedWorks[selectedIndex].title}
                  fill
                  className="transition-transform duration-300 hover:scale-105"
                />
              </motion.div>
              <div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl text-gray-600 mb-8"
                >
                  {artwork.relatedWorks[selectedIndex].desc}
                </motion.p>
                <div className="bg-gray-100 p-6 rounded-lg">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Artwork Details</h2>
                  <p className="text-gray-600">Artist: {artwork.relatedWorks[selectedIndex].artist}</p>
                  <p className="text-gray-600">Year: {artwork.relatedWorks[selectedIndex].year}</p>
                </div>
              </div>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Related Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {artwork.relatedWorks.map((related, index) => (
                  <div
                    className={`relative overflow-hidden rounded-lg shadow-md h-48 cursor-pointer ${selectedIndex === index ? 'ring-2 ring-blue-500' : ''}`}
                    key={related.slug}
                    onClick={() => handleSelect(index)}
                  >
                    <Image
                      src={related.path}
                      alt={related.title}
                      fill
                      className="transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                      <p className="font-semibold">{related.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default ArtworkDetailPage;
