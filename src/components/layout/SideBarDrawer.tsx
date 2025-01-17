"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { getSession, logoutUser } from "@/services/authservice";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useBreakpoint } from "use-breakpoint";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  backgroundColor?: string;
  textColor?: string;
  buttonName?: string;
  linkName?: string;
  roundedCustom?: string;
  paddingLeftCustom?: string;
  menuItems?: MenuItemProps[];
}

interface MenuItemProps {
  name: string;
  link: string;
}

const BREAKPOINTS = { sm: 0, md: 768, lg: 1024 };

export function SidebarDrawer({
  isOpen,
  onClose,
  linkName = "/signin",
  buttonName = "Log in",
  backgroundColor = "bg-white",
  textColor = "text-gray-400",
}: SidebarProps) {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const gsapAnimationRef = useRef<gsap.core.Timeline | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItemProps[]>([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { breakpoint } = useBreakpoint(BREAKPOINTS, "sm");

  // Add this useEffect
  useEffect(() => {
    checkAuth();
  }, []); // Empty dependency array means this runs once on mount

  const checkAuth = async () => {
    try {
      const session = await getSession();
      setIsLoggedIn(!!session);

      if (session) {
        setMenuItems([
          { name: "Home", link: "/home" },
          { name: "Directory", link: "/creative-dashboard" },
          { name: "Gallery", link: "/g-user" },
          { name: "FAQ", link: "/faqs" },
          { name: "Events", link: "/events" },
          { name: "Profile", link: "/profile" },
        ]);
      } else {
        setMenuItems([
          { name: "Home", link: "/home" },
          { name: "Directory", link: "/creative-dashboard" },
          { name: "Gallery", link: "/g-visitor" },
          { name: "FAQ", link: "/faqs" },
          { name: "Events", link: "/events" },
        ]);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Notify layout about logout
      window.dispatchEvent(new Event("logoutStart"));

      // Kill GSAP animations
      if (gsapAnimationRef.current) {
        gsapAnimationRef.current.kill();
        gsapAnimationRef.current = null;
      }

      // Perform logout
      await logoutUser();

      // Clean up states
      setIsLoggedIn(false);
      setMenuItems([]);

      // Small delay to ensure cleanup
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Navigate using replace
      router.replace("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClose}
      className="w-full h-dvh fixed bottom-0 left-0 z-[600] bg-black bg-opacity-50 xl:hidden"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{
          x: breakpoint === "md" || breakpoint === "lg" ? "100%" : "-100%",
          opacity: 0,
        }}
        animate={{ x: 0, opacity: 1 }}
        exit={{
          x: breakpoint === "md" || breakpoint === "lg" ? "100%" : "-100%",
          opacity: 0,
        }}
        transition={{ duration: 0.5 }}
        className={`w-full md:max-w-md max-w-sm md:right-0 bottom-0 absolute h-full max-h-[90dvh] ${backgroundColor}`}
      >
        <div className="w-full h-full  relative">
          <button
            onClick={onClose}
            className="absolute top-4 md:left-4 right-4"
          >
            <Icon icon="mdi:close" width={24} height={24} />
          </button>
          {/* Sidebar content goes here */}
          <div className="p-4 flex flex-col justify-between items-start h-full w-full">
            {/* Add your sidebar navigation or content */}
            <div className="w-full h-full mt-12">
              <h2 className={`text-base px-2 font-bold uppercase ${textColor}`}>
                Sidebar Menu
              </h2>
              {/* Example menu items */}
              <nav className="mt-4 w-full flex flex-col gap-4">
                {menuItems.map((item, index) => (
                  <MenuItem key={index} {...item} />
                ))}
              </nav>
            </div>
            <div className="flex flex-col gap-4 w-full ">
              <h2 className={`text-base px-2 font-bold uppercase ${textColor}`}>
                Other option
              </h2>
              {isLoggedIn ? (
                <motion.button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={`
                p-3 w-full
                rounded-xl 
                bg-primary-2
                text-white 
                text-center 
                uppercase 
                font-bold 
                tracking-wider 
                transform 
                transition-all 
                duration-300 
                ease-in-out
                group-hover:rotate-y-6 
                group-hover:shadow-2xl 
                group-hover:translate-y-[-5px]
                border-opacity-20 
                border-white
                relative 
                overflow-hidden
                ${isLoggingOut ? "opacity-50 cursor-not-allowed" : ""}`}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "#6E352C",
                    color: "#ffff",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </motion.button>
              ) : (
                <Link href={linkName}>
                  <motion.button
                    className="uppercase w-full py-2.5 font-semibold rounded-md 
                p-3
                bg-primary-2
                text-white 
                text-center 
                tracking-wider 
                transform 
                transition-all 
                duration-300 
                ease-in-out
                group-hover:rotate-y-6 
                group-hover:shadow-2xl 
                group-hover:translate-y-[-5px]
                border-opacity-20 
                border-white
                relative 
                overflow-hidden"
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "#403737",
                      color: "#fff",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {buttonName}
                  </motion.button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const MenuItem = ({ name, link }: MenuItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <motion.a
      href={link}
      className={`flex flex-col group perspective-1000`}
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`
          ${
            isActive
              ? "bg-gradient-to-br from-primary-1 to-primary-2"
              : "bg-gradient-to-br from-primary-2 to-primary-1"
          }
            p-3 
            rounded-xl 
            bg-gradient-to-br 
            from-primary-1 
            to-primary-2
            text-white 
            text-center 
            uppercase 
            font-bold 
            tracking-wider 
            transform 
            transition-all 
            duration-300 
            ease-in-out
            group-hover:rotate-y-6 
            group-hover:shadow-2xl 
            group-hover:translate-y-[-5px]
            border-opacity-20 
            border-white
            relative 
            overflow-hidden
          `}
      >
        {/* Glare effect */}
        <div
          className="
              absolute 
              top-0 
              left-0 
              right-0 
              bottom-0 
              bg-white 
              bg-opacity-10 
              transform 
              -skew-x-12 
              -translate-x-full 
              group-hover:translate-x-full 
              transition-transform 
              duration-500 
              ease-in-out
            "
        />

        {/* 3D Shadow */}
        <div
          className="
              absolute 
              inset-0 
              bg-black 
              bg-opacity-10 
              transform 
              translate-y-1 
              -z-10 
              rounded-xl 
              group-hover:translate-y-2
              transition-transform 
              duration-300
            "
        />

        {name}
      </div>
    </motion.a>
  );
};
