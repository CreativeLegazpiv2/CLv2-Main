"use client";

import { RegisterModal } from "@/components/reusable-component/RegisterModal";
import SkeletonHomeEvents from "@/components/Skeletal/home-events";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface EventsProps {
  onEventClick?: (event: ExtendedEventProps) => void;
  onRegisterClick?: () => void;
}


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ExtendedEventProps {
  id: string;
  eventTitle: string;
  start_time: string;
  end_time: string;
  location: string;
  date: string;
  desc: string;
  title: string;
  image_path: string;
  contact?: string;
  objective?: string;
  announcement?: string;
  website?: string;
  columns?: string[];
  status?: boolean;
}

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
      isActive
        ? "bg-palette-1 text-white shadow-md"
        : "bg-gray-200 text-gray-600 hover:bg-shade-7"
    }`}
  >
    {label}
  </button>
);

export const Events = ({ onEventClick }: EventsProps) => {
    const [events, setEvents] = useState<ExtendedEventProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedEvent, setSelectedEvent] = useState<ExtendedEventProps | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(1);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const handleRegisterClick = (event: ExtendedEventProps) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
    if (onEventClick) {
      onEventClick(event); // Trigger the event click handler
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/admin-events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();

        // Get the current date and set time to the start of the day
        const currentDateObj = new Date();
        currentDateObj.setHours(0, 0, 0, 0); // Strip time component

        // Filter events to show only those on or after the current date and with status true
        const upcomingEvents = data.filter((event: ExtendedEventProps) => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0); // Strip time component from event date

          // Only include events on or after the current date and with status true
          return eventDate >= currentDateObj && event.status !== false;
        });

        setEvents(upcomingEvents);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setCardsPerPage(3);
      } else if (window.innerWidth >= 640) {
        setCardsPerPage(2);
      } else {
        setCardsPerPage(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

 

 
  if (loading) {
    return <SkeletonHomeEvents />;
  }

  if (error) {
    return (
      <div className="text-center text-2xl font-semibold text-red-500">
        Error: {error}
      </div>
    );
  }

  const totalPages = Math.ceil(events.length / cardsPerPage);

  const next = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };


  return (
    <div className="w-full md:h-dvh h-fit bg-palette-5">
      <div className="w-full h-full md:py-0 py-24 gap-12 flex flex-col justify-center items-center mx-auto relative">
        <div className="md:block hidden absolute -top-[8%] right-[25%] w-32 h-32 rounded-xl bg-palette-3 -rotate-[20deg]"></div>
        <div className="md:block hidden absolute top-[10%] right-[20%] w-12 h-12 rounded-full bg-palette-2"></div>
        <div className="w-full px-8 md:w-[90%] max-w-[98%] mx-auto flex flex-row justify-between items-center z-10">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-bold font-sans text-5xl md:text-left text-center uppercase text-palette-1"
          >
            calendar of activities
          </motion.h1>
          {/* Navigation buttons */}
          <div className="gap-10 md:flex hidden">
            <button
              onClick={prev}
              className={`  bg-white/80 p-3 rounded-full shadow-lg hover:bg-white transition-colors
            ${currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={currentPage === 0}
            >
              <Icon icon="ep:arrow-left" width="30" height="30" />
            </button>
            <button
              onClick={next}
              className={` bg-white/80 p-3 rounded-full shadow-lg hover:bg-white transition-colors
              ${
                currentPage === totalPages - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={currentPage === totalPages - 1}
            >
              <Icon
                icon="ep:arrow-left"
                width="30"
                height="30"
                className="rotate-180"
              />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="w-full h-fit relative flex flex-col justify-center items-center gap-10">
          <div className="overflow-hidden md:w-[90%] w-[98%] mx-auto">
            <motion.div
              className="flex"
              initial={false}
              animate={{ x: `${-currentPage * 100}%` }}
              transition={{ duration: 0.5 }}
            >
              {events.map((event) => (
                <div
                  key={event.id}
                  className={`${
                    cardsPerPage === 1
                      ? "w-full"
                      : cardsPerPage === 2
                      ? "w-1/2"
                      : "w-1/3"
                  } p-8 flex-shrink-0 box-border`}
                >
                  <Cards
                    {...event}
                    onRegisterClick={() => handleRegisterClick(event)}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="gap-10 md:hidden flex ">
          <button
            onClick={prev}
            className={`  bg-white/80 p-3 rounded-full shadow-lg hover:bg-white transition-colors
            ${currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={currentPage === 0}
          >
            <Icon icon="ep:arrow-left" width="30" height="30" />
          </button>
          <button
            onClick={next}
            className={` bg-white/80 p-3 rounded-full shadow-lg hover:bg-white transition-colors
              ${
                currentPage === totalPages - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            disabled={currentPage === totalPages - 1}
          >
            <Icon
              icon="ep:arrow-left"
              width="30"
              height="30"
              className="rotate-180"
            />
          </button>
        </div>
        

        

        <ToastContainer />
      </div>
    </div>
  );
};

const Cards: React.FC<ExtendedEventProps & { onRegisterClick: () => void }> = ({
  title,
  eventTitle,
  start_time,
  end_time,
  location,
  desc,
  image_path,
  onRegisterClick,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="w-full h-fit min-h-[30rem] max-h-[30rem] flex flex-col shadow-customShadow group bg-palette-6 text-white rounded-xl hover:shadow-customShadow2 transition-shadow"
    >
      {/* Fixed height container for image */}
      <div className="w-full h-48 flex-shrink-0 overflow-hidden rounded-t-xl">
        <img
          src={image_path}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content container with fixed padding and overflow handling */}
      <div className="flex flex-col flex-grow p-6 overflow-hidden">
        {/* Title with truncation */}

        {/* Time and location with consistent spacing */}
        <div className="flex flex-col gap-2 mb-4">
          <p className="text-left truncate">
            {start_time} - {end_time}
          </p>
          <p className="text-left text-sm">{location}</p>
        </div>
        <h1 className="font-bold text-xl mb-4 line-clamp-2 text-left">
          {title}
        </h1>

        {/* Description with line clamping */}
        {/* <p className="line-clamp-3 text-center mb-4 flex-grow">
          {desc}
        </p> */}

        {/* Button container fixed to bottom */}
        <div className="flex justify-center mt-auto">
          <EventButton onClick={onRegisterClick} image_path={image_path} />
        </div>
      </div>
    </motion.div>
  );
};

const EventButton: React.FC<{ onClick: () => void; image_path: string }> = ({
  onClick,
  image_path,
}) => {
  return (
    <div className="w-full h-14 relative overflow-hidden ">
      {/* Sliding and fading background */}
      <div className="w-full h-full absolute inset-0 z-10 bg-palette-1 group-hover:bg-transparent duration-700 ease-in-out group-hover:translate-x-[100%] group-hover:opacity-0"></div>

      {/* Background image */}
      <motion.div
        className="w-full h-full absolute top-0 left-0 inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image_path})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </motion.div>

      {/* Button */}
      <motion.button
        onClick={onClick}
        className="absolute z-20 inset-0 w-full h-full text-white font-bold tracking-wider transition-all duration-700"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Button text */}
        Register for Free
      </motion.button>
    </div>
  );
};