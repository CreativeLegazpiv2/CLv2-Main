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

  const handleShowMore = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 12); // Increase visible items by 12
  };

  return (
    <section className="sm:px-6 lg:px-8 min-h-screen pt-20">
      <div className="w-full max-w-[95%] mx-auto flex flex-col gap-6 p-4">
        <h1 className="text-3xl font-bold text-palette-1 uppercase">Gallery</h1>
        <div className="columns-1 sm:columns-2 md:columns- lg:columns-4 gap-4">
          {featuredItems.slice(0, visibleItems).map((item) => (
            <div key={item.id} className="mb-4 break-inside-avoid">
              <div className="bg-palette-6/20 rounded-3xl p-4 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <img
                    src={ "/images/creative-directory/profile.jpg"}  // item.profile_pic ||
                    alt={`${item.artist}'s profile`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-palette-7">
                      {item.artist}
                    </h4>
                    <span className="text-palette-1 text-sm font-bold">
                      {item.creative_field || "Creative Field"}
                    </span>
                  </div>
                </div>
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
      </div>
    </section>
  );
};


export const dummyData = [
  { id: 1, artist: "artist 1", creative_field: "Creative 1", image_path: "images/gallery/11.jpg", title: "Image 1" },
  { id: 2, artist: "artist 2", creative_field: "Creative 2", image_path: "images/gallery/2.jpg", title: "Image 2" },
  { id: 3, artist: "artist 3", creative_field: "Creative 3", image_path: "images/gallery/33.jpg", title: "Image 3" },
  { id: 4, artist: "artist 4", creative_field: "Creative 4", image_path: "images/gallery/44.jpg", title: "Image 4" },
  { id: 5, artist: "artist 5", creative_field: "Creative 5", image_path: "images/gallery/55.jpg", title: "Image 5" },
  { id: 6, artist: "artist 6", creative_field: "Creative 6", image_path: "images/gallery/66.jpg", title: "Image 5" },
  { id: 7, artist: "artist 7", creative_field: "Creative 7", image_path: "images/gallery/77.jpg", title: "Image 5" },
  { id: 8, artist: "artist 8", creative_field: "Creative 8", image_path: "images/gallery/88.jpg", title: "Image 5" },
  { id: 9, artist: "artist 9", creative_field: "Creative 9", image_path: "images/gallery/99.jpg", title: "Image 5" },
  { id: 10, artist: "artist 10", creative_field: "Creative 10", image_path: "images/gallery/10.jpg", title: "Image 5" },
  { id: 11, artist: "artist 11", creative_field: "Creative 11", image_path: "images/gallery/111.jpg", title: "Image 5" },
  { id: 12, artist: "artist 12", creative_field: "Creative 12", image_path: "images/gallery/12.png", title: "Image 5" },
]