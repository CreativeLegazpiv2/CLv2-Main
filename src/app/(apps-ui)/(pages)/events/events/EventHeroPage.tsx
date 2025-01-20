"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Event {
  id: number;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  image_path: string;
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
        const futureEvents = events.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= now;
        });

        if (futureEvents.length === 0) {
          setUpcomingEvent(null);
          return;
        }

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
    return null;
  }

  return (
    <div className="relative w-full h-dvh ">
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-center"
        style={{
          backgroundImage: `url('${upcomingEvent.image_path || "/images/events/hero.jpg"}')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/20" />

      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-4xl text-center group">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-palette-5 group-hover:text-palette-4 transition-colors duration-300 font-bold text-3xl sm:text-6xl lg:text-7xl leading-tight mb-8 drop-shadow-custom"
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

      {/* Wave SVG at the bottom */}
      <div className="absolute md:-bottom-[6rem] left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-16 sm:h-24"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-black/50"
          />
        </svg>
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
      className="w-fit px-8 py-3 text-palette-7 text-lg uppercase bg-palette-5  rounded-full group-hover:bg-palette-4 hover:text-palette-5 transition-colors duration-300"
    >
      {`${new Date(event.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}`}
    </motion.button>
  );
};