"use client";

import { PofconModal } from "@/components/reusable-component/PofconModal";
import { RegisterModal } from "@/components/reusable-component/RegisterModal";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface ButtonProp {
  list: boolean;
  setList: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AdminEvent {
  id: number;
  title: string;
  location: string;
  date: string;
  start_time: string;
  end_time: string;
  desc: string;
  image_path: string;
  created_at: string;
  status: boolean;
}

// Helper to group events by date
const groupEventsByDate = (events: AdminEvent[]) => {
  return events.reduce((acc: { [key: string]: AdminEvent[] } = {}, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {});
};

export const UpcomingEvents = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonthYear, setCurrentMonthYear] = useState("");
  const [list, setList] = useState<boolean>(true);
  const [events, setEvents] = useState<AdminEvent[]>([]);

  const updateMonthYear = (date: Date) => {
    const options = { month: "long" as const, year: "numeric" as const };
    setCurrentMonthYear(date.toLocaleDateString("en-US", options));
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
    updateMonthYear(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
    updateMonthYear(newDate);
  };

  useEffect(() => {
    updateMonthYear(currentDate);
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/admin-events");
      if (!response.ok) throw new Error("Error fetching events");
      const fetchedEvents: AdminEvent[] = await response.json();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const [showPofconModal, setShowPofconModal] = useState(false); // Modal state
  const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null); // State to store the selected event

  useEffect(() => {
    const handleResize = () => {
      setList(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full h-fit min-h-dvh max-w-[90%] mx-auto py-[15dvh] flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ margin: "20px", once: false }}
        transition={{ duration: 1 }}
        className="w-full"
      >
        <h1 className="font-extrabold lg:text-6xl md:text-5xl text-4xl text-primary-3 uppercase text-center">
          upcoming events
        </h1>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ margin: "50px", once: false }}
        transition={{ duration: 1 }}
        className="w-full h-fit flex justify-center items-center text-center pb-12"
      >
        <div className="w-fit flex gap-6 justify-center items-center">
          <Icon
            icon="ph:arrow-left"
            width="35"
            height="35"
            onClick={goToPreviousMonth}
            className="cursor-pointer"
          />
          <h1 className="font-bold md:text-4xl text-2xl uppercase">
            {currentMonthYear}
          </h1>
          <Icon
            icon="ph:arrow-right"
            width="35"
            height="35"
            onClick={goToNextMonth}
            className="cursor-pointer"
          />
        </div>
      </motion.div>
      <EventGrid
        currentDate={currentDate}
        list={list}
        setList={setList}
        events={events}
        setShowPofconModal={setShowPofconModal}
        setSelectedEvent={setSelectedEvent} // Pass the setter for selected event
      />
      {showPofconModal && selectedEvent !== null && (
        <RegisterModal
          setShowPofconModal={setShowPofconModal}
          eventId={selectedEvent.id}
          eventTitle={selectedEvent.title}
          eventLocation={selectedEvent.location}
          eventStartTime={selectedEvent.start_time}
          eventEndTime={selectedEvent.end_time}
        />
      )}
    </div>
  );
};

const EventGrid: React.FC<{
  currentDate: Date;
  list: boolean;
  setList: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPofconModal: React.Dispatch<React.SetStateAction<boolean>>;
  events: AdminEvent[];
  setSelectedEvent: React.Dispatch<React.SetStateAction<AdminEvent | null>>; // Setter for selected event
}> = ({
  currentDate,
  list,
  setList,
  events,
  setShowPofconModal,
  setSelectedEvent,
}) => {
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getFullYear() === currentDate.getFullYear() &&
      eventDate.getMonth() === currentDate.getMonth()
    );
  });

  const groupedEvents = groupEventsByDate(filteredEvents);
  const sortedDates = Object.keys(groupedEvents).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div className="w-full h-fit flex flex-col gap-12 relative">
      <div className="w-full flex justify-end items-center">
        <ListButton list={list} setList={setList} />
      </div>
      {sortedDates.length > 0 ? (
        sortedDates.map((date, groupIndex) => (
          <div key={date}>
            <h1 className="font-bold text-4xl uppercase pb-8 md:text-left text-center">
              {(() => {
                const dateObject = new Date(date);
                const day = dateObject.getDate().toString().padStart(2, "0");
                const weekday = dateObject.toLocaleDateString("en-US", {
                  weekday: "long",
                });
                return `${day} - ${weekday}`;
              })()}
            </h1>
            <div
              className={`w-full h-fit ${
                list
                  ? "flex flex-col gap-4"
                  : "grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-12"
              }`}
            >
              {groupedEvents[date].map((event) => (
                <EventCard
                  event={event}
                  key={event.id}
                  groupIndex={groupIndex}
                  list={list}
                  setShowPofconModal={setShowPofconModal}
                  setSelectedEvent={setSelectedEvent} // Pass setter for event
                />
              ))}
            </div>
            <div
              className={`w-full h-[1px] bg-primary-1 mt-12 ${
                list ? "hidden" : ""
              }`}
            ></div>
          </div>
        ))
      ) : (
        <p className="text-center text-2xl font-semibold mt-12">
          No events available
        </p>
      )}
    </div>
  );
};

