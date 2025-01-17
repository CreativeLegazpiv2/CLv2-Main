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

export const Signin = () => {
  return (
    <div className="w-full min-h-dvh lg:py-[20dvh] py-[15dvh] bg-[url('/images/signup/background.jpg')] bg-cover bg-no-repeat bg-center relative">
      {/* Full height overlay covering the entire div */}
      <div className="absolute inset-0 w-full h-full bg-black/50"></div> {/* Increased opacity for better contrast */}

      {/* Content */}
      <div className="relative w-full h-full xl:max-w-[55%] sm:max-w-[70%] max-w-[95%] mx-auto flex flex-col gap-10 justify-center items-center">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-bold lg:text-6xl md:text-5xl text-4xl text-white drop-shadow-xl lg:block hidden text-center"
        >
          BE ONE OF US
        </motion.h1>
        <AccountCreation />
      </div>
    </div>
  );
};

const AccountCreation = () => {
  return (
    <div className="w-full h-full relative">
      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full h-full flex bg-white rounded-2xl z-50 relative shadow-2xl"
      >
        <div className="w-full h-full sm:p-10 p-6 lg:block hidden">
          <img
            className="w-fit h-full rounded-xl object-cover"
            src="../images/signup/study.png"
            alt="Study"
          />
        </div>
        <div className="w-full h-full flex flex-col gap-12 justify-center items-center sm:p-10 p-6">
          <div className="w-64 h-fit">
            <Logo color="text-secondary-2" width={"auto"} height={"auto"} />
          </div>
          <div className="w-full h-full flex justify-end items-end">
            <Form />
          </div>
        </div>
      </motion.div>

      {/* Background divs (behind the main content) */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="w-full absolute lg:-bottom-10 -bottom-6 z-10 max-w-[90%] left-0 right-0 mx-auto h-32 rounded-2xl bg-shade-6 shadow-lg"
      ></motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        className="w-full absolute lg:-bottom-20 -bottom-12 z-0 max-w-[80%] left-0 right-0 mx-auto h-32 rounded-2xl bg-shade-7 shadow-lg"
      ></motion.div>
    </div>
  );
};

export const Form = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize useRouter

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await loginUser(username, password);
      console.log("Logged in user:", user);
      toast.success("Successfully Logged In!", { position: "bottom-right" });
      if (user) {
        // Store the token in local storage or cookies
        localStorage.setItem("token", user.token); // Example: Store JWT in localStorage
        router.push("/home");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message, { position: "bottom-right" });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full h-full flex flex-col gap-6" onSubmit={handleSubmit}>
      {/* Username */}
      <div className="w-full lg:max-w-sm relative">
        <input
          className="w-full h-12 border-b-2 p-4 pl-12 border-secondary-2 outline-none ring-0 bg-transparent placeholder-gray-500 focus:border-primary-1 transition-colors"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Capture username input
        />
        <Icon
          className="text-secondary-2 absolute top-1/2 left-0 -translate-y-1/2"
          icon="mdi:user-outline"
          width="35"
          height="35"
        />
      </div>

      {/* Password */}
      <div className="w-full lg:max-w-sm relative">
        <input
          className="w-full h-12 border-b-2 p-4 pl-12 border-secondary-2 outline-none ring-0 bg-transparent placeholder-gray-500 focus:border-primary-1 transition-colors"
          type="password" // Changed to password type
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Capture password input
        />
        <Icon
          className="text-secondary-2 absolute top-1/2 left-0 -translate-y-1/2"
          icon="mynaui:key"
          width="35"
          height="35"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="w-full lg:max-w-sm pt-4">
        <motion.button
          className="w-full py-3 text-lg font-semibold uppercase bg-primary-1 text-white rounded-lg hover:bg-primary-2 transition-colors"
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading} // Disable button while loading
        >
          {loading ? "Logging in..." : "Log in"} {/* Show loading state */}
        </motion.button>
      </div>
      <div className="w-full flex flex-col justify-center items-center gap-2">
        <p className="text-gray-600">Not a member?</p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/applyartist" className="uppercase font-medium text-primary-1 hover:text-primary-2 transition-colors flex items-center gap-2">
            <Icon icon="mdi:artist" width="24" height="24" /> {/* Icon for New Artist */}
            New Artist?
          </Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/signupBuyer" className="uppercase font-medium text-primary-1 hover:text-primary-2 transition-colors flex items-center gap-2">
            <Icon icon="mdi:cart" width="24" height="24" /> {/* Icon for Buyer */}
            Buyer?
          </Link>
        </motion.div>
      </div>
      <ToastContainer />
    </form>
  );
};