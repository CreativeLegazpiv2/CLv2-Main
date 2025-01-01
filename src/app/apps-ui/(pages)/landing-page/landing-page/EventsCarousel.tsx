"use client";

import { RegisterModal } from "@/components/reusable-component/RegisterModal";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EventProps {
  id: string;
  eventTitle: string;
  start_time: string;
  end_time: string;
  location: string;
  date: string;
  desc: string;
  title: string;
  image_path: string; // Added image field
}

export const Events = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(1);
  const [events, setEvents] = useState<EventProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventProps | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false); // New state for event details

  const handleRegisterClick = (event: EventProps) => {
    setSelectedEvent(event);
    setShowEventDetails(true); // Show event details first
  };

  const handleInterestClick = () => {
    setShowModal(true); // Show registration modal
  };

  const handleRegistrationSuccess = () => {
    setShowModal(false); // Close the modal
    console.log("Registration successful!");
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/admin-events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data);
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

  const totalPages = Math.ceil(events.length / cardsPerPage);

  const next = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  if (loading) {
    return <div className="text-center text-2xl font-semibold">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center text-2xl font-semibold text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-dvw md:h-dvh h-fit md:py-0 py-24 gap-12 flex flex-col justify-center items-center md:max-w-[90%] mx-auto">
      <div className="w-full text-center">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-bold text-4xl sm:text-5xl md:text-6xl mb-8"
        >
          Check Out Our Events
        </motion.h1>
      </div>

      {/* Carousel */}
      <div className="w-full h-fit relative">
        <div className="overflow-hidden w-[90%] mx-auto">
          <motion.div
            className="flex"
            initial={false}
            animate={{ x: `${-currentPage * 100}%` }}
            transition={{ duration: 0.5 }}
          >
            {/* Cards */}
            {events.map((event) => (
              <div
                key={event.id}
                className={`${
                  cardsPerPage === 1
                    ? "w-full"
                    : cardsPerPage === 2
                    ? "w-1/2"
                    : "w-1/3"
                } p-4 flex-shrink-0 box-border`}
              >
                <Cards {...event} onRegisterClick={() => handleRegisterClick(event)} />
              </div>
            ))}
          </motion.div>
        </div>
        {/* Navigation buttons */}
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg hover:bg-white transition-colors"
          disabled={currentPage === 0}
        >
          <Icon icon="ep:arrow-left" width="30" height="30" />
        </button>
        <button
          onClick={next}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg hover:bg-white transition-colors"
          disabled={currentPage === totalPages - 1}
        >
          <Icon icon="ep:arrow-left" width="30" height="30" className="rotate-180" />
        </button>
      </div>

      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <motion.div
            className="relative w-full max-w-4xl h-fit bg-white rounded-2xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid md:grid-cols-2 gap-8 p-10">
              {/* Left Side - Event Image */}
              <div className="relative">
                <img
                  src={selectedEvent.image_path}
                  alt={selectedEvent.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              {/* Right Side - Event Details */}
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-gray-800">{selectedEvent.title}</h1>
                <p className="text-gray-600">{selectedEvent.desc}</p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Icon icon="mdi:calendar" className="text-gray-600 mr-2" />
                    <p className="text-gray-600">
                      {selectedEvent.start_time} - {selectedEvent.end_time} ({selectedEvent.date})
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Icon icon="mdi:map-marker" className="text-gray-600 mr-2" />
                    <p className="text-gray-600">{selectedEvent.location}</p>
                  </div>
                </div>
                <button
                  onClick={handleInterestClick}
                  className="w-full py-3 bg-primary-2 text-white rounded-lg font-semibold uppercase tracking-wide transition-all duration-300 hover:bg-primary-1 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  I'm Interested
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowEventDetails(false)}
              className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
            >
              <Icon icon="mdi:close" width="24" height="24" />
            </button>
          </motion.div>
        </div>
      )}

      {/* Register Modal */}
      {showModal && selectedEvent && (
        <RegisterModal
          setShowPofconModal={setShowModal}
          eventId={parseInt(selectedEvent.id)}
          eventTitle={selectedEvent.title}
          eventLocation={selectedEvent.location}
          eventStartTime={selectedEvent.start_time}
          eventEndTime={selectedEvent.end_time}
          onSuccess={handleRegistrationSuccess}
        />
      )}
      <ToastContainer />
    </div>
  );
};

const Cards: React.FC<EventProps & { onRegisterClick: () => void }> = ({
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
      className="w-full h-fit flex flex-col justify-center items-center gap-6 p-8 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
    >
      {/* Event Image */}
      <div className="relative w-full h-48 overflow-hidden rounded-lg">
        <img
          src={image_path}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Event Details */}
      <h1 className="font-bold text-3xl text-center text-gray-800">{title}</h1>
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="whitespace-nowrap text-center text-gray-600">
            {start_time} - {end_time}
          </p>
          <small className="text-center text-gray-500">{location}</small>
        </div>
      </div>
      <EventButton onClick={onRegisterClick} />
    </motion.div>
  );
};

const EventButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="w-fit px-6 py-2 bg-gradient-to-r from-orange-300 to-orange-200 text-white rounded-lg font-medium hover:from-orange-400 hover:to-orange-300 transition-all duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Register for Free
    </motion.button>
  );
};