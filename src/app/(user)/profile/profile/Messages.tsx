"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Message {
  profileImage: string;
  name: string;
  date: string;
  message: string;
}

export const Messages = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // Adjust breakpoint as needed
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full md:px-6 md:py-4 bg-shade-1 rounded-b-xl">
      <div className="w-full flex flex-col gap-6 p-4 rounded-lg">
        {/* Search Bar */}
        <div className="w-full flex items-center gap-4 p-2 px-4 rounded-full border border-primary-2">
          <Icon icon="lets-icons:search-light" width="35" height="35" />
          <input
            className="w-full bg-transparent placeholder:text-secondary-2 outline-none"
            type="text"
            placeholder="Search Direct Messages"
          />
        </div>

        {/* Main Content */}
        <div className="w-full h-[70dvh] flex bg-primary-1 text-primary-2 rounded-xl overflow-hidden">
          {/* Messages List */}
          {(!isChatOpen || !isMobile) && (
            <div className="w-full h-full lg:max-w-sm p-4 border border-primary-3 rounded-l-xl overflow-y-auto custom-scrollbar">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className="w-full flex items-center gap-2 cursor-pointer"
                  onClick={() => setIsChatOpen(true)} // Open chat window on click
                >
                  {/* Profile Image */}
                  <div className="h-16 w-16 rounded-full overflow-hidden">
                    <img
                      className="w-full h-full object-fill"
                      src={message.profileImage}
                      alt={message.name}
                    />
                  </div>

                  {/* Message Details */}
                  <div className="w-full flex flex-col">
                    <div className="w-full flex justify-between items-center">
                      <p className="text-sm font-semibold">{message.name}</p>
                      <p className="text-xs font-semibold opacity-80">
                        {message.date}
                      </p>
                    </div>
                    <p
                      className={`text-base font-bold ${
                        message.message.length > 10 ? "line-clamp-1" : ""
                      }`}
                    >
                      {message.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Chat Window */}
          {(!isMobile || isChatOpen) && (
            <div className="w-full h-full border border-primary-3 rounded-r-xl flex flex-col overflow-y-auto custom-scrollbar relative">
              {isMobile && ( 
                <button
                  className="p-2 m-2 text-secondary-1 absolute -top-3 -right-3"
                  onClick={() => setIsChatOpen(false)} // Back to messages list
                >
                    <Icon icon="eva:arrow-back-outline" width="35" height="35" />
                </button>
              )}
              <div className="w-full h-full"></div>
              <div className="w-full h-fit p-4">
                <div className="w-full flex gap-2 justify-between items-center text-primary-2 bg-shade-8 rounded-full px-4">
                  <input
                    className="w-full p-3 outline-none ring-0 placeholder:text-primary-2 bg-transparent"
                    type="text"
                    placeholder="Start a new message"
                  />
                  <motion.div
                    className="w-fit h-fit"
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Icon
                      className="rotate-[-36deg] cursor-pointer -mt-1"
                      type="submit"
                      icon="proicons:send"
                      width="35"
                      height="35"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const messages: Message[] = [
  {
    profileImage: "/images/creative-profile/angel.png",
    name: "Angel Nacion",
    date: "09/07/2024",
    message:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsum, non ab odit tempora aliquid fugit facilis sed odio libero impedit quibusdam porro voluptatibus delectus, eligendi soluta autem consequuntur illum omnis.",
  },
  {
    profileImage: "/images/creative-profile/angel.png",
    name: "Angel Nacion",
    date: "09/07/2024",
    message:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsum, non ab odit tempora aliquid fugit facilis sed odio libero impedit quibusdam porro voluptatibus delectus, eligendi soluta autem consequuntur illum omnis.",
  },
];
