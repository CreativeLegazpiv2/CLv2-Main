"use client";

import { Logo } from "@/components/reusable-component/Logo";
import { loginUser } from "@/services/authservice";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const Signin = () => {
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
    <div className="w-full h-full relative">
      {/* Main content */}
      <div className="w-full h-full flex bg-secondary-1 rounded-2xl z-50 relative">
        <div className="w-full h-full sm:p-10 p-6 lg:block hidden">
          <img
            className="w-fit h-full rounded-xl"
            src="../images/signup/study.png"
            alt=""
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
      </div>

      {/* Background divs (behind the main content) */}
      <div className="w-full absolute lg:-bottom-10 -bottom-6 z-10 max-w-[90%] left-0 right-0  mx-auto h-32 rounded-2xl bg-shade-6"></div>
      <div className="w-full absolute lg:-bottom-20 -bottom-12 z-0 max-w-[80%] left-0 right-0  mx-auto h-32 rounded-2xl bg-shade-7"></div>
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
        toast.success("Successfully Login!", { position: "bottom-right" });
        if (user) {
            // Store the token in local storage or cookies
            localStorage.setItem("token", user.token); // Example: Store JWT in localStorage
            router.push("/apps-ui/home");
        }
    } catch (err:any) {
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
          className="w-full h-10 border-b-2 p-4 pl-12 border-secondary-2 outline-none ring-0"
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
          className="w-full h-10 border-b-2 p-4 pl-12 border-secondary-2 outline-none ring-0"
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

      {error && <p className="text-red-500">{error}</p>}

      <div className="w-full lg:max-w-sm pt-4">
        <motion.button
          className="border-2 border-secondary-2 w-full py-3 text-lg font-semibold uppercase"
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading} // Disable button while loading
        >
          {loading ? "Logging in..." : "Log in"} {/* Show loading state */}
        </motion.button>
      </div>
      <div className="w-full flex flex-col justify-center items-center">
        <p>Not a member?</p>
        <motion.div
        whileHover={{ scale: 1.05, color: "#0070f3" }}
        whileTap={{ scale: 0.95 }}>
        <Link href={"/apps-ui/signup"} className="uppercase font-medium cursor-pointer">
          New Artist?
        </Link>
        </motion.div>
        
        <motion.div
        whileHover={{ scale: 1.05, color: "#0070f3" }}
        whileTap={{ scale: 0.95 }}>
        <Link href={"/apps-ui/signupBuyer"} className="uppercase font-medium cursor-pointer">
          Buyer?
        </Link>
        </motion.div>
      </div>
      <ToastContainer/>
    </form>
  );
};
