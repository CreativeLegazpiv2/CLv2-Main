import { useState, useEffect } from "react";
import Link from "next/link";
import { getSession } from "@/services/authservice";

export const Buttons = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check user authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await getSession();
        setIsLoggedIn(!!session); // ✅ Convert session object to boolean
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="w-fit flex gap-6">
      {/* If NOT logged in, show both "Join" and "Explore" */}
      {!isLoggedIn ? (
        <>
          <Link href="/signin">
            <button className="w-36 py-2 z-20 bg-palette-6 uppercase text-palette-5 rounded-full font-semibold tracking-wider">
              Join
            </button>
          </Link>
          <Link href="/gallery">
            <button className="w-36 py-2 z-20 bg-palette-3 uppercase text-palette-5 rounded-full font-semibold tracking-wider">
              Explore
            </button>
          </Link>
        </>
      ) : (
        // If logged in, show only "Explore"
        <Link href="/gallery">
          <button className="w-full min-w-44 py-2 z-20 bg-palette-3 uppercase text-palette-5 rounded-full font-semibold tracking-wider">
            Explore
          </button>
        </Link>
      )}
    </div>
  );
};
