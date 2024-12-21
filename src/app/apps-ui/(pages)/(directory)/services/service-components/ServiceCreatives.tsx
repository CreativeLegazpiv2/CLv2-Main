"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface UserCardProps {
  first_name: string;
  profile_pic: string;
  bio: string;
  newCount: number;
}

export const ServiceCreatives = () => {
  const params = useParams();
  const field = params?.creative as string;

  const [creatives, setCreatives] = useState<UserCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreatives = async () => {
      try {
        // Fetch data from the dynamic API route
        const response = await fetch(`/api/creatives/topCreatives/${field}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        // Transform the data to include default values for missing fields
        const transformedData = data.map((item: any) => ({
          first_name: item.first_name,
          profile_pic: item.profile_pic || "/images/creative-directory/boy.png",
          bio: item.bio || "No bio available",
          newCount: item.newCount || 0, // Ensure newCount is always a number
        }));

        // Sort the data by newCount in descending order
        transformedData.sort((a: UserCardProps, b: UserCardProps) => b.newCount - a.newCount);

        // Set the sorted data to the state
        setCreatives(transformedData);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (field) {
      fetchCreatives();
    }
  }, [field]);

  return (
    <div className="w-full h-fit relative">
      <div className="w-full h-full flex flex-col gap-[10dvh] justify-center items-center">
        <h1 className="uppercase font-bold lg:text-5xl text-4xl w-full max-w-full lg:max-w-[70%] lg:text-left text-center">
          Top Creatives
        </h1>
        <div className="w-full relative">
          <div className="w-full max-w-[90%] mx-auto">
            <div className="w-full h-fit grid lg:grid-cols-3 grid-cols-1 gap-8 p-4">
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p>Error: {error}</p>
              ) : (
                // Render the sorted list of creatives
                creatives.map((user, id) => (
                  <UserCards
                    key={id}
                    first_name={user.first_name}
                    profile_pic={user.profile_pic}
                    bio={user.bio}
                    newCount={user.newCount} // Use newCount here
                  />
                ))
              )}
            </div>
          </div>
          <div className="w-full lg:h-[70%] h-full absolute top-1/2 -translate-y-1/2 right-0 flex justify-center items-center bg-shade-1" />
        </div>
      </div>
    </div>
  );
};

const UserCards: React.FC<UserCardProps> = ({ first_name, profile_pic, bio, newCount }) => {
  return (
    <div className="p-4 bg-secondary-1 z-50 shadow-customShadow flex justify-center items-center gap-4 rounded-3xl">
      <div className="w-full max-w-36 h-36 rounded-full overflow-hidden">
        <img className="w-full max-w-36 h-36 object-cover" src={profile_pic} alt={first_name} />
      </div>
      <div className="w-full flex flex-col justify-center items-start gap-2">
        <h1 className="font-semibold text-2xl">{first_name}</h1>
        <p className={`font-normal text-sm ${bio.length > 100 ? "line-clamp-5" : ""}`}>
          {bio}
        </p>
        <p className="text-sm text-gray-500">Total Likes: {newCount}</p>
      </div>
    </div>
  );
};