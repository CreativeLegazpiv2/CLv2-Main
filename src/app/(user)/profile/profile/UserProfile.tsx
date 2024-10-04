"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { Calendar } from "./Calendar";
import { Messages } from "./Messages";

interface UserDetail {
  location: string;
  contactNo: string;
  aboutMe: string;
  category: string;
}

interface ProfileButtonProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserProfile = () => {
  const [open, setOpen] = useState(false); // State to control Calendar and Messages

  return (
    <div className="min-h-dvh w-full text-primary-2">
      <div className="w-full xl:max-w-[65%] lg:max-w-[80%] max-w-[90%] lg:px-8 mx-auto h-fit py-[12dvh]">
        <div className="w-full h-full flex flex-col">
          <h1 className="uppercase font-semibold text-3xl lg:block hidden">
            Creative profile
          </h1>
          <div className="w-full h-full mt-28">
            <div className="w-full h-fit bg-primary-3 rounded-xl shadow-lg relative">
              <ProfileDetails />
              <OtherDetails />
              <ProfileButton open={open} setOpen={setOpen} />

              {/* Conditional rendering based on the open state */}
              {open ? <Messages /> : <Calendar />}

              {/* pedi na digdi magkaan na onclick edit */}
              <Icon className="absolute top-2 right-2 cursor-pointer" icon="material-symbols-light:edit-square-outline" width="35" height="35" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileDetails = () => {
  const userDetail = userDetails[0]; // Assuming there’s one user for now
  
  return (
    <div className="w-full md:max-w-[80%] mx-auto flex lg:flex-row flex-col justify-start lg:items-start items-center gap-8 lg:h-36 h-fit text-secondary-1">
      <div className=" -mt-20">
        <div className="w-48 h-48 bg-gray-400 rounded-full aspect-square"></div>
      </div>
      <div className="h-full w-full flex lg:flex-row flex-col lg:justify-start justify-center lg:gap-12 gap-4 items-center lg:mt-4 lg:pb-0 pb-4">
        {/* Dynamically setting the name here */}
        <h1 className="text-3xl font-bold">{userDetail.name}</h1>
        <div className="flex flex-row justify-row items-center gap-4">
          <Icon icon="circum:instagram" width="35" height="35" />
          <Icon icon="uit:facebook-f" width="35" height="35" />
          <Icon icon="fluent:mail-28-regular" width="35" height="35" />
        </div>
      </div>
    </div>
  );
};


const OtherDetails = () => {
  return (
    <div className="w-full h-fit py-12 bg-shade-8">
      <div className="w-full md:max-w-[80%] max-w-[90%] mx-auto flex flex-col gap-1.5">
        {userDetails.map((userDetail, index) => (
          <UserDetail key={index} userDetail={userDetail} />
        ))}
        <div className="pt-8 w-full flex justify-center items-center">
          <Button />
        </div>
      </div>
    </div>
  );
};

const UserDetail = ({ userDetail }: { userDetail: UserDetail }) => {
  return (
    <>
      <small className="font-bold text-primary-2 opacity-80 capitalize">
        Location
      </small>
      <p className="text-primary-2 font-bold">{userDetail.location}</p>
      <small className="font-bold text-primary-2 opacity-80 capitalize">
        Contact number
      </small>
      <p className="text-primary-2 font-bold">{userDetail.contactNo}</p>
      <small className="font-bold text-primary-2 opacity-80 capitalize">
        About me
      </small>
      <p className="text-primary-2 font-bold">{userDetail.aboutMe}</p>
      <small className="font-bold text-primary-2 opacity-80 capitalize">
        category
      </small>
      <p className="text-primary-2 font-bold">{userDetail.category}</p>
    </>
  );
};

const Button = () => {
  return (
    <motion.button
      className="bg-shade-1 text-secondary-1 uppercase py-3 w-full md:max-w-xs text-xl rounded-lg font-semibold"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      add you work
    </motion.button>
  );
};

const ProfileButton = ({ open, setOpen }: ProfileButtonProps) => {
  return (
    <div className="w-full h-fit flex bg-shade-8">
      <button
        onClick={() => setOpen(false)} // Set open to false to show Calendar
        className={`w-full py-4 font-bold text-lg uppercase flex justify-center items-center gap-2 ${
          !open ? "bg-shade-1" : "bg-shade-8"
        } rounded-tr-lg overflow-hidden`}
      >
        <Icon icon="ph:calendar-dots-thin" width="35" height="35" />
        Schedule
      </button>
      <button
        onClick={() => setOpen(true)} // Set open to true to show Messages
        className={`w-full py-4 font-bold text-lg uppercase flex justify-center items-center gap-2 ${
          open ? "bg-shade-1" : "bg-shade-8"
        } rounded-tl-lg`}
      >
        <Icon icon="arcticons:mail" width="35" height="35" />
        Messages
      </button>
    </div>
  );
};

const userDetails = [
  {
    name: "SEAN PALACAY",
    age: 23, //dapat i store su bday tapos calculate nalang para makuwa su age
    location: "Tabaco City, Albay ",
    contactNo: "+639123456789",
    aboutMe:
      "Am from Legazpi City a Bikolano Visual Artist,born on September 21,1958 years old now ,a widow with 2 kids I lost my wife last November 7 2019 presently residing at #365 Purple 5 Gogon Legazpi City they fondly called me BENNY as AKA...I belong to Artist Group BROTSA.",
    category: "Visual Arts ",
  },
];
