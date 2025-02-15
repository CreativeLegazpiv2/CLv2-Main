"use client";
import React, { useEffect, useState } from "react";

interface CollectionItem {
  id: number;
  title: string;
  desc: string;
  image_path: string;
  artist: string;
  slug: string;
  profile_pic: string;
  creative_field: string;
}

export const FeaturedCollections = () => {
  const [featuredItems, setFeaturedItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleItems, setVisibleItems] = useState(12); // Number of items to display initially

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await fetch("/api/collections");
        const data = await response.json();
        if (response.ok) {
          setFeaturedItems(data.imageCollection);
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

  const handleShowMore = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 12); // Increase visible items by 12
  };

  return (
    <section className="sm:px-6 lg:px-8 min-h-screen py-20">
      <div className="w-full max-w-[95%] mx-auto flex flex-col gap-6 p-4">
        {/* Title */}
        <h1 className="text-3xl font-bold text-palette-1 uppercase">Gallery</h1>

        {/* Loading State */}
        {loading ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="mb-4 break-inside-avoid animate-pulse">
                <div className="bg-palette-6/20 rounded-3xl p-4 flex flex-col gap-4">
                  {/* Profile Section Skeleton */}
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                    <div className="flex flex-col gap-2">
                      <div className="w-24 h-4 bg-gray-300 rounded"></div>
                      <div className="w-16 h-3 bg-gray-300 rounded"></div>
                    </div>
                  </div>

                  {/* Image Section Skeleton */}
                  <div className="w-full relative cursor-pointer rounded-3xl overflow-hidden">
                    <div className="max-h-[32rem] overflow-hidden">
                      <div className="w-full h-64 bg-gray-300 rounded-3xl"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-lg text-red-500">Error: {error}</p>
          </div>
        ) : (
          <>
            {/* Actual Content */}
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
              {featuredItems.slice(0, visibleItems).map((item) => (
                <div key={item.id} className="mb-4 break-inside-avoid">
                  <div className="bg-palette-6/20 rounded-3xl p-4 flex flex-col gap-4">
                    {/* Profile Section */}
                    <div className="flex items-center gap-2">
                      <img
                        src={item.profile_pic || "/images/creative-directory/profile.jpg"}
                        alt={`${item.artist}'s profile`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-palette-7">{item.artist}</h4>
                        <span className="text-palette-1 text-sm font-bold">
                          {item.creative_field || "Creative Field"}
                        </span>
                      </div>
                    </div>

                    {/* Image Section */}
                    <div
                      onClick={() =>
                        (window.location.href = `/gallery-display/collections/${item.slug}`)
                      }
                      className="w-full relative cursor-pointer rounded-3xl overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition-opacity duration-300 ease-in-out z-10"></div>
                      <div className="max-h-[32rem] overflow-hidden">
                        <img
                          src={item.image_path}
                          alt={item.title}
                          className="w-full h-fit object-fill"
                          style={{
                            maxHeight: "32rem",
                            width: "100%",
                            objectFit: "fill",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More Button */}
            {visibleItems < featuredItems.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleShowMore}
                  className="px-6 py-2 bg-palette-7 text-white rounded-lg hover:bg-palette-6 transition-colors"
                >
                  Show More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};