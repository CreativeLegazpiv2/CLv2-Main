import { getSession } from "@/services/authservice";
import { supabase } from "@/services/supabaseClient";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import { jwtVerify } from "jose";
import { ArrowLeft, Loader, Search, SendHorizontal, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

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
  profile_pic?: string;
}

interface getUsers {
  detailsid: string;
  first_name: string;
  creative_field?: string;
  role?: string;
  profile_pic?: string;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolledUp, setIsScrolledUp] = useState<boolean>(false);

  const [getUsers, setUsers] = useState<getUsers[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMsgLoading, setMsgLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    setMsgLoading(true);
  }, []);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  // Handle scroll behavior
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isAtBottom = scrollHeight - scrollTop === clientHeight;

      if (isAtBottom) {
        setIsScrolledUp(false);
      } else {
        setIsScrolledUp(true);
      }
    }
  };

  // Scroll to bottom on initial load
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [isRightColumnVisible]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  // getnew users to message
  useEffect(() => {
    fetchusersData();
  }, []);

  const fetchusersData = async () => {
    const token = getSession();
    if (!token) return;

    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );
      const userIdFromToken = payload.id as string;

      const response = await fetch("/api/chat/new-msg", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          tokenid: userIdFromToken, // Pass sender_a in headers
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }

      const data = await response.json();
      console.log("Fetched sessions:", data);

      if (data && data.length > 0) {
        setUsers(data);
      } else {
        console.error("No user found.");
      }
    } catch (error) {
      console.error("Error fetching session data:", error);
    }
  };

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
    if (!chat) {
      setChat(false);
      setIsRightColumnVisible(true);
    } else {
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
        setIsLoading(false);
      } else {
        console.error("No sessions found.");
        setIsLoading(false);
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
        if (data && data.length > 0) {
          setMessages(
            data.sessions.flatMap((session: any) => session.messages)
          );
          setMsgLoading(false);
        } else {
          setMsgLoading(false);
        }
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
        if (data && data.length > 0) {
          setMessages(data.message);
          setMsgLoading(false);
        } else {
          setMsgLoading(false);
        }
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
    setMsgLoading(true);
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
    console.log("selectedSessionId", selectedSessionId); // Debug log

    setSelectedSessionId(id);
    setIsRightColumnVisible(true); // Show right column

    // Fetch user details (first name, profile picture) from Supabase
    try {
      const { data, error } = await supabase
        .from("userDetails")
        .select("detailsid, first_name, profile_pic")
        .eq("detailsid", selectedUserId)
        .single();
      console.log("mock ", data);

      if (error) throw error;

      // Update state to store the selected user details
      setUserDetails([data]); // Set the fetched user details to state (e.g., user details)
    } catch (error: any) {
      console.error("Error fetching user details:", error.message);
    }

    // Fetch messages (existing functionality)
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
      fetchMessages();
    } catch (error: any) {
      console.error("Error fetching messages:", error.message);
    }
  };

  const handleBackToSessions = () => {
    setSelectedSessionId(null);
    setIsRightColumnVisible(false);
  };

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

  const filteredUsers = getUsers.filter((user) =>
    user.first_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClickNewChat = async (id: string) => {
    setMsgLoading(true);
    console.log("clicked id:", id);
    const token = getSession();
    if (!token) {
      console.error("No session token found");
      return;
    }
    setIsRightColumnVisible(true);
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );
      const userIdFromToken = payload.id as string;

      const response = await fetch("/api/chat/new-msg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_a: userIdFromToken, // Use the user ID from the token
          sender_b: id,
        }),
      });

      if (!response.ok) {
        throw new Error("To create new chat");
      }

      const data = await response.json();
      console.log("Message sent successfully", data);
      const selectedUserId = data.a === userIdFromToken ? data.b : data.a;
      setselectedId(selectedUserId);
      setSelectedSessionId(data.sessionId);
      fetchSessionData();
      const selectedidmsg = selectedSessionId as string;

      const dataidmsg = data.sessionId as string;
      const responseData = await fetch("/api/chat/all-msg-session", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          sender_a: dataidmsg,
        },
      });

      if (!responseData.ok) {
        throw new Error("Failed to fetch messages");
      }

      const dataResponse = await responseData.json(); // Corrected this line
      setMessages(dataResponse.message);
      fetchMessages();
    } catch (error: any) {
      console.error("Error sending message:", error.message);
    }
  };

  return (
    <div className="fixed bottom-0 right-0 z-[900] w-full max-w-md min-w-[24rem] h-[70vh] overflow-hidden flex flex-col rounded-xl shadow-customShadow3 bg-gray-200">
      <button
        onClick={onCancel}
        className="absolute top-2 right-2 p-2 bg-gray-200 rounded-lg cursor-pointer"
      >
        <X size={25} />
      </button>
      <div className="bg-primary-2 p-4">
        <div className="text-xl text-gray-200 font-extrabold mb-2">
          {/* Conditional rendering based on selected session */}
          {!selectedSessionId ? (
            // No session clicked yet, show "Chat" placeholder
            <p>Chat</p>
          ) : (
            // Session is selected, show the user details
            userDetails.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <img
                    src={
                      userDetails[0].profile_pic || "/images/emptyProfile.png"
                    }
                    alt={userDetails[0].first_name}
                    className="w-10 h-10 rounded-full mr-2"
                  />
                  <div>
                    <p className="text-gray-200 font-semibold">
                      {userDetails[0].first_name}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <div className="w-full h-full rounded-lg overflow-hidden custom-scrollbar">
        <div className="w-full h-full flex flex-col">
          {!isRightColumnVisible && (
            // Search user section
            <div className="bg-white w-full h-full">
              <div className="p-2 relative group">
                <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-primary-3/30 group-focus-within:text-primary-3" />
                <input
                  type="text"
                  className="border border-primary-3/30 pl-10 pr-4 py-2 rounded-full w-full outline-none focus:ring-primary-3 focus:ring-1 peer"
                  placeholder="Search creative username..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value) {
                      setShowModal(true);
                    } else {
                      setShowModal(false);
                    }
                  }}
                />
              </div>

              {/* Modal for searched users */}
              {showModal && (
                <div className="inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
                    <button
                      onClick={() => setShowModal(false)}
                      className="absolute top-2 right-2 p-2 bg-gray-200 rounded-lg cursor-pointer"
                    >
                      <X size={25} />
                    </button>
                    <h3 className="text-lg font-bold mb-4">Search Results</h3>
                    <ul className="space-y-2">
                      {filteredUsers.map((user) => (
                        <li
                          key={user.detailsid}
                          onClick={() => {
                            handleClickNewChat(user.detailsid); // Handle new chat creation
                            setShowModal(false);
                          }}
                          className="flex flex-row capitalize bg-black/10 rounded-md p-2 gap-4 cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <Image
                              className="w-full h-full object-cover"
                              src={
                                user.profile_pic || "/images/emptyProfile.png"
                              }
                              alt="Profile Picture"
                              width={48}
                              height={48}
                            />
                          </div>
                          <div className="flex flex-col">
                            <strong>{user.first_name}</strong>
                            {user.role === "buyer" ? (
                              <span className="text-xs text-black/50">
                                , {user.role}
                              </span>
                            ) : (
                              <div className="text-xs text-black/50">
                                {user.creative_field}
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <h3 className="text-sm text-black/50 font-bold px-4 pb-2">
                Recent Messages
              </h3>
              <div className="w-full h-full relative flex flex-col border border-black/30 rounded-md p-2 pb-4">
                <div className="space-y-4 h-full flex flex-col gap-2 overflow-hidden pb-12">
                  {isLoading ? (
                    <div className="w-full h-full flex justify-center items-center">
                      <Loader size={55} className="animate-spin" />
                    </div>
                  ) : sessions.length === 0 ? (
                    <div className="w-full h-full flex justify-center items-center">
                      <p>No Recent Messages yet</p>
                    </div>
                  ) : (
                    <ul className="space-y-2 flex flex-col h-full overflow-y-auto">
                      {sessions.map((session) => (
                        <li
                          key={session.id}
                          onClick={() =>
                            handleClick(session.id, session.a, session.b)
                          }
                          className={`${
                            selectedSessionId === session.id
                              ? "bg-gray-400"
                              : ""
                          }`}
                        >
                          <div className="flex flex-row capitalize bg-black/10 rounded-md p-2 gap-4 cursor-pointer">
                            <div className="w-12 h-12 rounded-full overflow-hidden">
                              <Image
                                className="w-full h-full object-cover"
                                src={
                                  session.userDetails.profile_pic ||
                                  "/images/emptyProfile.png"
                                }
                                alt={session.userDetails.first_name}
                                width={48}
                                height={48}
                              />
                            </div>
                            <div className="flex flex-col">
                              <strong>{session.userDetails.first_name}</strong>
                              {session.userDetails.role === "buyer" ? (
                                <span className="text-xs text-black/50">
                                  , {session.userDetails.role}
                                </span>
                              ) : (
                                <div className="text-xs text-black/50">
                                  {session.userDetails.creative_field}
                                </div>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {isRightColumnVisible && (
            <div className="flex flex-col h-full w-full bg-white">
              <button
                onClick={handleBackToSessions}
                className="absolute top-2 right-2 p-2 bg-gray-200 rounded-lg cursor-pointer"
              >
                <ArrowLeft size={25} />
              </button>
              <div className="h-full flex flex-col gap-4 w-full">
                <div
                  ref={containerRef}
                  className="h-full overflow-y-auto p-4 w-full scroll-none"
                >
                  {isMsgLoading ? (
                    <div className="w-full h-full flex justify-center items-center">
                      <Loader size={55} className="animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="w-full h-full flex justify-center items-center">
                      <p>No Messages yet</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      // Format the created_at timestamp
                      const createdAt = new Date(msg.created_at);
                      const formattedDate = createdAt.toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }); // "Dec. 24, 2024"
                      const formattedTime = createdAt.toLocaleString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }); // "12:45 PM"

                      return (
                        <div
                          key={msg.id}
                          className={`mb-2 p-2 flex flex-col w-full ${
                            msg.sender == gettokenId
                              ? "items-end"
                              : "items-start"
                          }`}
                        >
                          <div
                            className={`mb-2 p-3   rounded-t-3xl  max-w-[80%] ${
                              msg.sender == gettokenId
                                ? "bg-[skyblue] rounded-bl-3xl"
                                : "bg-gray-200 rounded-br-3xl"
                            }`}
                          >
                            <p>{msg.message}</p>
                            <p
                              className={`text-[10px] ${
                                msg.sender == gettokenId
                                  ? "text-black/80"
                                  : "text-black/70"
                              }`}
                            >
                              {formattedDate}, {formattedTime}
                            </p>
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
                        </div>
                      );
                    })
                  )}
                </div>

                {isRightColumnVisible && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="h-fit flex gap-2 bg-primary-2 p-4"
                  >
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here"
                      className="w-full py-2 border border-gray-300 rounded-full px-4"
                    />
                    <button
                      type="submit"
                      className="text-gray-200 p-2 rounded-lg"
                    >
                      <SendHorizontal size={24} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
