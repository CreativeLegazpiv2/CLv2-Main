import { getSession } from "@/services/authservice";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import { jwtVerify } from "jose";
import Image from "next/image";
import { useState, useEffect } from "react";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';

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
}

interface Message {
  id: number;
  sessionid: number;
  message: string;
  sender: string;
  created_at: string;
  image_path: string;
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

  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setPreviewImage(image);
  }, [image, title, desc, year]);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    const checkAndAutoSend = async () => {
      const token = getSession();
      if (!token) return;
  
      try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        const userIdFromToken = payload.id as string;
  
        const response = await fetch('/api/chat/msg-session', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'sender_a': userIdFromToken,
            'sender_b': formData.childid,
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
  
        const data = await response.json();
        const sessions = data.sessions;
  
        // Check if previewImage exists in the messages and sessionid matches id
        const imageExists = sessions.some((session: any) => 
          session.messages.some((msg: any) => msg.image_path === previewImage && msg.sessionid === session.session.id)
        );
  
        if (!imageExists) {
          await autoSend();
        }
      } catch (error: any) {
        console.error('Error checking and auto-sending message:', error.message);
      }
    };
  
    checkAndAutoSend();
  }, []);

  const fetchMessages = async () => {
    const token = getSession();
    if (!token) return;
  
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      const userIdFromToken = payload.id as string;
      const childid = formData.childid as string;
  
      const response = await fetch('/api/chat/msg-session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'sender_a': userIdFromToken, // Use the user ID from the token
          'sender_b': childid, // Use the child ID from formData
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
  
      const data = await response.json();
      setMessages(data.sessions.flatMap((session: any) => session.messages));
    } catch (error: any) {
      console.error('Error fetching messages:', error.message);
    }
  };

  const autoSend = async () => {
    const token = getSession();
    if (!token) return;

    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      const userIdFromToken = payload.id as string;
      const response = await fetch('/api/chat/msg-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_a: userIdFromToken, // Use the user ID from the token
          sender_b: formData.childid, // Use the child ID from formData
          image_path: previewImage,
          message: "Hello, I'm interested in this item!", // Default message
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      console.log('Message sent successfully', data);
      setMessage(''); // Clear the message input
      fetchMessages(); // Fetch messages again to update the chat
    } catch (error: any) {
      console.error('Error sending message:', error.message);
    }
  };

  const handleSendMessage = async () => {
    const token = getSession();
    if (!token) return;

    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      const userIdFromToken = payload.id as string;
      const response = await fetch('/api/chat/msg-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_a: userIdFromToken, // Use the user ID from the token
          sender_b: formData.childid, // Use the child ID from formData
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      console.log('Message sent successfully', data);
      setMessage(''); // Clear the message input
      fetchMessages(); // Fetch messages again to update the chat
    } catch (error: any) {
      console.error('Error sending message:', error.message);
    }
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
      className="w-[90%] lg:max-w-screen-xl h-[80vh] overflow-hidden flex flex-col mx-auto bg-white rounded-lg p-4 relative"
    >
      <Icon
        onClick={onCancel}
        className="absolute top-4 right-4 cursor-pointer"
        icon="line-md:close-small"
        width="35"
        height="35"
      />
      <h2 className="text-3xl font-extrabold mb-2">Hi </h2>
      <hr className="border-t border-gray-300 mb-8" />

      <div className="p-4 rounded-lg h-fit overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <h3 className="text-xl font-bold mb-4">UPLOAD</h3>

            <div className="space-y-4">
              <div>
                {previewImage ? (
                  <div className="bg-white rounded-lg shadow-md overflow-hidden w-[300px] h-[400]">
                    <div className='overflow-hidden w-[300px] relative'>
                      <Image src={previewImage} alt="Preview" width={300} height={200} className="object-cover" />
                      <div className='absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-end p-2 bg-gradient-to-t from-black to-transparent'>
                        <h3 className="text-lg font-bold text-white">{formData.title || "Title"}</h3>
                        <p className="text-gray-200">by {formData.artist}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="mt-2 text-gray-800 break-words">{formData.desc || "desc"}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No Image</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="mb-4">
              {/* Messaging */}
              <div className="h-[400px] overflow-y-auto mb-4">
              {messages.map((msg) => (
  <div key={msg.id} className={`mb-2 p-2 rounded-lg ${msg.sender === formData.childid ? 'bg-blue-100' : 'bg-gray-100'}`}>
    <p>{msg.message}</p>
    <p className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</p>
    {/* Show auto image_path here */}
    {msg.image_path && (
      <div className="mt-2">
        <Image src={msg.image_path} alt="Message Image" width={300} height={200} className="object-cover rounded-lg" />
      </div>
    )}
  </div>
))}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here"
                  className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded-lg"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};