import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Set the time to the start of the day to avoid any time zone issues
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setCurrentDate(today);
  }, []);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
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
        <div key={`empty-${i}`} className="calendar-day border border-gray-700 flex items-start justify-start p-2" />
      );
    }

    // Add cells for the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div key={day} className="calendar-day border border-gray-700 flex items-start justify-start p-2">
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="w-full md:p-6 bg-shade-1 rounded-b-xl">
      <div className="w-full flex flex-col p-4 rounded-lg">
        <div className="w-fit gap-8 flex justify-between items-center mb-8 mx-auto">
          <button onClick={prevMonth} className="cursor-pointer">
            <Icon icon="ph:arrow-left" width="35" height="35" />
          </button>
          <h2 className="text-xl font-semibold">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase()}
          </h2>
          <button onClick={nextMonth} className="cursor-pointer">
            <Icon icon="ph:arrow-left" className="rotate-180" width="35" height="35" />
          </button>
        </div>
        <div className="w-full h-[70dvh] grid grid-cols-7 auto-rows-fr gap-0 bg-orange-200"> 
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
    </div>
  );
};