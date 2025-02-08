"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useBreakpoint } from "use-breakpoint";
import { getSession, getUserDetailsFromToken, logoutUser } from "@/services/authservice";
import {
  Home,
  FolderKanban,
  Image as ImageIcon,
  HelpCircle,
  Calendar,
  User,
  LogOut,
  LogIn,
  X,
  ChevronRight,
} from "lucide-react";

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
  icon?: React.ReactNode;
}

const BREAKPOINTS = { sm: 0, md: 768, lg: 1024 };

const COLORS = {
  maroon: "#6E352C",
  scarlet: "#CE5230",
  orange: "#F49A44",
  cream: "#E4C597",
  white: "#FAF3E1",
  olive: "#6E602F",
  black: "#222222",
};

export function SidebarDrawer({
  isOpen,
  onClose,
  linkName = "/signin",
  buttonName = "Log in",
  backgroundColor = COLORS.olive,
  textColor = COLORS.white,
}: SidebarProps) {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const gsapAnimationRef = useRef<gsap.core.Timeline | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItemProps[]>([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { breakpoint } = useBreakpoint(BREAKPOINTS, "sm");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const session = await getSession();
      setIsLoggedIn(!!session);

      if (session) {

        try {
          const userDetails = await getUserDetailsFromToken()

          if (userDetails && userDetails.detailsid) {
            setMenuItems([
              { name: "Home", link: "/home" },
              { name: "Directory", link: "/creative-directory" },
              { name: "Gallery", link: "/gallery-display" },
              { name: "FAQ", link: "/faqs" },
              { name: "Events", link: "/events" },
              {
                name: "Profile",
                link: `/gallery-display/collections/${userDetails.detailsid}`,
              },
            ])
          } else {
            console.error("User details or detailsid not found")
          }
        } catch (error) {
          console.error("Error fetching user details:", error)
        }
      } else {
        setMenuItems([
          { name: "Home", link: "/home", icon: <Home size={20} /> },
          {
            name: "Directory",
            link: "/creative-directory",
            icon: <FolderKanban size={20} />,
          },
          {
            name: "Gallery",
            link: "/gallery",
            icon: <ImageIcon size={20} />,
          },
          { name: "FAQ", link: "/faqs", icon: <HelpCircle size={20} /> },
          { name: "Events", link: "/events", icon: <Calendar size={20} /> },
        ]);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      window.dispatchEvent(new Event("logoutStart"));

      if (gsapAnimationRef.current) {
        gsapAnimationRef.current.kill();
        gsapAnimationRef.current = null;
      }

      await logoutUser();
      setIsLoggedIn(false);
      setMenuItems([]);
      await new Promise((resolve) => setTimeout(resolve, 100));
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
      transition={{ duration: 0.3 }}
      onClick={onClose}
      className="fixed inset-0 z-[600] bg-black/50 xl:hidden"
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
        transition={{ duration: 0.3 }}
        style={{
          backgroundColor,
          right: breakpoint === "md" || breakpoint === "lg" ? 0 : "auto",
          left: breakpoint === "md" || breakpoint === "lg" ? "auto" : 0,
        }}
        className="absolute bottom-0 w-full bg-palette-6 text-white md:max-w-md max-w-sm h-full max-h-[90dvh] shadow-2xl"
      >
        <div className="relative flex flex-col h-full">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5"
            style={{ color: COLORS.maroon }}
          >
            <X size={24} />
          </motion.button>

          <div className="p-6 flex flex-col h-full">
            <div className="mb-6 mt-8">
              <h2
                style={{ color: COLORS.maroon }}
                className="text-xl font-bold"
              >
                Menu
              </h2>
            </div>

            <nav className="flex-1 space-y-3">
              {menuItems.map((item, index) => (
                <MenuItem key={index} {...item} />
              ))}
            </nav>

            <div className="pt-6 border-t border-black/10">
              {isLoggedIn ? (
                <motion.button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center justify-between w-full p-4 rounded-xl text-white font-medium transition-all"
                  style={{ backgroundColor: COLORS.maroon }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center gap-3">
                    <LogOut size={20} />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </span>
                </motion.button>
              ) : (
                <Link href={linkName} className="block w-full">
                  <motion.button
                    className="flex items-center justify-between w-full p-4 rounded-xl text-white font-medium transition-all"
                    style={{ backgroundColor: COLORS.maroon }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="flex items-center gap-3">
                      <LogIn size={20} />
                      {buttonName}
                    </span>
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

const MenuItem = ({ name, link, icon }: MenuItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <Link href={link} className="block">
      <motion.div
        className="relative overflow-hidden"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div
          className={`flex items-center justify-between p-4 rounded-xl transition-all ${isActive ? "text-white" : "text-white hover:text-palette-2"
            }`}
          style={{
            backgroundColor: isActive ? COLORS.scarlet : "transparent",
          }}
        >
          <span className="flex items-center gap-3">
            {icon}
            <span className="font-medium">{name}</span>
          </span>
        </div>
      </motion.div>
    </Link>
  );
};

export default SidebarDrawer;
