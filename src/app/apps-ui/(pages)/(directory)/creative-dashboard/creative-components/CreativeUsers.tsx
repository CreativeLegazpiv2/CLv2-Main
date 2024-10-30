"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { CreativeService } from "./CreativeArray"; // Adjust if file name differs
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css';
import { getSession } from "@/services/authservice";
import { supabase } from "@/services/supabaseClient";
import { jwtVerify } from "jose";

interface CreativeArrayProps {
    detailsid:any;
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

    if (loading) return <p>Loading creatives...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="w-full h-fit pb-[15dvh]">
            <ToastContainer />
            <div className="w-full h-full flex flex-col md:max-w-[80%] max-w-[90%] mx-auto">
                <div className="w-full p-6">
                    <h1 className="md:w-full w-fit mx-auto lg:text-5xl md:text-4xl text-2xl font-semibold uppercase md:text-left text-center leading-tight">meet our creatives</h1>
                </div>
                <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 lg:gap-16 md:gap-8 lg:gap-y-24 md:gap-y-12 gap-y-8 p-6">
                    {creativeUsers.map((user, id) => (
                        <UserCard key={id} detailsid={user.detailsid} first_name={user.first_name} bday={user.bday} bio={user.bio} profile_pic={user.profile_pic} imageBg={user.imageBg} />
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
    const hasBirthdayPassed = dateNow.getMonth() > bDayDate.getMonth() ||
                              (dateNow.getMonth() === bDayDate.getMonth() && dateNow.getDate() >= bDayDate.getDate());
    if (!hasBirthdayPassed) age--;
    return age;
};

const UserCard = ({ detailsid, first_name, bday, bio, profile_pic, imageBg }: CreativeArrayProps) => {
    const age = calculateAge(bday);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
    const [liked, setLiked] = useState<boolean>(false);
    const [totaluserLike, setTotaluserLike] = useState<number>(0);

    useEffect(() => {
        const fetchLikes = async (userId: any) => {
            const { data, error } = await supabase
                .from('usersLikes')
                .select('users, guest')
                .eq('galleryLiked', detailsid); // Adjust based on your table schema
    
            if (error) {
                console.error('Error fetching likes:', error);
                return;
            }
    
            if (data && data.length > 0) {
                const allUserLikes = data.flatMap(item => item.users); // Collecting all user arrays into one
        
        // Filter to get unique users manually
        const uniqueUserLikes = allUserLikes.filter((user, index, self) => self.indexOf(user) === index);
        
        // Get the guest likes count directly from the first item (assuming it's consistent)
        const guestLikesCount = Number(data[0].guest) || 0; // Take the guest count from the first record
        setLiked(uniqueUserLikes.includes(userId)); // Check if the current user liked the item
        // Set total user likes based on the unique user likes length plus guest likes
        const likes = guestLikesCount + uniqueUserLikes.length;
        setTotaluserLike(likes);  // Set total likes
                await fetchLikes(userId);
            } else {
                // If no likes, set total user likes to 0
                setTotaluserLike(0);
            }
        };
    
        const checkUserLikes = async () => {
            const token = getSession(); // Adjust this based on your session management
            let userId = null;
    
            if (token) {
                try {
                    const { payload } = await jwtVerify(
                        token,
                        new TextEncoder().encode(process.env.JWT_SECRET || "your-secret")
                    );
    
                    userId = payload.id; // Adjust based on your JWT structure
    
                    // Fetch likes only if userId is valid
                    if (userId) {
                        await fetchLikes(userId);
                    }
                } catch (error) {
                    console.error('Error verifying token:', error);
                }
            } else {
                // Handle guest users
                const guestsString = localStorage.getItem("guest");
                let guests: string[] = []; // Initialize guests as an empty array
    
                // Check if guestsString is not null and is a valid JSON
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
    
                // Check if detailsid exists in the array
                setLiked(guests.includes(detailsid)); // Set liked state based on localStorage
            }
        };
    
        checkUserLikes();
    
        const subscription = supabase
            .channel('fetchlikes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'usersLikes',
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
            try {
                const { payload } = await jwtVerify(
                    token,
                    new TextEncoder().encode(process.env.JWT_SECRET || "your-secret")
                );
                userId = payload.id;
            } catch (error) {
                console.error("Error verifying token:", error);
                toast.error("An error occurred while processing your request.", {
                    position: "bottom-center",
                });
                return;
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
                    } else {
                        console.error("Parsed guests is not an array:", parsedGuests);
                    }
                } catch (error) {
                    console.error("Error parsing guests:", error);
                }
            }
    
            // Check if detailsid exists in the array
            const index = guests.indexOf(detailsid);
    
            if (index !== -1) {
                // If it exists, remove the detailsid from the array
                guests.splice(index, 1);
                console.log(`Removed ${detailsid} from guests.`);
                setLiked(false); // Update liked state
            } else {
                // If it doesn't exist, add detailsid to the array
                guests.push(detailsid);
                console.log(`Added ${detailsid} to guests.`);
                setLiked(true); // Update liked state
            }
    
            // Store the updated array back to localStorage
            localStorage.setItem("guest", JSON.stringify(guests));
            return; // Exit the function after handling guest likes
        }
    
        try {
            // Send like request to the backend
            const response = await fetch(`/api/fetchUsers/userLikes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, detailsid }),
            });
    
            const data = await response.json();
            if (response.ok) {
                toast.success(data.message, { position: "bottom-center" });
                setLiked((prevLiked) => !prevLiked); // Toggle liked state
            } else {
                toast.error(data.message || "Failed to like. Please try again.", {
                    position: "bottom-center",
                });
            }
        } catch (error) {
            console.error("Error liking service:", error);
            toast.error("An error occurred while liking.", { position: "bottom-center" });
        }
    };


    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
            className="w-full border border-gray-400 rounded-xl p-4 bg-secondary-1 shadow-customShadow">
            <div className="flex flex-col">             
                <div className="w-full h-52 relative">
                    <img className="w-full h-full object-cover" src={imageBg || "../images/landing-page/eabab.png"} alt="" />
                </div>
                <div className="w-full h-full max-h-28 -mt-8 flex justify-between items-center">
                    <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>                  <Icon
                    className="cursor-pointer text-red-400"
                    icon={liked ? "jam:heart-f" : "jam:heart"}
                    width="35"
                    height="35"
                    onClick={() => handleLike(detailsid)}
                  /></motion.span>
                  {totaluserLike}
                    <img className="h-28 w-28 z-50 rounded-full object-cover" src={profile_pic || "../images/creative-directory/boy.png"} alt="" />
                    <div className="w-4"></div>
                </div>
                <div className="w-full min-h-32 max-h-fit mt-6">
                    <div className="w-full h-full max-w-[87%] mx-auto flex flex-col gap-2 justify-center items-center">
                        <h6 className="text-center text-2xl font-bold">{first_name}, {age}</h6>
                        <p className={`text-center text-xs font-semibold ${bio.length > 100 ? "line-clamp-6" : ""}`}>{bio}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