const EventCard: React.FC<{
  event: AdminEvent;
  groupIndex: number;
  list: boolean;
  setShowPofconModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedEvent: React.Dispatch<React.SetStateAction<AdminEvent | null>>; // Setter for event
}> = ({ event, groupIndex, list, setShowPofconModal, setSelectedEvent }) => {
  const colorClasses = getColorClasses(groupIndex);

  return (
    <motion.div
      whileHover={
        list
          ? { backgroundColor: "transparent" }
          : { scale: 1.05, backgroundColor: "transparent" }
      }
      className={`w-full ${
        list
          ? "flex flex-row gap-6 justify-start items-center"
          : "max-w-xs mx-auto flex flex-col gap-4"
      } ${colorClasses.bgColor} border-2 ${
        colorClasses.border
      } duration-500 p-4 text-base group`}
    >
      <div className={`${list ? "h-24 w-full max-w-44" : "h-48 w-full"}`}>
        <img
          className={`object-cover ${list ? "w-44 h-24" : "h-48 w-full"}`}
          src={event.image_path || "../images/events/cover.png"}
          alt={event.title}
        />
      </div>
      <div
        className={`w-full flex gap-4 ${
          list ? "flex-col-reverse" : "flex-col"
        }`}
      >
        <div className="w-full flex justify-between items-center">
          <div className="w-fit flex flex-col leading-3">
            <p className={`font-bold duration-500 ${colorClasses.textColor}`}>
              {event.start_time} - {event.end_time}
            </p>
            <p className="text-sm capitalize font-medium">{event.location}</p>
          </div>
          <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
            <Icon
              className={`rotate-180 -mt-4 cursor-pointer duration-300 ${
                colorClasses.textColor
              } ${list ? "hidden" : "block"}`}
              icon="ph:arrow-left-bold"
              width="25"
              height="25"
            />
          </motion.div>
        </div>
        <div className="w-full">
          <h1
            className={`w-full text-xl font-semibold title duration-300 ${
              colorClasses.textColor
            } ${list ? "max-w-full" : "max-w-56"}`}
          >
            {event.title}
          </h1>
        </div>
      </div>
      <EventRegisterButton
        colorClasses={colorClasses}
        list={list}
        setShowPofconModal={setShowPofconModal}
        setSelectedEvent={() => setSelectedEvent(event)} // Pass the event to setSelectedEvent
      />
    </motion.div>
  );
};

const EventRegisterButton = ({
  colorClasses,
  list,
  setShowPofconModal,
  setSelectedEvent,
}: {
  colorClasses: any;
  list: boolean;
  setShowPofconModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedEvent: () => void;
}) => {
  return (
    <motion.button
      className={`px-6 py-1.5 bg-primary-1 text-secondary-2 font-medium transition-colors duration-500 ease-in-out 
        ${colorClasses.bgHover} 
        ${colorClasses.textHover}
        ${list ? "w-fit px-6 whitespace-nowrap" : "w-full"}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        setSelectedEvent(); // Set the selected event
        setShowPofconModal(true);
      }}
    >
      Register for free
    </motion.button>
  );
};


const ListButton: React.FC<ButtonProp> = ({ list, setList }) => {
  return (
    <motion.button
      className="w-44 py-1 bg-secondary-1 border-2 border-secondary-2 text-secondary-2 font-medium transition-colors duration-500 ease-in-out md:block hidden"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setList((prev) => !prev)}
    >
      {list ? "Show as Grid" : "Show as List"}
    </motion.button>
  );
};

const getColorClasses = (index: number) => {
  switch (index % 3) {
    case 0:
      return {
        bgColor: "bg-shade-2",
        textColor: "group-hover:text-shade-3",
        border: "border-shade-2",
        bgHover: "group-hover:bg-shade-3",
        textHover: "group-hover:text-white",
      };
    case 1:
      return {
        textColor: "group-hover:text-shade-4",
        bgColor: "bg-shade-5",
        border: "border-shade-5",
        bgHover: "group-hover:bg-shade-4",
        textHover: "group-hover:text-white",
      };
    case 2:
      return {
        bgColor: "bg-shade-1",
        textColor: "group-hover:text-primary-3",
        border: "border-shade-1",
        bgHover: "group-hover:bg-primary-3",
        textHover: "group-hover:text-white",
      };
    default:
      return {
        bgColor: "bg-gray-500",
        textColor: "text-gray-500",
        border: "border-gray-500",
        bgHover: "group-hover:bg-gray-500",
        textHover: "group-hover:text-white",
      };
  }
};
