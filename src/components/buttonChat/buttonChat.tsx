"use client";
import { Interested } from "@/app/apps-ui/(user)/(gallery)/g-user/collections/[slug]/(collectionModal)/Interested";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import { useState } from "react";



export const ButtonChat = () => {


    const [chat, setChat] = useState(false);
    const [isInterestModalOpen, setInterestModalOpen] = useState(false);

    return (
        <>
            <motion.button
                initial={{ backgroundColor: "#FFD094", color: "#403737" }}
                whileHover={{
                    scale: 1.1,
                    backgroundColor: "#403737",
                    color: "white",
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="w-32 py-2 rounded-full"
                onClick={() => {
                    setInterestModalOpen(true);
                    setChat(true);
                }}
            >
                Chat?
            </motion.button>
            {chat && isInterestModalOpen && (
                <Interested
                    onCancel={() => setInterestModalOpen(false)}
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

