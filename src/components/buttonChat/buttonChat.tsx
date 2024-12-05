"use client";
import { Interested } from "@/app/apps-ui/(user)/(gallery)/g-user/collections/[slug]/(collectionModal)/Interested";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import { useState } from "react";

export const ButtonChat = () => {
  const [chat, setChat] = useState(false);
  const [isInterestModalOpen, setInterestModalOpen] = useState(false);

  const handleOpenChat = () => {
    setInterestModalOpen(true);
    setChat(true);
  };

  const handleCloseChat = () => {
    setInterestModalOpen(false);
    setChat(false);
  };
  return (
    <>
      {!chat && !isInterestModalOpen && (
        <motion.button
          initial={{ backgroundColor: "#FFD094", color: "#403737" }}
          whileHover={{
            scale: 1.1,
            backgroundColor: "#403737",
            color: "white",
          }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="w-36 py-3 rounded-md flex text-lg gap-2 items-center justify-center font-bold capitalize
                 border border-primary-2/50 shadow-customShadow2
                 "
          onClick={handleOpenChat}
        >
          <Icon icon="bxs:chat" width="25" height="25" /> Chat
        </motion.button>
      )}

      {chat && isInterestModalOpen && (
        <Interested
          onCancel={handleCloseChat}
          chat={chat}
          childid={""}
          created_at={new Date()}
          image={""}
          title={""}
          desc={""}
          year={0}
          artist={""}
        />
      )}
    </>
  );
};
