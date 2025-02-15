import { useState, useEffect } from "react";
import Link from "next/link";
import { getSession } from "@/services/authservice";
import { motion } from "framer-motion";

const DirectoryButtons = () => {
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
    <div className="w-full gap-4 flex md:flex-row flex-col md:items-center items-start">
      {/* "Explore Directory" button is always visible */}
      <Link href="/creative-directory" className="md:w-fit w-full">
        <motion.button
          className="md:w-52 w-full tracking-wider rounded-full py-2 font-semibold bg-palette-5 text-palette-3 uppercase"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.5,
            type: "spring",
            bounce: 0.4
          }}
        >
          explore directory
        </motion.button>
      </Link>

      {/* "Register" button is only shown if NOT logged in */}
      {!isLoggedIn && (
        <Link href="/signup" className="md:w-fit w-full">
          <motion.button
            className="md:w-52 w-full tracking-wider rounded-full py-2 font-semibold bg-palette-3 text-palette-5 uppercase"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              type: "spring",
              bounce: 0.4
            }}
          >
            register
          </motion.button>
        </Link>
      )}
    </div>
  );
};

export default DirectoryButtons;
