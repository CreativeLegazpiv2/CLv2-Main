"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { CreativeService } from "./CreativeArray"; // Adjust if file name differs
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css";
import { getSession } from "@/services/authservice";
import { supabase } from "@/services/supabaseClient";
import { jwtVerify } from "jose";

interface CreativeArrayProps {
  detailsid: any;
  first_name: string;
  bday: string;
  bio: string;
  profile_pic: string;
  imageBg: string;
}
export const CreativeUsers = () => {
  const [creativeUsers, setCreativeUsers] = useState<CreativeArrayProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await CreativeService.fetchCreativeUsers();
        setCreativeUsers(users);
      } catch (error) {
        setError("Failed to load creatives.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="w-full h-fit pb-[15dvh]">
      <ToastContainer />
      <div className="w-full h-full flex flex-col md:max-w-[80%] max-w-[90%] mx-auto">
        <div className="w-full p-6">
          <h1 className="md:w-full w-fit mx-auto lg:text-5xl md:text-4xl text-2xl font-semibold uppercase md:text-left text-center leading-tight">
            meet our creatives
          </h1>
        </div>
        <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 lg:gap-16 md:gap-8 lg:gap-y-24 md:gap-y-12 gap-y-8 p-6">
          {creativeUsers.map((user, id) => (
            <UserCard
              key={id}
              detailsid={user.detailsid}
              first_name={user.first_name}
              bday={user.bday}
              bio={user.bio}
              profile_pic={user.profile_pic}
              imageBg={user.imageBg}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const calculateAge = (bDay: string | Date) => {
  const dateNow = new Date();
  const bDayDate = new Date(bDay);
  let age = dateNow.getFullYear() - bDayDate.getFullYear();
  const hasBirthdayPassed =
    dateNow.getMonth() > bDayDate.getMonth() ||
    (dateNow.getMonth() === bDayDate.getMonth() &&
      dateNow.getDate() >= bDayDate.getDate());
  if (!hasBirthdayPassed) age--;
  return age;
};

const UserCard = ({
  detailsid,
  first_name,
  bday,
  bio,
  profile_pic,
  imageBg,
}: CreativeArrayProps) => {
  const age = calculateAge(bday);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [liked, setLiked] = useState<boolean>(false);
  const [totaluserLike, setTotaluserLike] = useState<number>(0);

  useEffect(() => {
    const guestsString = localStorage.getItem("guest");
    let guests: string[] = [];

    if (guestsString) {
      try {
        const parsedGuests = JSON.parse(guestsString);
        if (Array.isArray(parsedGuests)) {
          guests = parsedGuests;
        } else {
          console.error("Parsed guests is not an array:", parsedGuests);
        }
      } catch (error) {
        console.error("Error parsing guests:", error);
      }
    }
    // Initialize liked state based on local storage
    setLiked(guests.includes(detailsid));

    const fetchLikes = async (userId: any) => {
      const { data, error } = await supabase
        .from("usersLikes")
        .select("users, guest")
        .eq("galleryLiked", detailsid);

      if (error) {
        console.error("Error fetching likes:", error);
        return;
      }

      if (data && data.length > 0) {
        const allUserLikes = data.flatMap((item) => item.users);
        const uniqueUserLikes = allUserLikes.filter(
          (user, index, self) => self.indexOf(user) === index
        );

        const guestLikesCount = Number(data[0].guest) || 0;
        setLiked(uniqueUserLikes.includes(userId));

        const likes = guestLikesCount + uniqueUserLikes.length;
        setTotaluserLike(likes);
      } else {
        setTotaluserLike(0);
      }
    };

    const checkUserLikes = async () => {
      const token = getSession();
      let userId = null;

      const guestsString = localStorage.getItem("guest");
      let guests: string[] = [];

      if (guestsString) {
        try {
          const parsedGuests = JSON.parse(guestsString);
          if (Array.isArray(parsedGuests)) {
            guests = parsedGuests;
          }
        } catch (error) {
          console.error("Error parsing guests:", error);
        }
      }
      if (guests.includes(detailsid)) {
        // Guest has liked
        setLiked(true);
      } else {
        // Guest has disliked or hasn't liked yet
        setLiked(false);
      }

      if (token) {
        try {
          const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET || "your-secret")
          );

          userId = payload.id;

          if (userId) {
            await fetchLikes(userId);
          }
        } catch (error) {
          console.error("Error verifying token:", error);
        }
      } else {
        await fetchLikes(null);
        setLiked(guests.includes(detailsid));
      }
    };

    checkUserLikes();

    const subscription = supabase
      .channel("fetchlikes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "usersLikes",
        },
        (payload: any) => {
          checkUserLikes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [detailsid]);

  const handleLike = async (detailsid: string) => {
    const token = getSession();
    let userId = null;

    if (token) {
      // Logged-in user
      try {
        const { payload } = await jwtVerify(
          token,
          new TextEncoder().encode(process.env.JWT_SECRET || "your-secret")
        );
        userId = payload.id as string;

        // Check if the user already liked this item
        if (liked) {
          // User already liked, so we dislike
          await updateLikeStatus(userId, detailsid, "dislike");
          setLiked(false);
          setTotaluserLike((prevTotal) => prevTotal - 1);
        } else {
          // User is liking for the first time
          await updateLikeStatus(userId, detailsid, "like");
          setLiked(true);
          setTotaluserLike((prevTotal) => prevTotal + 1);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        toast.error("An error occurred while processing your request.", {
          position: "bottom-right",
        });
      }
    } else {
      // Handle guest users
      const guestsString = localStorage.getItem("guest");
      let guests: string[] = [];

      if (guestsString) {
        try {
          const parsedGuests = JSON.parse(guestsString);
          if (Array.isArray(parsedGuests)) {
            guests = parsedGuests;
          }
        } catch (error) {
          console.error("Error parsing guests:", error);
        }
      }

      const index = guests.indexOf(detailsid);

      if (index !== -1) {
        // Guest dislikes: Remove from array
        guests.splice(index, 1);
        setLiked(false); // Update liked state
        setTotaluserLike((prevTotal) => prevTotal - 1); // Decrement total likes
      } else {
        // Guest likes: Add to array
        guests.push(detailsid);
        setLiked(true); // Update liked state
        setTotaluserLike((prevTotal) => prevTotal + 1); // Increment total likes
      }

      // Update localStorage
      localStorage.setItem("guest", JSON.stringify(guests));

      // Send request to update guest count in backend
      try {
        const response = await fetch(`/api/fetchUsers/userLikes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ detailsid, guestStorage: guests }),
        });

        const data = await response.json();
        if (!response.ok) {
          toast.error(
            data.message || "Failed to update guest count. Please try again.",
            {
              position: "bottom-right",
            }
          );
        }
      } catch (error) {
        console.error("Error updating guest count:", error);
      }
    }
  };

  // Helper function to update like/dislike in the backend for logged-in users
  const updateLikeStatus = async (
    userId: string,
    detailsid: string,
    action: string
  ) => {
    try {
      const response = await fetch(`/api/fetchUsers/userLikes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, detailsid, action }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(`${action} successful!`);
      } else {
        console.error(`${action} failed:`, data.message);
      }
    } catch (error) {
      console.error(`Error during ${action}:`, error);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      className="w-full border border-gray-400 rounded-xl p-4 bg-secondary-1 shadow-customShadow "
    >
      <div className="flex flex-col ">
        <div className="w-full h-52 relative">
          <img
            className="w-full h-full object-cover"
            src={imageBg || "../images/landing-page/eabab.png"}
            alt=""
          />
        </div>
        <div className="w-full h-full max-h-28 -mt-8 flex justify-center items-center relative">
          <div className="w-fit flex items-center justify-center gap-1.5 cursor-pointer absolute left-0 -translate-y-1/2 mt-6">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className=""
            >
              {" "}
              <Icon
                className="cursor-pointer text-red-400"
                icon={liked ? "jam:heart-f" : "jam:heart"}
                width="35"
                height="35"
                onClick={() => handleLike(detailsid)}
              />
            </motion.span>
            {totaluserLike}
          </div>

          <img
            className="h-28 w-28 z-50 rounded-full object-cover"
            src={profile_pic || "../images/creative-directory/boy.png"}
            alt=""
          />
        </div>
        <div className="w-full min-h-32 max-h-fit mt-6">
          <div className="w-full h-full max-w-[87%] mx-auto flex flex-col gap-2 justify-center items-center">
            <h6 className="text-center text-2xl font-bold">
              {first_name}, {age}
            </h6>
            <p
              className={`text-center text-xs font-semibold ${
                bio.length > 100 ? "line-clamp-6" : ""
              }`}
            >
              {bio}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
