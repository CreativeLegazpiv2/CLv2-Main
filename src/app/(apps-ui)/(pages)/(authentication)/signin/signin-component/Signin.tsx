"use client";

import { Logo } from "@/components/reusable-component/Logo";
import { loginUser } from "@/services/authservice";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Form } from "./SiginForm";

export const Signin = () => {
  return (
    <div className="w-full h-dvh lg:py-[20dvh] py-[15dvh] bg-[url('/images/signup/background.jpg')] bg-cover bg-no-repeat bg-center relative">
      {/* Full height overlay covering the entire div */}
      <div className="absolute inset-0 w-full h-full bg-black/50"></div> {/* Increased opacity for better contrast */}

      {/* Content */}
      <div className="relative w-full h-full xl:max-w-[55%] sm:max-w-[70%] max-w-[95%] mx-auto flex flex-col gap-10 justify-center items-center">
        <AccountCreation />
      </div>
    </div>
  );
};

const AccountCreation = () => {
  return (
    <div className="w-full h-full relative">
      <ToastContainer />
      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full h-full flex bg-palette-3 rounded-2xl z-50 relative shadow-2xl"
      >
        <div className="w-full h-full justify-center items-center sm:p-10 p-6 lg:flex hidden">
          <Logo color="text-palette-5" width={"auto"} height={"auto"} />
        </div>
        <div className="w-full h-full flex flex-col bg-palette-5 text-palette-1 rounded-r-2xl gap-12 justify-center items-center sm:p-10 p-6">

          <div className="w-full h-fit flex flex-col gap-4 justify-end items-center">
            <div className="w-full h-fit">
              <span className="title text-3xl tracking-wider uppercase">Log in</span>
              <h1 className="uppercase text-5xl font-bold poppins">Explore</h1>
            </div>
            <Form />
            <div className="w-full flex flex-col justify-start items-start gap-2">
              <a href="/">
                <p className="text-gray-600 px-2">forgot password?</p>
              </a>
              {/* <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/applyartist" className="uppercase font-medium text-primary-1 hover:text-primary-2 transition-colors flex items-center gap-2">
              <Icon icon="mdi:artist" width="24" height="24" /> 
              New Artist?
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/signupBuyer" className="uppercase font-medium text-primary-1 hover:text-primary-2 transition-colors flex items-center gap-2">
              <Icon icon="mdi:cart" width="24" height="24" />
              Buyer?
            </Link>
          </motion.div> */}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

