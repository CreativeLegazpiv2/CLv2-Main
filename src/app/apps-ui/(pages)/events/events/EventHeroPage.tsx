"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Event {
  id: number;
  title: string;
  date: string; // Format: YYYY-MM-DD
  start_time: string; // Format: HH:mm:ss
  end_time: string; // Format: HH:mm:ss
  image_path: string; // Event hero background image URL
}

export const EventHeroPage = () => {
  const [upcomingEvent, setUpcomingEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events-admin");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const events: Event[] = await response.json();

        const now = new Date();

        // Filter only future events (including today)
        const futureEvents = events.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= now;
        });

        if (futureEvents.length === 0) {
          setUpcomingEvent(null); // No upcoming events
          return;
        }

        // Find the event with the nearest date
        const closestEvent = futureEvents.reduce((prev, curr) => {
          const prevDate = new Date(prev.date);
          const currDate = new Date(curr.date);
          return currDate < prevDate ? curr : prev;
        });

        setUpcomingEvent(closestEvent || null);
      } catch (error) {
        console.error("Error fetching events:", error);
        setUpcomingEvent(null);
      }
    };

    fetchEvents();
  }, []);

  if (!upcomingEvent) {
    return null; // Do not render anything if no upcoming event
  }

  return (
    <div
      className="relative w-full h-dvh bg-cover bg-no-repeat bg-center"
      style={{
        backgroundImage: `url('${upcomingEvent.image_path || "/images/events/hero.jpg"}')`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>

      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-white font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight mb-8 drop-shadow-custom"
          >
            {upcomingEvent.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="mb-12"
          >
            <HeroButton event={upcomingEvent} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const HeroButton = ({ event }: { event: Event }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="w-fit px-8 py-3 bg-transparent text-white text-lg uppercase border-2 border-white rounded-full hover:bg-white hover:text-black transition-colors duration-300"
    >
      {`${new Date(event.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric", // Include the year
      })}`}
    </motion.button>
  );
};
