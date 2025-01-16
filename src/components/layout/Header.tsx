"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "../reusable-component/Logo";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import { getSession, logoutUser } from "@/services/authservice";
import { usePathname, useRouter } from "next/navigation";

interface MenuItemProps {
  name: string;
  link: string;
}

interface HeaderProps {
  backgroundColor?: string;
  textColor?: string;
  buttonName?: string;
  linkName?: string;
  roundedCustom?: string;
  paddingLeftCustom?: string;
  menuItems?: MenuItemProps[];
  onOpenSidebar?: () => void;
}

const MenuItem = ({ name, link }: MenuItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <motion.a
      href={link}
      className={`text-base uppercase font-semibold whitespace-nowrap relative duration-300
        ${isActive ? "text-palette-5 font-bold text-lg" : "text-primary-2"}
        group-hover:text-primary-2 hover:!text-palette-5`}
      whileHover={{ scale: 1.1 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {name}
    </motion.a>
  );
};

export const Header = ({
  backgroundColor = "bg-primary-1",
  textColor = "text-primary-2",
  buttonName = "Log in",
  paddingLeftCustom = "pl-14",
  roundedCustom = "rounded-bl-3xl",
  linkName = "/apps-ui/signin",
  onOpenSidebar,
}: HeaderProps) => {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const gsapAnimationRef = useRef<gsap.core.Timeline | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItemProps[]>([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleOpenSideBar = () => {
    if (onOpenSidebar) {
      onOpenSidebar();
    }
  };

  const checkAuth = async () => {
    try {
      const session = await getSession();
      setIsLoggedIn(!!session);

      if (session) {
        setMenuItems([
          { name: "Home", link: "/apps-ui/home" },
          { name: "Directory", link: "/apps-ui/creative-dashboard" },
          { name: "Gallery", link: "/apps-ui/g-user" },
          { name: "FAQ", link: "/apps-ui/faqs" },
          { name: "Events", link: "/apps-ui/events" },
          { name: "Profile", link: "/apps-ui/profile" },
        ]);
      } else {
        setMenuItems([
          { name: "Home", link: "/apps-ui/home" },
          { name: "Directory", link: "/apps-ui/creative-dashboard" },
          { name: "Gallery", link: "/apps-ui/g-visitor" },
          { name: "FAQ", link: "/apps-ui/faqs" },
          { name: "Events", link: "/apps-ui/events" },
        ]);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    }
  };

  useEffect(() => {
    if (headerRef.current && !gsapAnimationRef.current) {
      gsapAnimationRef.current = gsap.timeline().fromTo(
        headerRef.current,
        { y: -100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
        }
      );
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if we've scrolled past threshold
      setIsScrolled(currentScrollY > 50);
      
      // Determine scroll direction and visibility
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up or at the top
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    checkAuth();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (gsapAnimationRef.current) {
        gsapAnimationRef.current.kill();
        gsapAnimationRef.current = null;
      }
    };
  }, []);

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
      router.replace("/apps-ui/signin");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  if (isLoggingOut) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={headerRef}
        className={`w-full h-[10dvh] fixed top-0 z-[1000] ${paddingLeftCustom} transition-all duration-300`}
        initial={{ y: 0 }}
        animate={{ 
          y: isVisible ? 0 : -100,
          
        }}
        transition={{ duration: 0.0 }}
      >
        <motion.div
          className={`w-full h-full ${roundedCustom} ${textColor} ${backgroundColor} `}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-full max-w-[95%] mx-auto h-full flex justify-between items-center">
            <motion.div
              className="w-fit h-full py-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <Logo width="auto" height="auto" color="text-palette-1" />
            </motion.div>

            <motion.div
              className="w-fit group xl:flex justify-center items-center lg:gap-14 hidden"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.3,
                  },
                },
              }}
            >
              {menuItems.map((item, index) => (
                <MenuItem key={index} {...item} />
              ))}
              {isLoggedIn ? (
                <motion.button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={`uppercase w-44 py-1.5 font-semibold rounded-full bg-shade-1 text-secondary-1
                    ${isLoggingOut ? "opacity-50 cursor-not-allowed" : ""}`}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "#B6E3CE",
                    color: "#403737",
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </motion.button>
              ) : (
                <Link href={linkName}>
                  <motion.button
                    className="uppercase w-44 py-1.5 font-semibold rounded-full bg-palette-2 text-palette-5"
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "#403737",
                      color: "#ffff",
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {buttonName}
                  </motion.button>
                </Link>
              )}
            </motion.div>

            <motion.div
              className="xl:hidden block text-secondary-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <button className="z-[500]" onClick={handleOpenSideBar}>
                <Icon icon="eva:menu-fill" width="35" height="35" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};