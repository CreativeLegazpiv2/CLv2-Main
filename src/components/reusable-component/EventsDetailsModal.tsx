import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";

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
  status?: boolean;
}

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

interface EventDetailsModalProps {
  setShowEventDetails: Dispatch<SetStateAction<boolean>>;
  eventDetails: ExtendedEventProps;
  onRegisterClick: () => void; // Add this prop
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

export const EventDetailsModal = ({
  setShowEventDetails,
  eventDetails,
  onRegisterClick, // Add this prop
}: EventDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState("details");

  const handleInterestClick = () => {
    onRegisterClick(); // Trigger the register modal in page.tsx
  };

  return (
    <>
      {eventDetails && (
        <div className="w-full md:h-screen top-0 left-0 fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <motion.div
            className="relative w-full md:max-w-[75%] max-w-[90%] h-full max-h-[80dvh] flex flex-col bg-white rounded-2xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Hero Section */}
            <div className="relative h-48 md:h-64">
              <img
                src={eventDetails.image_path}
                alt={eventDetails.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <h1 className="absolute bottom-4 left-4 md:bottom-6 md:left-8 text-2xl md:text-4xl font-bold text-white">
                {eventDetails.title}
              </h1>
            </div>

            {/* Content Section */}
            <div className="p-4 md:p-8 flex flex-col h-full overflow-y-auto">
              {/* Tabs */}
              <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                <TabButton
                  label="Details"
                  isActive={activeTab === "details"}
                  onClick={() => setActiveTab("details")}
                />
                <TabButton
                  label="About"
                  isActive={activeTab === "about"}
                  onClick={() => setActiveTab("about")}
                />
                <TabButton
                  label="Contact"
                  isActive={activeTab === "contact"}
                  onClick={() => setActiveTab("contact")}
                />
              </div>

              {/* Tab Content */}
              <div className="h-full flex-1 overflow-y-auto custom-scrollbar">
                {activeTab === "details" && (
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center gap-4">
                      <Icon
                        icon="mdi:calendar"
                        className="text-xl md:text-2xl text-gray-600"
                      />
                      <div>
                        <p className="font-medium text-gray-800">Date & Time</p>
                        <p className="text-gray-600">
                          {eventDetails.date} • {eventDetails.start_time} -{" "}
                          {eventDetails.end_time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Icon
                        icon="mdi:map-marker"
                        className="text-xl md:text-2xl text-gray-600"
                      />
                      <div>
                        <p className="font-medium text-gray-800">Location</p>
                        <p className="text-gray-600">
                          {eventDetails.location}
                        </p>
                      </div>
                    </div>
                    {eventDetails.columns && (
                      <div className="grid md:grid-cols-2 gap-4 mt-4 md:mt-6">
                        {eventDetails.columns.map((column, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-4 rounded-lg"
                          >
                            <p className="text-gray-600">{column}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "about" && (
                  <div className="space-y-4 md:space-y-6">
                    {eventDetails.objective && (
                      <div>
                        <h3 className="text-lg md:text-xl font-semibold mb-2">
                          Objective
                        </h3>
                        <p className="text-gray-600">
                          {eventDetails.objective}
                        </p>
                      </div>
                    )}
                    {eventDetails.announcement && (
                      <div>
                        <h3 className="text-lg md:text-xl font-semibold mb-2">
                          Announcement
                        </h3>
                        <p className="text-gray-600">
                          {eventDetails.announcement}
                        </p>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold mb-2">
                        Description
                      </h3>
                      <p className="text-gray-600">{eventDetails.desc}</p>
                    </div>
                  </div>
                )}

                {activeTab === "contact" && (
                  <div className="space-y-4 md:space-y-6">
                    {eventDetails.contact && (
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Icon
                            icon="mdi:contact"
                            className="text-xl md:text-2xl text-gray-600"
                          />
                          <p className="ml-2 font-medium text-gray-800">
                            Contact Information
                          </p>
                        </div>
                        <div className="text-gray-600">
                          {eventDetails.contact
                            .split(",")
                            .map((contactItem, index) => (
                              <span key={index} className="block">
                                - {contactItem.trim()}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                    {eventDetails.website && (
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Icon
                            icon="mdi:web"
                            className="text-xl md:text-2xl text-gray-600"
                          />
                          <p className="ml-2 font-medium text-gray-800">
                            Website
                          </p>
                        </div>
                        <a
                          href={eventDetails.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-2 hover:underline"
                        >
                          {eventDetails.website}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full h-fit pb-4 px-4 flex justify-end gap-12 items-center">
              <button
                onClick={handleInterestClick} 
                className="px-4 py-2 w-48 md:px-6 md:py-2 bg-palette-1 text-white rounded-lg font-medium hover:bg-[#974234] transition-colors"
              >
                Register Now
              </button>
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
    </>
  );
};