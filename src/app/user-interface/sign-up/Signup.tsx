"use client";

import { Logo } from "@/components/reusable-component/Logo";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import Link from "next/link";

export const Signup = () => {
  return (
    <div className="w-full min-h-dvh lg:py-[20dvh] py-[15dvh] bg-[url('/images/signup/background.jpg')] bg-cover bg-no-repeat relative">
      {/* Full height overlay covering the entire div */}
      <div className="absolute inset-0 w-full h-full bg-black/30"></div>

      {/* Content */}
      <div className="relative w-full h-full xl:max-w-[55%] sm:max-w-[70%] max-w-[95%] mx-auto flex flex-col gap-10 justify-center items-center">
        <h1 className="font-bold lg:text-6xl md:text-5xl text-4xl text-white drop-shadow-xl lg:block hidden">
          BE ONE OF US
        </h1>
        <AccountCreation />
      </div>
    </div>
  );
};

const AccountCreation = () => {
  return (
    <div className="w-full h-full relative border border-black">
      {/* Main content */}
      <div className="w-full h-full flex bg-secondary-1 rounded-2xl z-50 relative">
        <div className="w-full h-full sm:p-10 p-6 lg:block hidden">
          <img
            className="w-fit h-full rounded-xl"
            src="images/signup/study.png"
            alt=""
          />
        </div>
        <div className="w-full h-full flex flex-col gap-4 justify-center items-center sm:p-10 p-6">
          <div className="w-64 h-fit">
            <Logo color="text-secondary-2" width={"auto"} height={"auto"} />
          </div>
          <div className="w-full h-full flex justify-end items-end">
            <Form />
          </div>
        </div>
      </div>

      {/* Background divs (behind the main content) */}
      <div className="w-full absolute lg:-bottom-10 -bottom-6 z-10 max-w-[90%] left-0 right-0  mx-auto h-32 rounded-2xl bg-shade-6"></div>
      <div className="w-full absolute lg:-bottom-20 -bottom-12 z-0 max-w-[80%] left-0 right-0  mx-auto h-32 rounded-2xl bg-shade-7"></div>
    </div>
  );
};
  

export const Form = () => {
  return (
    <form className="w-full h-full flex flex-col gap-6">
      {/* username */}
      <div className="w-full lg:max-w-sm relative ">
        <input
          className="w-full h-10 border-b-2 p-4 pl-12 border-secondary-2 outline-none ring-0"
          type="text"
          placeholder="Username"
        />

        <Icon
          className="text-secondary-2 absolute top-1/2 left-0 -translate-y-1/2"
          icon="mdi:user-outline"
          width="35"
          height="35"
        />
      </div>
      {/* email address */}
      <div className="w-full lg:max-w-sm relative">
        <input
          className="w-full h-10 border-b-2 p-4 pl-12 border-secondary-2 outline-none ring-0"
          type="text"
          placeholder="Email address"
        />
        <Icon
          className="text-secondary-2 absolute top-1/2 left-0 -translate-y-1/2"
          icon="material-symbols:mail-outline"
          width="35"
          height="35"
        />
      </div>
      {/* password */}
      <div className="w-full lg:max-w-sm relative">
        <input
          className="w-full h-10 border-b-2 p-4 pl-12 border-secondary-2 outline-none ring-0"
          type="text"
          placeholder="Password"
        />
        <Icon
          className="text-secondary-2 absolute top-1/2 left-0 -translate-y-1/2"
          icon="mynaui:key"
          width="35"
          height="35"
        />
      </div>
      {/* birthdate selector */}
      <div className="w-full lg:max-w-sm relative">
        <input
          className="w-full h-10 border-b-2 p-4 pl-12 border-secondary-2 outline-none ring-0"
          type="text"
          placeholder="Birthdate"
        />
        <Icon
          className="text-secondary-2 absolute top-1/2 left-0 -translate-y-1/2"
          icon="akar-icons:calendar"
          width="35"
          height="35"
        />
      </div>
      
      <div className="w-full lg:max-w-sm pt-4">
        <motion.button
          className="border-2 border-secondary-2 w-full py-3 text-lg font-semibold uppercase"
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create account
        </motion.button>
      </div>
      <div className="w-full flex flex-col justify-center items-center">
        <p>Already have an account?</p>
        <Link href={"/signin"} className="uppercase font-medium cursor-pointer">Login</Link>
      </div>
    </form>
  );
};
