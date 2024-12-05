"use client";

import { Interested } from "@/app/apps-ui/(user)/(gallery)/g-user/collections/[slug]/(collectionModal)/Interested";
import { Icon } from "@iconify/react/dist/iconify.js";
import { AnimatePresence, motion } from "framer-motion";

interface ButtonChatProps {
  isChatModalOpen: boolean;
  onOpenChatModal: () => void;
  onCloseChatModal: () => void;
}

export const ButtonChat = ({
  isChatModalOpen,
  onOpenChatModal,
  onCloseChatModal,
}: ButtonChatProps) => {
  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <>
      {!isChatModalOpen && (
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
          onClick={onOpenChatModal}
          aria-label="Open chat"
        >
          <Icon icon="bxs:chat" width="25" height="25" /> Chat
        </motion.button>
      )}

      <AnimatePresence>
        {isChatModalOpen && (
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, y: 500, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.5, y: 500, x: 100, opacity: 0 }}
            transition={{
              type: "tween",
              damping: 25,
              stiffness: 500,
            }}
            className="w-full h-full"
          >
            <Interested
              onCancel={onCloseChatModal}
              chat={true}
              childid={""}
              created_at={new Date()}
              image={""}
              title={""}
              desc={""}
              year={0}
              artist={""}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
