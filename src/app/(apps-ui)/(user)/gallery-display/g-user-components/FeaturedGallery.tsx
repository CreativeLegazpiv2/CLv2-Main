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
    const [currentIndex, setCurrentIndex] = useState(0);

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

    useEffect(() => {
      const storedIndex = localStorage.getItem("currentIndex");
      if (storedIndex) {
        setCurrentIndex(parseInt(storedIndex, 10));
      }
    }, []);

    useEffect(() => {
      localStorage.setItem("currentIndex", currentIndex.toString());
    }, [currentIndex]);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex(
          (prevIndex) => (prevIndex + 1) % Math.ceil(featuredItems.length / 6)
        );
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }, [featuredItems.length]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg text-palette-7">Loading collections...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg text-red-500">Error: {error}</p>
        </div>
      );
    }

    return (
      <section className="bg-palette-5 sm:px-6 lg:px-8 min-h-screen pt-20">
        <div className=" px-6 md:px-12">
          <div className="columns-1 sm:columns-2 md:columns-4 lg:columns-5 gap-4">
            {featuredItems.map((item) => (
              <div key={item.id} className="mb-4 break-inside-avoid">
                <div className="bg-palette-7/10 rounded-3xl p-4 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.profile_pic || "/images/creative-directory/profile.jpg"}
                      alt={`${item.artist}'s profile`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div >
                      <h4 className="text-sm font-semibold text-palette-7">
                        {item.artist}
                      </h4>
                      <span className="text-palette-1 text-sm font-bold">
                        {item.creative_field || "Creative Field"}
                      </span>
                    </div>
                  </div>

                  <div
                    onClick={() => window.location.href = `/gallery-display/collections/${item.slug}`}
                    className="w-full relative cursor-pointer rounded-3xl overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition-opacity duration-300 ease-in-out z-10"></div>
                    {/* for now */}
                    <div className="max-h-[24rem] overflow-hidden bg-white">
                      <img
                        src={item.image_path}
                        alt={item.title}
                        className="w-full h-fit object-contain"
                        style={{
                          maxHeight: '24rem', // 64 (h-64) in rem units
                          width: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };