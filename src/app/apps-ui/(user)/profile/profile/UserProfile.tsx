"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Calendar } from "./Calendar";
import { Messages } from "./Messages";
import { jwtVerify } from "jose";
import { logoutUser, getSession } from "@/services/authservice";
import { useRouter } from "next/navigation";
import { ProfileModal } from "./(modals)/ProfileModal";
import Image from "next/image";
import Link from "next/link";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret";

export interface UserDetail {
  id: string; // Assuming there's an id for user identification
  first_name: string;
  bday?: string;
  email?: string;
  creative_field: string;
  address: string;
  mobileNo: string;
  bio?: string;
  instagram: string;
  facebook: string;
  twitter: string;
  portfolioLink: string;
  profile_pic?: string;
  role: string;
}

interface UserProfileProps {
  userDetail: UserDetail; // Expecting the userDetail as a prop
}

interface ProfileButtonProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userDetail }) => {
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
              <ProfileDetails userDetail={userDetail} />
              <OtherDetails userDetail={userDetail} />
              <ProfileButton open={open} setOpen={setOpen} />

              {/* Conditional rendering based on the open state */}
              {open ? <Messages /> : <Calendar />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileDetails: React.FC<{ userDetail: UserDetail }> = ({
  userDetail,
}) => {
  return (
    <div className="w-full md:max-w-[80%] mx-auto flex lg:flex-row flex-col justify-start lg:items-start items-center gap-8 lg:h-36 h-fit text-secondary-1">
      <div className="-mt-20">
        <div className="w-48 h-48 bg-gray-400 rounded-full overflow-hidden relative">
          <img
            src={userDetail.profile_pic || "/images/creative-directory/boy.png"}
            alt={`Image of ${userDetail.first_name}`}
            className="w-full h-full object-cover rounded-full" // Ensure it fills the container and keeps the rounded shape
          />
        </div>
      </div>
      <div className="h-full w-full flex lg:flex-row flex-col lg:justify-start justify-center lg:gap-12 gap-4 items-center lg:mt-4 lg:pb-0 pb-4">
        <h1 className="text-3xl font-bold">{userDetail.first_name},</h1>
        <div className="flex flex-row justify-row items-center gap-4">
          <a href={userDetail.instagram} target="_blank" rel="noopener noreferrer">
            <Icon icon="circum:instagram" width="35" height="35" />
          </a>
          <a href={userDetail.facebook} target="_blank" rel="noopener noreferrer">
            <Icon icon="uit:facebook-f" width="35" height="35" />
          </a>
          <a href={userDetail.twitter} target="_blank" rel="noopener noreferrer">
            <Icon icon="fluent:mail-28-regular" width="35" height="35" />
          </a>
        </div>
      </div>
    </div>
  );
};

const OtherDetails: React.FC<{ userDetail: UserDetail }> = ({ userDetail }) => {
  const [isRole, setRole] = useState<string | null>(null);
  useEffect(() => {
    setRole(userDetail.role); // Update role state when userDetail changes
    localStorage.setItem("role", userDetail.role);
  }, [userDetail]);
  return (
    <div className="w-full h-fit py-12 bg-shade-8">
      <div className="w-full md:max-w-[80%] max-w-[90%] mx-auto flex flex-col gap-1.5">
        <UserDetailDisplay userDetail={userDetail} />{" "}
        {/* Use the updated component */}
        <div className="pt-8 w-full flex justify-center items-center">
          {isRole != 'buyer' && (

            <Button />
          )}
        </div>
      </div>
    </div>
  );
};

const UserDetailDisplay = ({ userDetail }: { userDetail: UserDetail }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserDetail>(userDetail);
  const [role, setRole] = useState<string | null>(null); // State for role

  // Update form data when userDetail changes

  useEffect(() => {
    if (formData.first_name) {
      localStorage.setItem("Fname", formData.first_name);
    }
  }, [formData.first_name]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const token = getSession();

    // Check if the token exists
    if (!token) {
      console.error("No token found, user may not be logged in.");
      return; // Optionally handle unauthorized state here
    }
    try {
      // Verify the token and handle it appropriately
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );

      // Log the payload for debugging
      console.log("Retrieved token payload:", payload.id);
      const userId = payload.id as string;
      const response = await fetch("/api/creatives", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userId}`, // Pass the token in the Authorization headeruserId,
        },
        body: JSON.stringify({
          detailsid: payload.id,
          userDetails: formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Get the error message
        console.error("Error response:", errorData);
        throw new Error(errorData.message);
      }

      // Handle success
      console.log("User details updated successfully");
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const [openModal, setOpenModal] = useState<boolean>(false);

  const openProfileModal = () => {
    setOpenModal(true);
  };

  const closeProfileModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      {isEditing ? (
        <div className="text-primary-2">
          {/* Input fields for editing user details */}
          <div>
            <small className="font-bold opacity-80 capitalize">Location</small>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="font-bold"
            />
          </div>
          <div>
            <small className="font-bold opacity-80 capitalize">
              Contact Number
            </small>
            <input
              type="text"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleInputChange}
              className="font-bold"
            />
          </div>
          <div>
            <small className="font-bold opacity-80 capitalize">About me</small>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="font-bold"
            />
          </div>

          <div>
            {formData.role != 'buyer' && (
              <><small className="font-bold opacity-80 capitalize">
                Creative Field
              </small><input
                  type="text"
                  name="creative_field"
                  value={formData.creative_field}
                  onChange={handleInputChange}
                  className="font-bold" /></>
            )}

          </div>
          <button
            onClick={handleSave}
            className="bg-shade-1 text-secondary-1 uppercase py-2 px-4 rounded-lg font-semibold"
          >
            Save Changes
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="ml-2 bg-red-500 text-white py-2 px-4 rounded-lg font-semibold"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="text-primary-2">
          {/* Display user details */}
          <small className="font-bold opacity-80 capitalize">Location</small>
          <p className="font-bold">{formData.address}</p>
          <small className="font-bold opacity-80 capitalize">
            Contact Number
          </small>
          <p className="font-bold">{formData.mobileNo}</p>
          <small className="font-bold opacity-80 capitalize">About me</small>
          <p className="font-bold">{formData.bio}</p>

          {formData.role != 'buyer' && (
            <div>
              <small className="font-bold opacity-80 capitalize">Creative Field</small>
              <p className="font-bold">{formData.creative_field}</p>
            </div>
          )}

          {/* Edith */}
          <Icon
            className="absolute top-2 right-2 cursor-pointer"
            icon="material-symbols-light:edit-square-outline"
            width="35"
            height="35"
            onClick={openProfileModal}
          />

          {/* Pass formData to ProfileModal */}
          {openModal && (
            <ProfileModal
              openModal={openModal}
              setOpenModal={closeProfileModal}
              formData={formData} // Passing formData as prop
              setFormData={setFormData} // Passing setFormData to update in modal
            />
          )}
        </div>
      )}
    </>
  );
};

const Button = () => {
  return (
    <Link className="w-full flex justify-center items-center" href={"/apps-ui/g-user/publish"}>
      <motion.button
        className="bg-shade-1 text-secondary-1 uppercase py-3 w-full md:max-w-xs text-xl rounded-lg font-semibold"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Add Your Work
      </motion.button>
    </Link>
  );
};

const ProfileButton: React.FC<ProfileButtonProps> = ({ open, setOpen }) => {
  return (
    <div className="w-full h-fit flex bg-shade-8">
      <button
        onClick={() => setOpen(false)}
        className={`w-full py-4 font-bold text-lg uppercase flex justify-center items-center gap-2 ${!open ? "bg-shade-1" : "bg-shade-8"
          } rounded-tr-lg overflow-hidden`}
      >
        <Icon icon="ph:calendar-dots-thin" width="35" height="35" />
        Schedule
      </button>
      <button
        onClick={() => setOpen(true)}
        className={`w-full py-4 font-bold text-lg uppercase flex justify-center items-center gap-2 ${open ? "bg-shade-1" : "bg-shade-8"
          } rounded-tl-lg overflow-hidden`}
      >
        <Icon icon="ph:message-circle-dots" width="35" height="35" />
        Messages
      </button>
    </div>
  );
};