"use client";

import { RegisterModal } from "@/components/reusable-component/RegisterModal";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

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
}

export const Events = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(1);
  const [events, setEvents] = useState<EventProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventProps | null>(null);

  const handleRegisterClick = (event: EventProps) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/admin-events"); // Adjust the endpoint as needed
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
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-dvw md:h-dvh h-fit md:py-0 py-24 gap-12 flex flex-col justify-center items-start md:max-w-[80%] mx-auto">
      <div className="overflow-hidden md:w-[90%] w-[80%] mx-auto flex flex-col gap-12">
        <h1 className="h-fit font-bold md:text-5xl text-4xl md:mx-0 mx-auto mb-4 md:text-left text-center ">
          Check out our events
        </h1>
      </div>

      {/* Carousel */}
      <div className="h-fit w-full relative">
        <div className="overflow-hidden md:w-[90%] w-[80%] mx-auto flex flex-col gap-12">
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
                <Cards {...event} onRegisterClick={() => handleRegisterClick(event)}/>
              </div>
            ))}
          </motion.div>
        </div>
        {/* Navigation buttons */}
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 text-primary-1 p-2"
          disabled={currentPage === 0}
        >
          <Icon icon="ep:arrow-left" width="45" height="45" />
        </button>
        <button
          onClick={next}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 text-primary-1 p-2"
          disabled={currentPage === totalPages - 1}
        >
          <Icon
            className="rotate-180"
            icon="ep:arrow-left"
            width="45"
            height="45"
          />
        </button>
      </div>
      {/* Register Modal */}
      {showModal && selectedEvent && (
        <RegisterModal
          setShowPofconModal={setShowModal}
          eventId={parseInt(selectedEvent.id)}
          eventTitle={selectedEvent.title}
          eventLocation={selectedEvent.location}
          eventStartTime={selectedEvent.start_time}
          eventEndTime={selectedEvent.end_time}
        />
      )}
      <ToastContainer/>
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
  onRegisterClick
}) => {
  return (
    <div className="w-full h-fit flex flex-col justify-center items-center gap-6 p-8 bg-shade-2 text-secondary-2 rounded-xl text-lg">
      <h1 className="font-bold text-4xl title">{title}</h1>
      <div className="w-full flex flex-col md:justify-start md:items-start justify-center items-center gap-6">
        <div className="flex flex-col gap-2 leading-3">
          <p className="whitespace-nowrap">
            {start_time} - {end_time}
          </p>
          <small>{location}</small>
        </div>
        <p className={`font-medium title w-full md:text-left text-center ${
          desc.length > 25 ? "line-clamp-1" : ""
        }`}>
          {desc}
        </p>
      </div>
      <EventButton onClick={onRegisterClick} />
    </div>
  );
};

const EventButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="w-fit px-4 py-1.5 bg-primary-1 text-secondary-2 whitespace-nowrap"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Register for free
    </motion.button>
  );
};
