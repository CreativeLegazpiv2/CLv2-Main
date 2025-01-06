"use client";

import { RegisterModal } from "@/components/reusable-component/RegisterModal";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExtendedEventProps {
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
}

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${isActive
        ? 'bg-primary-2 text-white shadow-md'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
  >
    {label}
  </button>
);

export const Events = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(1);
  const [events, setEvents] = useState<ExtendedEventProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ExtendedEventProps | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const handleRegisterClick = (event: ExtendedEventProps) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleInterestClick = () => {
    setShowModal(true);
  };

  const handleRegistrationSuccess = () => {
    setShowModal(false);
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
            {events.map((event) => (
              <div
                key={event.id}
                className={`${cardsPerPage === 1
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

      {/* Enhanced Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <motion.div
            className="relative w-full max-w-5xl h-[90vh] md:h-[80vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Hero Section */}
            <div className="relative h-48 md:h-64">
              <img
                src={selectedEvent.image_path}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <h1 className="absolute bottom-4 left-4 md:bottom-6 md:left-8 text-2xl md:text-4xl font-bold text-white">
                {selectedEvent.title}
              </h1>
            </div>

            {/* Content Section */}
            <div className="p-4 md:p-8">
              {/* Tabs */}
              <div className="flex gap-2 mb-4 md:mb-6 overflow-x-auto pb-2">
                <TabButton
                  label="Details"
                  isActive={activeTab === 'details'}
                  onClick={() => setActiveTab('details')}
                />
                <TabButton
                  label="About"
                  isActive={activeTab === 'about'}
                  onClick={() => setActiveTab('about')}
                />
                <TabButton
                  label="Contact"
                  isActive={activeTab === 'contact'}
                  onClick={() => setActiveTab('contact')}
                />
              </div>

              {/* Tab Content */}
              <div className="h-[calc(90vh-300px)] md:h-[calc(80vh-400px)] overflow-y-auto custom-scrollbar">
                {activeTab === 'details' && (
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center gap-4">
                      <Icon icon="mdi:calendar" className="text-xl md:text-2xl text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-800">Date & Time</p>
                        <p className="text-gray-600">
                          {selectedEvent.date} • {selectedEvent.start_time} - {selectedEvent.end_time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Icon icon="mdi:map-marker" className="text-xl md:text-2xl text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-800">Location</p>
                        <p className="text-gray-600">{selectedEvent.location}</p>
                      </div>
                    </div>
                    {selectedEvent.columns && (
                      <div className="grid md:grid-cols-2 gap-4 mt-4 md:mt-6">
                        {selectedEvent.columns.map((column, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-600">{column}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'about' && (
                  <div className="space-y-4 md:space-y-6">
                    {selectedEvent.objective && (
                      <div>
                        <h3 className="text-lg md:text-xl font-semibold mb-2">Objective</h3>
                        <p className="text-gray-600">{selectedEvent.objective}</p>
                      </div>
                    )}
                    {selectedEvent.announcement && (
                      <div>
                        <h3 className="text-lg md:text-xl font-semibold mb-2">Announcement</h3>
                        <p className="text-gray-600">{selectedEvent.announcement}</p>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold mb-2">Description</h3>
                      <p className="text-gray-600">{selectedEvent.desc}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div className="space-y-4 md:space-y-6">
                    {selectedEvent.contact && (
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Icon icon="mdi:contact" className="text-xl md:text-2xl text-gray-600" />
                          <p className="ml-2 font-medium text-gray-800">Contact Information</p>
                        </div>
                        <div className="text-gray-600">
                         {selectedEvent.contact.split(',').map((contactItem, index) => (
                            <span key={index} className="block">
                             - {contactItem.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedEvent.website && (
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Icon icon="mdi:web" className="text-xl md:text-2xl text-gray-600" />
                          <p className="ml-2 font-medium text-gray-800">Website</p>
                        </div>
                        <a
                          href={selectedEvent.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-2 hover:underline"
                        >
                          {selectedEvent.website}
                        </a>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Action Buttons */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-white border-t">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setShowEventDetails(false)}
                    className="px-4 py-2 md:px-6 md:py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleInterestClick}
                    className="px-4 py-2 md:px-6 md:py-2 bg-primary-2 text-white rounded-lg font-medium hover:bg-primary-1 transition-colors"
                  >
                    Register Now
                  </button>
                </div>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowEventDetails(false)}
              className="absolute top-2 right-2 md:top-4 md:right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
            >
              <Icon icon="mdi:close" width="20" height="20" />
            </button>
          </motion.div>
        </div>
      )}

      {/* Register Modal */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <RegisterModal
            setShowPofconModal={setShowModal}
            eventId={parseInt(selectedEvent.id)}
            eventTitle={selectedEvent.title}
            eventLocation={selectedEvent.location}
            eventStartTime={selectedEvent.start_time}
            eventEndTime={selectedEvent.end_time}
            onSuccess={() => {
              toast.success("Successfully Registered!", {
                position: "bottom-right", // Position of the toast
                autoClose: 3000, // Auto-close after 3 seconds
              });
            }}
          />
        </div>
      )}
      <ToastContainer />
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
      className="w-full h-[500px] flex flex-col bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
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
        <h1 className="font-bold text-2xl text-gray-800 mb-4 line-clamp-2 text-center">
          {title}
        </h1>

        {/* Time and location with consistent spacing */}
        <div className="flex flex-col gap-2 mb-4">
          <p className="text-gray-600 text-center truncate">
            {start_time} - {end_time}
          </p>
          <p className="text-gray-500 text-center text-sm truncate">
            {location}
          </p>
        </div>

        {/* Description with line clamping */}
        <p className="text-gray-600 line-clamp-3 text-center mb-4 flex-grow">
          {desc}
        </p>

        {/* Button container fixed to bottom */}
        <div className="flex justify-center mt-auto">
          <EventButton onClick={onRegisterClick} />
        </div>
      </div>
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