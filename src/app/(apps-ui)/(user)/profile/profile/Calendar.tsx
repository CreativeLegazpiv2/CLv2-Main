import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { CalendarModal, FormInput } from "./(modals)/CalendarModal";
import { ToastContainer } from "react-toastify";
import { getSession } from "@/services/authservice";
import { jwtVerify } from "jose";
import { supabase } from "@/services/supabaseClient";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret";
const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

interface Event {
  id: string;
  event_title: string;
  selected_date: string; // The date format from the backend
  start_time: string;
  end_time: string;
  event_location: string;
}

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
  const [selectedDay, setSelectedDay] = useState<Date | null>(null); // Selected day
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null); // Selected event
  const [events, setEvents] = useState<Event[]>([]);

  // Fetch events from the API

  useEffect(() => {
    const subscription = supabase
      .channel("creative_eventss")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all types of changes (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "creative_events",
        },
        (payload: any) => {
          const newEvent = payload.new;
          const eventId = newEvent.id; // Adjust this based on your unique event identifier
  
          switch (payload.eventType) {
            case 'INSERT':
              // Add new event if it doesn't already exist
              setEvents((prev) => [...prev, newEvent]);
              break;
  
            case 'UPDATE':
              // Update existing event
              setEvents((prev) =>
                prev.map((event) => (event.id === eventId ? newEvent : event))
              );
              break;
  
            case 'DELETE':
              // Remove deleted event
              setEvents((prev) => prev.filter((event) => event.id !== eventId));
              break;
  
            default:
              break;
          }
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
  

  useEffect(() => {
    const fetchEvents = async () => {
      const token = getSession();
      if (!token) return;

      try {
        const { payload } = await jwtVerify(
          token,
          new TextEncoder().encode(JWT_SECRET)
        );
        const userId = payload.id as string;
        const response = await fetch("/api/events", {
          method: "GET",
          headers: {
            "User-ID": userId,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();
        setEvents(data); // Store the fetched events
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setCurrentDate(today);
  }, []);

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedDay(null); // Reset the selected day
  };

  const formatDateToCST = (date: Date): string => {
    return new Date(date).toLocaleString("en-US", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleDayClick = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // month is 0-indexed
    const selectedDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));

    setSelectedDay(selectedDate); // Set the selected day
    setSelectedEvent(null); // Clear any selected event
    setIsModalOpen(true); // Open the modal for day
  };

  const openModalWithEvent = (event: Event) => {
    setSelectedEvent(event); // Set the selected event
    setSelectedDay(null); // Clear the selected day
    setIsModalOpen(true); // Open the modal for event
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-indexed month
    const firstDay = new Date(year, month, 1); // First day of the month
    const lastDay = new Date(year, month + 1, 0); // Last day of the month

    const daysInMonth = lastDay.getDate(); // Number of days in the month
    const startingDayIndex = firstDay.getDay(); // First day of the month (0 = Sunday)

    const days = [];

    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < startingDayIndex; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="border border-gray-700 flex items-start justify-start p-2 "
        />
      );
    }

    // Add cells for the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(year, month, day);
      const currentDayString = formatDateToCST(currentDay); // Use the new format function

      // Filter events where the selected_date matches the formatted current day in CST
      const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.selected_date);
        const formattedEventDate = formatDateToCST(eventDate);
        return formattedEventDate === currentDayString;
      });

      days.push(
        <div
          key={day}
          className="border min-h-[8rem] border-gray-700 flex flex-col items-start justify-start p-2 cursor-pointer group hover:bg-shade-2 transition-colors"
          onClick={() => handleDayClick(day)} // Open modal when clicked on the day
        >
          {day}
          {/* Render events if there are any for this day */}
          {dayEvents.length > 0 && (
            <div className="mt-1 text-xs text-secondary-2 flex flex-col gap-2">
              {dayEvents.map((event) => {
                const eventDate = new Date(event.selected_date);
                const [startHour, startMinute, startSecond] =
                  event.start_time.split(":");
                const [endHour, endMinute, endSecond] =
                  event.end_time.split(":");

                // Start and end times with the correct date
                const startTime = new Date(eventDate);
                startTime.setHours(
                  parseInt(startHour),
                  parseInt(startMinute),
                  parseInt(startSecond)
                );

                const endTime = new Date(eventDate);
                endTime.setHours(
                  parseInt(endHour),
                  parseInt(endMinute),
                  parseInt(endSecond)
                );

                // Format times to 12-hour format
                const formattedStartTime = startTime.toLocaleTimeString(
                  "en-US",
                  {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  }
                );
                const formattedEndTime = endTime.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                });

                return (
                  <div
                    key={event.id}
                    className="bg-shade-4 p-2 rounded-lg text-shade-9 hover:bg-shade-3 hover:text-secondary-1 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent day click
                      openModalWithEvent(event); // Open modal with event details
                    }}
                  >
                    <p>{event.event_title}</p>
                    <p>
                      {formattedStartTime} - {formattedEndTime}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="w-full md:p-6 bg-shade-1 rounded-b-xl">
      {/* Pass the selectedDay as a Date object */}
      <CalendarModal
        isOpen={isModalOpen}
        onClose={closeModal}
        closeHandler={closeModal}
        selectedDay={selectedDay ?? new Date()} // Display day if selected
        event={selectedEvent as FormInput | null} // Display event if selected, or null
      />

      <div className="w-full flex flex-col p-4 rounded-lg">
        <div className="w-fit gap-8 flex justify-between items-center mb-8 mx-auto">
          <button onClick={prevMonth} className="cursor-pointer">
            <Icon icon="ph:arrow-left" width="35" height="35" />
          </button>
          <h2 className="text-xl font-semibold">
            {currentDate
              .toLocaleString("default", { month: "long", year: "numeric" })
              .toUpperCase()}
          </h2>
          <button onClick={nextMonth} className="cursor-pointer">
            <Icon
              icon="ph:arrow-left"
              className="rotate-180"
              width="35"
              height="35"
            />
          </button>
        </div>

        <div className="w-full h-fit grid grid-cols-7 auto-rows-fr gap-0 bg-orange-200">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="text-center flex justify-center items-center font-semibold text-sm py-2 bg-shade-1"
            >
              {day}
            </div>
          ))}
          {renderCalendarDays()}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};