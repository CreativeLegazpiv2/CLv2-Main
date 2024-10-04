"use client";
import { motion } from "framer-motion";
import { Logo } from "../reusable-component/Logo";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

interface MenuItemProps {
  name: string;
  link: string;
}

interface HeaderProps {
  backgroundColor?: string;
  textColor?: string;
  buttonName?: string;
  roundedCustom?: string;
  paddingLeftCustom?: string;
  bgOpacity?: string;
  bgBlur?: string;
}

const MenuItem = ({ name, link }: MenuItemProps) => {
  return (
    <motion.a
      href={link}
      className="text-base uppercase font-semibold whitespace-nowrap relative"
      whileHover="hover"
      initial="initial"
    >
      {name}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-2"
        variants={{
          initial: { width: "0%" },
          hover: { width: "110%" },
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </motion.a>
  );
};

export const Header = ({
  backgroundColor = "bg-primary-1", // Default background color
  textColor = "text-primary-2", // Default text color
  buttonName = "Join Mukna", // Default button name
  paddingLeftCustom = "pl-14",
  roundedCustom = "rounded-bl-3xl",
  ...HeaderProps
}: HeaderProps) => {
  const [bgColor, setBgColor] = useState(backgroundColor);
  const [txtColor, setTxtColor] = useState(textColor);
  const [btnName, setBtnName] = useState(buttonName);
  const [paddingLeft, setPadding] = useState(paddingLeftCustom);
  const [rounded, setRounded] = useState(roundedCustom);
  const [bgOpacity, setBgOpacity] = useState(HeaderProps.bgOpacity);
  const [bgBlur, setBgBlur] = useState(HeaderProps.bgBlur);
  const [showHeader, setShowHeader] = useState(true); // State to control header visibility
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Hide header when scrolling down
        setShowHeader(false);
      } else {
        // Show header when scrolling up
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    setBgColor(backgroundColor);
    setTxtColor(textColor);
    setBtnName(buttonName);
    setPadding(paddingLeftCustom);
    setRounded(roundedCustom);
    setBgOpacity(HeaderProps.bgOpacity);
    setBgBlur(HeaderProps.bgBlur);
  }, [backgroundColor, textColor, buttonName, paddingLeftCustom, roundedCustom, HeaderProps.bgOpacity, HeaderProps.bgBlur]);


  // Optional: You can dynamically update the colors or name here if needed (e.g., from an API or user preference).
  useEffect(() => {
    setBgColor(backgroundColor);
    setTxtColor(textColor);
    setBtnName(buttonName);
    setPadding(paddingLeftCustom);
    setRounded(roundedCustom);
    setBgOpacity(HeaderProps.bgOpacity);
    setBgBlur(HeaderProps.bgBlur);
  }, [backgroundColor, textColor, buttonName, paddingLeftCustom, roundedCustom, HeaderProps.bgOpacity, HeaderProps.bgBlur]);

  return (
    <div className={`w-full h-[10dvh] fixed top-0 z-[1000] ${paddingLeft}`}>
      <motion.div
        whileHover={{ backgroundColor: "#FFD094", }}
        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
        initial={{ y: 0 }}
        animate={{ y: showHeader ? 0 : "-100%" }} // Animate header visibility
        className={`w-full h-full ${rounded} ${bgColor} ${txtColor} ${bgOpacity} ${bgBlur}`}>
        <div className="w-full max-w-[95%] mx-auto h-full flex justify-between items-center">
          <div className="w-fit h-full py-2">
            <Logo width="auto" height="auto" color="text-secondary-2" />
          </div>
          <div className="w-fit lg:flex justify-center items-center lg:gap-14 hidden">
            {headerMenu.map((item, index) => (
              <MenuItem key={index} {...item} />
            ))}
            <motion.button
              className="uppercase w-44 py-1.5 font-semibold rounded-full bg-shade-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {btnName}
            </motion.button>
          </div>
          <Icon
            className="lg:hidden block text-secondary-2"
            icon="eva:menu-fill"
            width="35"
            height="35"
          />
        </div>
      </motion.div>
    </div>
  );
};

const headerMenu = [
  { name: "Directory", link: "/" },
  { name: "Gallery", link: "/about" },
  { name: "FAQ", link: "/contact" },
  { name: "Log In", link: "/signin" },
];
