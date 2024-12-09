"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";

interface UserDetails {
  detailsid: string;
  first_name: string;
  creative_field?: string;
  role?: string;
  profile_pic?: string;
  address: string;
  bio?: string;
  mobileNo: number;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  portfolioLink?: string;
  email?: string
  bday:string;
}

const iconNifyNonColored = [
  "mdi:facebook",
  "formkit:instagram",
  "dashicons:email-alt",
];

export const Profile = () => {
  // Get the 'view' parameter from the URL (detailsid)
  const params = useParams();
  const id = params?.view as string;

  // State to store user details
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user details when the component mounts
  useEffect(() => {
    if (id) {
      fetchUserDetails(id);
    }
  }, [id]);

  // Function to fetch user details from the API
  const fetchUserDetails = async (id: string) => {
    try {
      const response = await fetch("/api/fetchUsers/viewProfile", {
        method: "GET",
        headers: {
          dynamicId: id, // Pass detailsid in headers
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setUserDetails(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error state
  }

  if (!userDetails) {
    return <div>No user details found</div>; // If no data is available
  }

  // Destructure user details
  const {
    detailsid,
    first_name,
    bio,
    creative_field,
    profile_pic,
    address,
    mobileNo,
    instagram,
    facebook,
    twitter,
    portfolioLink,
    email,
    bday
  } = userDetails;

  const handleGalleryClick = async () => {
    try {
      // Make the API request
      const response = await fetch(`/api/directoryServices`, {
        method: 'GET',
        headers: {
          'User-ID': detailsid,
        },
      });
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error("Failed to fetch directory services data.");
      }
  
      const data = await response.json();
  
      // Log the data to inspect its structure
      console.log("API response data:", data);
  
      // Check if the user has uploaded any works
      if (data.exists) {
        // If works exist, navigate to the gallery page
        window.location.href = `/apps-ui/g-user/collections/${detailsid}`;
      } else {
        // Show error toast if no works are found
        toast.error("No uploaded works yet!", {
          position: "bottom-right",
        });
      }
    } catch (error) {
      // Log any errors to the console
      console.error("Error fetching gallery data:", error);
      toast.error("An error occurred while checking the gallery.", {
        position: "bottom-right",
      });
    }
  };
  
  
  return (
    <div className="w-full md:h-dvh h-fit md:max-w-[70%] max-w-[90%] mx-auto pt-[10dvh] flex flex-col md:flex-row gap-6 items-end justify-between">
      <ToastContainer />
      <div className="w-full md:h-[70dvh] h-fit md:pt-0 pt-[20dvh] border border-black z-50 flex flex-col-reverse md:flex-row md:gap-8 gap-4 justify-center items-center">
        <div className=" w-fit md:h-full h-fit border border-black flex md:flex-col flex-row items-center justify-center gap-4">
          {iconNifyNonColored.map((src, index) => (
            <Icon
              className="cursor-pointer text-white"
              key={index}
              icon={src}
              width="35"
              height="35"
            />
          ))}
        </div>
        <div className="w-full md:h-[70dvh] h-fit border border-black max-w-md rounded-t-3xl bg-white relative space-y-4">
          <div className="w-full flex flex-col h-[18rem] max-w-[18rem] rounded-full mx-auto -mt-[8rem] bg-white overflow-hidden">
            <img
              src={profile_pic || "/images/creative-directory/boy.png"}
              alt="Profile Picture"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full p-4 text-center flex flex-col gap-6">
            <div>
              <p className="text-2xl font-semibold uppercase ">

              </p>
              <p className="text-base"></p>
            </div>
            <div className="w-full">
              <p className="w-full max-w-sm mx-auto">
                {bio} {/* Display dynamic bio content */}
              </p>
              <div className="grid grid-cols-2 gap-1 md:hidden pt-4">
                <p>Email: {email}</p>
                <p>Name: {first_name}</p>
                <p>Bday: {bday}</p>
                <p>Address: {address}</p>
                <p>Mobile: {mobileNo}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-40 border mt-4 border-new-3 hover:bg-new-3 hover:text-white text-new-3 py-2 rounded-full mx-auto duration-300 ease-in-out"
              onClick={handleGalleryClick}
           >
              View Gallery
            </motion.button>
          </div>
        </div>
      </div>
      <div className="w-full h-[70dvh] max-w-screen-sm text-white z-50 md:text-right text-center flex flex-col justify-center items-end gap-6">
        <p className="text-6xl w-full max-w-sm uppercase">
          Creative field here
        </p>
        <p className="w-full max-w-lg text-lg">
          Creative field description here // Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Fugit minus tenetur, hic error voluptas
          voluptatem nostrum soluta eaque impedit voluptates cupiditate eveniet
          dignissimos sapiente quasi? Iure molestias veniam qui quidem.
        </p>
        <div className="flex-col gap-1 md:flex hidden">
          <p>{email}</p>
          <p>{first_name}</p>
          <p>{bday}</p>
          <p>{address}</p>
          <p>{mobileNo}</p>
        </div>
      </div>
    </div>
  );
};


