"use client";

import { getSession } from "@/services/authservice";
import { Icon } from "@iconify/react/dist/iconify.js";
import { AnimatePresence, motion } from "framer-motion";
import { jwtVerify } from "jose";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret";

export interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  closeHandler: () => void;
  selectedDay: Date;
  event: FormInput | null;
}
export interface FormInput {
  event_title: string;
  event_location: string;
  startDate: Date;
  start_time: string;
  end_time: string;
  description: string;
}

export const CalendarModal = ({
  isOpen,
  onClose,
  selectedDay,
  closeHandler,
  event ,
}: CalendarModalProps) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-dvh fixed z-[1000] inset-0 bg-secondary-2/50 text-secondary-2 flex justify-center items-center"
          onClick={closeHandler}
        >
          <div className="w-full xl:max-w-screen-md lg:max-w-[80%] max-w-[90%] lg:px-8 mx-auto h-fit py-[12dvh]">
            {/* Pass the selectedDay and event to Content */}
            <Content closeHandler={closeHandler} selectedDay={selectedDay} event={event} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Content = ({
  closeHandler,
  selectedDay,
  event,
}: {
  closeHandler: () => void;
  selectedDay: Date;
  event: FormInput | null;
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, y: 50, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.9, y: 50, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 500 }}
      className="w-full h-full flex flex-col outline-none outline-shade-2 outline-offset-2 bg-white rounded-lg shadow-lg overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-full h-fit p-4 bg-shade-2 relative">
        <h1 className="uppercase font-semibold text-3xl">
          Schedule
        </h1>
        <Icon
          onClick={closeHandler}
          className="absolute right-4 top-4 cursor-pointer hover:scale-110 duration-300"
          icon="line-md:close-small"
          width="35"
          height="35"
        />
      </div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4"
      >
        {/* Pass the selectedDay to FormInput */}
        <FormInput selectedDay={selectedDay} event={event} />
      </motion.div>
    </motion.div>
  );
};

const FormInput = ({ selectedDay, event }: { selectedDay: Date; event: FormInput | null }) => {
  // Format selectedDay to YYYY-MM-DD format for inputs
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

const [eventTitle, setTitle] = useState(event?.event_title || ""); // Use event data or empty string
  const [eventLocation, setLocation] = useState(event?.event_location || "");
  const [startDate, setStartDate] = useState(formatDate(selectedDay));
  const [startTime, setStartTime] = useState(event?.start_time || "");
  const [endTime, setEndTime] = useState(event?.end_time || "");
  const [description, setDescription] = useState(event?.description || "");

  useEffect(() => {
    if (event) {
      setTitle(event.event_title || "");
      setLocation(event.event_location || "");
      setStartTime(event.start_time || "");
      setEndTime(event.end_time || "");
      setDescription(event.description || "");
    }
  }, [event]); // Update when event data changes
  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const token = getSession();
    console.log("Token:", token); // Debugging statement
    if (!token) {
      toast.error("No token found, please log in.");
      return;
    }
  
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    console.log("Decoded Payload:", payload); // Debugging statement
    const userId = payload.id as string;
  
    try {
      const response = await fetch("/api/events", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "User-ID": userId, // Send user ID in a separate header
          "Authorization": `Bearer ${token}`, // Send the actual JWT token for verification
        },
        body: JSON.stringify({
          eventTitle,
          location,
          start_time: startTime, // Send only time value
          end_time: endTime, // Send only time value
          selected_date: formatDate(selectedDay), // Send only the date
          description,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log("Event inserted successfully:", data);
        toast.success("Event inserted successfully", {
          position: "bottom-right",
        });
      } else {
        console.error("Error inserting event:", data);
      }
    } catch (error) {
      console.error("An error occurred while inserting the event:", error);
    }
  };

  
  

  return (
    <div className="w-full h-full text-secondary-2">
      <form
        className="w-full h-full flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="ml-2">
            Title and Location
          </label>
          <div className="w-full flex gap-4 items-center">
            <input
              type="text"
              placeholder="Title"
              value={eventTitle}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-12 border border-quaternary-1 outline-none focus:outline-shade-2 focus:ring-shade-3 focus:ring-1 rounded-lg p-4 text-primary-2"
            />
            <input
              type="text"
              placeholder="Location"
              value={eventLocation}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-12 border border-quaternary-1 outline-none focus:outline-shade-2 focus:ring-shade-3 focus:ring-1 rounded-lg p-4 text-primary-2"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="date" className="ml-2">
            Date
          </label>
          <div className="w-full flex gap-4 items-center">
            <input
              type="date"
              value={formatDate(selectedDay)}
              readOnly
              className="w-full h-12 border border-quaternary-1 outline-none focus:outline-shade-2 focus:ring-shade-3 focus:ring-1 rounded-lg p-4 text-primary-2"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="time" className="ml-2">
            Time
          </label>
          <div className="w-full flex gap-4 items-center">
            <CustomTimeInput
              value={startTime}
              onChange={setStartTime}
              placeholder="Start time"
            />
            <CustomTimeInput
              value={endTime}
              onChange={setEndTime}
              placeholder="End time"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 pb-6">
          <label htmlFor="description" className="ml-2">
            Description
          </label>
          <textarea
            placeholder="About the event"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-quaternary-1 outline-none focus:outline-shade-2 focus:ring-shade-3 focus:ring-1 rounded-lg p-4 text-primary-2 resize-none row-span-12 col-span-12"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full h-12 bg-shade-2 text-secondary-2 rounded-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

// Design lang ini

interface CustomTimeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const CustomTimeInput: React.FC<CustomTimeInputProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const [isTimeType, setIsTimeType] = useState(false);

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTimeType(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = () => {
    if (!value) {
      setIsTimeType(false);
    }
  };

  return (
    <div className="relative w-full">
      <input
        type={isTimeType ? "time" : "text"}
        value={value}
        onChange={handleChange}
        onClick={handleInputClick}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="w-full h-12 border border-quaternary-1 outline-none focus:outline-shade-2 focus:ring-shade-3 focus:ring-1 rounded-lg p-4 text-primary-2"
      />
      {!isTimeType && !value && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      )}
    </div>
  );
};
