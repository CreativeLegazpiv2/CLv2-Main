"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { EventDetails } from "./EventDetails";

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export const CalendarEvent: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const dateColorMap = new Map<string, { bgColor: string; textColor: string }>(); // Store color for each unique date

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

  // Assign colors based on the unique dates of events
  const assignColorsToDates = (events: { date: string }[]) => {
    let colorIndex = 0;
    events.forEach((event) => {
      if (!dateColorMap.has(event.date)) {
        const colorClasses = getColorClasses(colorIndex);
        dateColorMap.set(event.date, { bgColor: colorClasses.bgColor, textColor: colorClasses.textColor });
        colorIndex = (colorIndex + 1) % 3; // Cycle through 3 colors
      }
    });
  };

  // Call the function to assign colors to dates
  assignColorsToDates(EventDetails);

  const renderEventsForDay = (day: number) => {
    // Create a date object for the specific day
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const formattedDate = date.toLocaleDateString("en-CA"); // 'en-CA' locale gives YYYY-MM-DD

    // Filter events that match the exact date
    const eventsForDay = EventDetails.filter((event) => event.date === formattedDate);

    // If no events exist, return null
    if (eventsForDay.length === 0) {
      return null;
    }

    // Render event details if there are events
    return (
      <div className="events mt-1">
        {eventsForDay.map((event, index) => {
          const { bgColor, textColor } = dateColorMap.get(event.date) || { bgColor: "bg-gray-500", textColor: "text-gray-500" }; // Get colors for the event date
          return (
            <div
              key={index}
              className={`event-item text-sm mt-2 ${bgColor} p-2 rounded`}
            >
              <div className="w-full flex flex-col gap-2 justify-center items-center">
                <div className="w-full flex justify-center items-center gap-2 h-16 aspect-square">
                  <img
                    className="w-full h-full object-cover"
                    src={event.coverPhoto}
                    alt={event.title} // Add alt text for accessibility
                  />
                  <p className={`text-xs font-semibold ${textColor}`}>
                    {event.strTime} to {event.endTime}
                  </p>
                </div>

                  <p className={`text-sm font-medium ${textColor} ${event.title.length > 10 ? "" : ""}`}>
                    {event.title}
                  </p>
 
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayIndex = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < startingDayIndex; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="calendar-day border border-gray-700 flex items-start justify-start p-2"
        />
      );
    }

    // Add cells for the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div
          key={day}
          className="calendar-day border border-gray-700 flex flex-col items-start justify-start p-2 min-h-36"
        >
          <div className="day-number">{day}</div>
          {renderEventsForDay(day)}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="w-full max-w-[90%] mx-auto md:p-6 bg-shade-2 my-[10dvh] border border-black">
      <h1 className="text-5xl font-semibold pl-4 title pb-8">Events Calendar</h1>
      <div className="w-full flex flex-col p-4 rounded-lg">
        <div className="w-full flex flex-row justify-between items-center pb-12">
          <div className="w-fit gap-8 flex justify-center items-center">
            <button onClick={prevMonth} className="cursor-pointer">
              <Icon icon="ph:arrow-left" width="35" height="35" />
            </button>
            <h2 className="text-xl font-semibold">
              {currentDate.toLocaleString("default", { month: "long", year: "numeric" }).toUpperCase()}
            </h2>
            <button onClick={nextMonth} className="cursor-pointer">
              <Icon icon="ph:arrow-left" className="rotate-180" width="35" height="35" />
            </button>
          </div>
          <div>
            <button className="border border-secondary-1 px-4 py-2">Filter</button>
          </div>
        </div>
        <div className="w-full grid grid-cols-7 auto-rows-min gap-0 bg-shade-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center flex justify-center items-center font-semibold text-sm py-2 bg-shade-2">
              {day}
            </div>
          ))}
          {renderCalendarDays()}
        </div>
      </div>
    </div>
  );
};

const getColorClasses = (index: number) => {
  // Using index % 3 to cycle through the color schemes
  switch (index % 3) {
    case 0: // Green theme
      return {
        bgColor: "bg-shade-3",
        textColor: "text-secondary-1",
      };
    case 1: // Violet theme
      return {
        bgColor: "bg-shade-5",
        textColor: "text-secondary-2",
      };
    case 2: // Orange theme
      return {
        bgColor: "bg-shade-1",
        textColor: "text-secondary-2",
      };
    default:
      return {
        bgColor: "bg-gray-500",
        textColor: "text-gray-500",
      };
  }
};
