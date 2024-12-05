import { getSession } from "@/services/authservice";
import { supabase } from "@/services/supabaseClient";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import { jwtVerify } from "jose";
import { ArrowLeft, SendHorizontal } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret";

interface FormData {
  childid: string;
  created_at: Date;
  title: string;
  desc: string;
  year: number;
  artist: string;
  image: File | null; // Keep image property as File
}

interface EditCollectionProps {
  childid: string;
  created_at: Date;
  image: string | null;
  title: string;
  desc: string;
  year: number;
  artist: string;
  onCancel: () => void;
  chat: boolean;
}

interface Message {
  id: number;
  sessionid: number;
  message: string;
  sender: string;
  created_at: string;
  image_path: string;
}

interface Session {
  id: string; // ID of the session
  a: string; // Sender A
  b: string; // Sender B
  // Add other session fields as needed
  userDetails: userDetails;
}
interface userDetails {
  detailsid: number;
  first_name: string;
  creative_field?: string;
  role?: string;
}

export const Interested = ({
  childid,
  created_at,
  image,
  title,
  desc,
  year,
  artist,
  onCancel,
  chat,
}: EditCollectionProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(image);
  const [formData, setFormData] = useState<FormData>({
    childid,
    created_at,
    title,
    desc,
    year,
    artist,
    image: null, // Initialize image as null
  });

  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [autoSendTriggered, setAutoSendTriggered] = useState<boolean>(false); // Flag to track auto-send
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const [selectedId, setselectedId] = useState<string | null>(null);
  const [gettokenId, settokenId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<userDetails[]>([]);
  const [isRightColumnVisible, setIsRightColumnVisible] = useState(false);
  const [isChat, setChat] = useState<boolean>(false); 

  useEffect(() => {
    const subscription = supabase
      .channel("getMsg")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "allmessage",
        },
        (payload: any) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    getSessionToken();
    fetchSessionData();
  }, []);

  useEffect(() => {
    if(!chat){
      setChat(false);
      setIsRightColumnVisible(true);
    } else{
      setChat(true);
      setIsRightColumnVisible(false);
    }
  }, []);

  const getSessionToken = async () => {
    const token = getSession();
    if (!token) return;
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    const userIdFromToken = payload.id as string;
    settokenId(userIdFromToken);
  };

  const fetchSessionData = async () => {
    const token = getSession();
    if (!token) return;

    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );
      const userIdFromToken = payload.id as string;

      const response = await fetch("/api/chat/msg-recent", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          sender_a: userIdFromToken, // Pass sender_a in headers
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }

      const data = await response.json();
      console.log("Fetched sessions:", data); // Log the full combined data to inspect it

      if (data && data.length > 0) {
        // Update state with the combined session data
        setSessions(data); // The data should already include user details
      } else {
        console.error("No sessions found.");
      }
    } catch (error) {
      console.error("Error fetching session data:", error);
    }
  };

  useEffect(() => {
    setPreviewImage(image);
  }, [image, title, desc, year]);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    const checkAndAutoSend = async () => {
      const token = getSession();
      if (!token || autoSendTriggered || chat) return; // Return if already triggered or chat is true

      try {
        const { payload } = await jwtVerify(
          token,
          new TextEncoder().encode(JWT_SECRET)
        );
        const userIdFromToken = payload.id as string;

        const response = await fetch("/api/chat/msg-session", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            sender_a: userIdFromToken,
            sender_b: formData.childid,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();
        const sessions = data.sessions;

        // Check if previewImage exists in the messages and sessionid matches id
        const imageExists = sessions.some((session: any) =>
          session.messages.some((msg: any) => msg.image_path === previewImage)
        );
        if (!imageExists) {
          await autoSend();
          setAutoSendTriggered(true); // Set the flag to true after auto-send
          fetchSessionData();
        }
      } catch (error: any) {
        console.error(
          "Error checking and auto-sending message:",
          error.message
        );
      }
    };

    checkAndAutoSend();
  }, [autoSendTriggered, chat, formData.childid, previewImage]); // Add dependencies

  const fetchMessages = async () => {
    const token = getSession();
    if (!token) return;
    if (!chat) {
      try {
        const { payload } = await jwtVerify(
          token,
          new TextEncoder().encode(JWT_SECRET)
        );
        const userIdFromToken = payload.id as string;
        const childid = formData.childid as string;

        const response = await fetch("/api/chat/msg-session", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            sender_a: userIdFromToken, // Use the user ID from the token
            sender_b: childid, // Use the child ID from formData
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();
        setMessages(data.sessions.flatMap((session: any) => session.messages));
      } catch (error: any) {
        console.error("Error fetching messages:", error.message);
      }
    } else {
      try {
        const getses = selectedSessionId as string;

        const response = await fetch("/api/chat/all-msg-session", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            sender_a: getses, // Use the user ID from the token
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();
        setMessages(data.message);
      } catch (error: any) {
        console.error("Error fetching messages:", error.message);
      }
    }
  };

  const autoSend = async () => {
    const token = getSession();
    if (!token) return;

    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );
      const userIdFromToken = payload.id as string;
      const response = await fetch("/api/chat/msg-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_a: userIdFromToken, // Use the user ID from the token
          sender_b: formData.childid, // Use the child ID from formData
          image_path: previewImage,
          message: `Hello, I'm interested in this item!. Entitled: ${formData.title}`, // Default message
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      console.log("Message sent successfully", data);
      setMessage(""); // Clear the message input
      fetchMessages(); // Fetch messages again to update the chat
    } catch (error: any) {
      console.error("Error sending message:", error.message);
    }
  };

  const handleSendMessage = async () => {
    const token = getSession();
    if (!token) return;

    if (!chat) {
      try {
        const { payload } = await jwtVerify(
          token,
          new TextEncoder().encode(JWT_SECRET)
        );
        const userIdFromToken = payload.id as string;
        const response = await fetch("/api/chat/msg-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender_a: userIdFromToken, // Use the user ID from the token
            sender_b: formData.childid, // Use the child ID from formData
            message,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const data = await response.json();
        console.log("Message sent successfully", data);
        setMessage(""); // Clear the message input
        fetchMessages(); // Fetch messages again to update the chat
      } catch (error: any) {
        console.error("Error sending message:", error.message);
      }
    } else {
      try {
        const { payload } = await jwtVerify(
          token,
          new TextEncoder().encode(JWT_SECRET)
        );
        const userIdFromToken = payload.id as string;
        const response = await fetch("/api/chat/msg-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender_a: userIdFromToken, // Use the user ID from the token
            sender_b: selectedId, // Use the child ID from formData
            message,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const data = await response.json();
        console.log("Message sent successfully", data);
        setMessage(""); // Clear the message input
        fetchMessages(); // Fetch messages again to update the chat
      } catch (error: any) {
        console.error("Error sending message:", error.message);
      }
    }
  };


  const handleClick = async (id: string, getA: string, getB: string) => {
    const token = getSession();
    if (!token) return;

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    const userIdFromToken = payload.id as string;

    // Determine the other user's ID
    const selectedUserId = getA === userIdFromToken ? getB : getA;
    setselectedId(selectedUserId);

    setSelectedSessionId(id);
    setIsRightColumnVisible(true); // Show right column

    try {
      const response = await fetch("/api/chat/all-msg-session", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          sender_a: id,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      setMessages(data.message);
    } catch (error: any) {
      console.error("Error fetching messages:", error.message);
    }
  };

  const handleBackToSessions = () => {
    setSelectedSessionId(null);
    setIsRightColumnVisible(false);
  };

  return (
    <motion.div
      onClick={(e) => e.stopPropagation()}
      initial={{ scale: 0.9, y: 50, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.9, y: 50, opacity: 0 }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 500,
      }}
      className=" w-full max-w-md min-w-[28rem] h-[80vh] overflow-hidden flex flex-col bg-white rounded-lg p-4 relative shadow-customShadow2"
    >
      <Icon
        onClick={onCancel}
        className="absolute top-4 right-4 cursor-pointer"
        icon="line-md:close-small"
        width="35"
        height="35"
      />
      <h2 className="text-xl font-extrabold mb-2">Chat </h2>
      <hr className="border-t border-gray-300" />

      <div className="w-full h-full rounded-lg overflow-hidden custom-scrollbar">
        <div className="w-full h-full flex flex-col gap-4">
          
          {/* Left Column */}
          {!isRightColumnVisible && (
            <><h3 className="text-sm text-black/50 font-bold">Recent Messages</h3>
            <div className="w-full h-full relative flex flex-col border border-black">
              <div className="space-y-4">
                <div>
                  {/* recent messages */}
                  {sessions.length > 0 ? (
                    <ul>
                      {sessions.map((session) => (
                        <li
                          key={session.id}
                          onClick={() =>
                            handleClick(session.id, session.a, session.b)
                          }
                          className={`${
                            selectedSessionId === session.id
                              ? "bg-gray-300"
                              : ""
                          }`}
                        >
                          {/* Display the session ID and user details */}
                          {/* <div>Session {session.id}</div>
                        <div>
                          Between {session.a} and {session.b}
                        </div> */}

                          {/* User details */}
                          <div>
                            <strong>{session.userDetails.first_name}</strong> -
                            {session.userDetails.creative_field},{" "}
                            {session.userDetails.role}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No active sessions found.</p>
                  )}
                </div>
              </div>
            </div>
            </>
          )}

          {isRightColumnVisible && (
            <div className="flex flex-col h-full w-full">
              <button
                onClick={handleBackToSessions}
                className="absolute top-2 right-2 p-2 bg-gray-200 rounded-lg"
              >
                <ArrowLeft size={25} />
              </button>
              <div className="mb-4 h-full flex flex-col gap-4">
                {/* Messaging */}
                <div className="h-full overflow-y-auto">
                  {messages.map((msg) => (
                    <div
                      key={msg.id + 1}
                      className={`mb-2 p-2 rounded-lg ${
                        msg.sender == gettokenId
                          ? "bg-[skyblue]"
                          : "bg-gray-100"
                      }`}
                    >
                      <p
                        className={`mb-2 p-2 rounded-lg ${
                          msg.sender == gettokenId
                            ? "bg-[skyblue]"
                            : "bg-gray-100"
                        }`}
                      >
                        {msg.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(msg.created_at).toLocaleString()}
                      </p>
                      {/* Show auto image_path here */}
                      {msg.image_path && (
                        <div className="mt-2">
                          <Image
                            src={msg.image_path}
                            alt="Message Image"
                            width={300}
                            height={200}
                            className="object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {selectedSessionId && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="h-fit flex gap-2"
                  >
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here"
                      className="w-full py-2 border border-gray-300 rounded-full px-4 mb-2"
                    />
                    <button
                      type="submit"
                      className=" text-blue-500 p-2 rounded-lg"
                    >
                      <SendHorizontal size={24}/>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
