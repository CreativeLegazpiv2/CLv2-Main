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
import { dummyData } from "../../gallery-display/g-user-components/FeaturedGallery";

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
      <div className="w-full md:min-h-[80dvh] md:max-h-[80dvh] h-dvh relative">
        <img src={"images/creative-profile/cover.png"} className="w-full h-full object-cover absolute top-0 left-0" alt="" />
        <div className="absolute w-full h-full flex z-10 border border-black bg-gradient-to-r from-palette-5 from-0% via-palette-5 md:via-15% via-25% to-transparent md:to-60% to-70%">
          <div className="w-full h-full md:pt-0 pt-[10dvh] max-w-[80%] mx-auto relative flex flex-col gap-4 justify-center items-start">
            <h1 className="md:text-5xl text-4xl font-bold uppercase text-palette-2">ainah mari saba</h1>
            <span className="italic text-palette-2 md:text-2xl text-xl font-bold">Visual Arts</span>
            <button className="bg-palette-6 py-2 px-4 w-32 text-palette-5 rounded-full tracking-wider uppercase mt-2">edit</button>
            <div className="flex flex-col max-h-[29rem] md:absolute -bottom-[40%] left-0"> 
              <img src={"images/creative-profile/image.png"} className="w-full h-full md:max-w-[22rem] md:min-w-[24rem] md:max-h-[29rem] " alt="" />
              <h1 className="text-2xl font-bold uppercase text-palette-7 pt-6 md:block hidden">ainah mari saba</h1>
              <h2 className="text-palette-7 font-thin md:pt-0 pt-6">Num of Works</h2> 
            </div>
          </div>
        </div>
      </div>

      {/* second details */}
      <div className="w-full h-full min-h-[70dvh] flex relative justify-center items-center">
        <div className="md:max-w-[50%] max-w-[90%] mx-auto w-full h-full flex flex-col gap-2 justify-center items-start md:absolute right-0">
          <span className="flex gap-4 flex-row items-center">Date Joined: February 15, 2024 <hr className="w-16" /></span>
          <h1 className="text-4xl font-bolder">Introductory Title</h1>
          <div className="flex items-center gap-2 py-6">
            <Icon icon="arcticons:facebook" className="cursor-pointer text-palette-2" width="48" height="48" />
            <Icon icon="arcticons:twitter-alt-1" className="cursor-pointer text-palette-2" width="48" height="48" />
            <Icon icon="arcticons:instagram" className="cursor-pointer text-palette-2" width="48" height="48" />
          </div>
          <div className="pb-4">
            <p className="font-thin w-full max-w-2xl">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero amet, vero velit quaerat nam, sequi debitis ut praesentium mollitia,
              dolores dolorum eaque numquam accusantium fugit alias tempora. Eius, et commodi.
            </p>
          </div>
          <div className="pt-4">
            <h1 className="font-bolder capitalize">Address and Contact Number</h1>
            <p className="font-thin">Contact no. and Address here</p>
          </div>
          <div className="pt-4">
            <h1 className="font-bolder capitalize">Address and Contact Number</h1>
            <p className="font-thin">Contact no. and Address here</p>
          </div>
        </div>
      </div>

      {/* featured latest collection */}
      <div className="md:h-dvh h-fit  w-full  bg-palette-3">
        <div className="w-full h-full flex md:flex-row flex-col">
          <div className="w-full h-full text-palette-5 md:py-0 py-[5dvh]">
            <div className="w-full h-full md:max-w-[70%] max-w-[90%] mx-auto flex flex-col items-start justify-center">
              <h1 className="uppercase title font-thin text-3xl">featured work</h1>
              {/* title here */}
              <h2 className="uppercase font-bolder text-5xl">Flowers</h2>
              <span className="italic font-bold text-xl py-4">year here</span>
              <p className="text-xl w-full max-w-xl font-thin">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequatur, voluptatum perferendis in voluptas hic cupiditate
                rem provident illum nihil nesciunt asperiores aspernatur optio dignissimos quidem at non ex repellendus veritatis.
              </p>
            </div>
          </div>
          <div className="w-full h-full">
            <img src={"images/creative-profile/cover.png"} className="w-full h-full object-cover" alt="" />
          </div>
        </div>
      </div>

      {/* Collection */}
      <section className="sm:px-6 lg:px-8 min-h-screen pt-20">
        <div className="w-full max-w-[95%] mx-auto flex flex-col gap-6 p-4">
          <h1 className="text-3xl font-bold text-palette-1 uppercase">Gallery</h1>
          <div className="columns-1 sm:columns-2 md:columns- lg:columns-4 gap-4">
            {dummyData.map((item) => (
              <div key={item.id} className="mb-4 break-inside-avoid">
                <div className="bg-palette-6/20 rounded-3xl p-4 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={"/images/creative-directory/profile.jpg"}  // item.profile_pic ||
                      alt={`${item.artist}'s profile`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-palette-7">
                        {item.artist}
                      </h4>
                      <span className="text-palette-1 text-sm font-bold">
                        {item.creative_field || "Creative Field"}
                      </span>
                    </div>
                  </div>
                  <div
                    // onClick={() =>
                    //   (window.location.href = `/gallery-display/collections/${item.slug}`)
                    // }
                    className="w-full relative cursor-pointer rounded-3xl overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition-opacity duration-300 ease-in-out z-10"></div>
                    <div className="max-h-[32rem] overflow-hidden">
                      <img
                        src={item.image_path}
                        alt={item.title}
                        className="w-full h-fit object-fill"
                        style={{
                          maxHeight: "32rem",
                          width: "100%",
                          objectFit: "fill",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>

          {/* Show More Button */}
          {/* {visibleItems < featuredItems.length && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleShowMore}
                    className="px-6 py-2 bg-palette-7 text-white rounded-lg hover:bg-palette-6 transition-colors"
                  >
                    Show More
                  </button>
                </div>
              )} */}
        </div>
      </section>
      {/* <div className="w-full xl:max-w-[65%] lg:max-w-[80%] max-w-[90%] lg:px-8 mx-auto h-fit py-[12dvh]">
        <div className="w-full h-full flex flex-col">
          
          <div className="w-full h-full mt-28">
            <div className="w-full h-fit bg-primary-3 rounded-xl shadow-lg relative">
              <ProfileDetails userDetail={userDetail} />
              <OtherDetails userDetail={userDetail} />
              <ProfileButton open={open} setOpen={setOpen} />
              {open ? <Messages /> : <Calendar />}
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

// const ProfileDetails: React.FC<{ userDetail: UserDetail }> = ({
//   userDetail,
// }) => {
//   return (
//     <div className="w-full md:max-w-[80%] mx-auto flex lg:flex-row flex-col justify-start lg:items-start items-center gap-8 lg:h-36 h-fit text-secondary-1">
//       <div className="-mt-20">
//         <div className="w-48 h-48 bg-gray-400 rounded-full border-2 border-gray-400 overflow-hidden relative">
//           <img
//             src={userDetail.profile_pic || "/images/creative-directory/profile.jpg"}
//             alt={`Image of ${userDetail.first_name}`}
//             className="w-full h-full object-cover rounded-full" // Ensure it fills the container and keeps the rounded shape
//           />
//         </div>
//       </div>
//       <div className="h-full w-full flex lg:flex-row flex-col lg:justify-start justify-center lg:gap-12 gap-4 items-center lg:mt-4 lg:pb-0 pb-4">
//         <h1 className="text-3xl font-bold">{userDetail.first_name},</h1>
//         <div className="flex flex-row justify-row items-center gap-4">
//           <a href={userDetail.instagram} target="_blank" rel="noopener noreferrer">
//             <Icon icon="circum:instagram" width="35" height="35" />
//           </a>
//           <a href={userDetail.facebook} target="_blank" rel="noopener noreferrer">
//             <Icon icon="uit:facebook-f" width="35" height="35" />
//           </a>
//           <a href={userDetail.twitter} target="_blank" rel="noopener noreferrer">
//             <Icon icon="fluent:mail-28-regular" width="35" height="35" />
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// const OtherDetails: React.FC<{ userDetail: UserDetail }> = ({ userDetail }) => {
//   const [isRole, setRole] = useState<string | null>(null);
//   useEffect(() => {
//     setRole(userDetail.role); // Update role state when userDetail changes
//     localStorage.setItem("role", userDetail.role);
//   }, [userDetail]);
//   return (
//     <div className="w-full h-fit py-12 bg-shade-8">
//       <div className="w-full md:max-w-[80%] max-w-[90%] mx-auto flex flex-col gap-1.5">
//         <UserDetailDisplay userDetail={userDetail} />{" "}
//         {/* Use the updated component */}
//         <div className="pt-8 w-full flex justify-center items-center">
//           {isRole != 'buyer' && (

//             <Button />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const UserDetailDisplay = ({ userDetail }: { userDetail: UserDetail }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState<UserDetail>(userDetail);
//   const [role, setRole] = useState<string | null>(null); // State for role

//   // Update form data when userDetail changes

//   useEffect(() => {
//     if (formData.first_name) {
//       localStorage.setItem("Fname", formData.first_name);
//     }
//   }, [formData.first_name]);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSave = async () => {
//     const token = getSession();

//     // Check if the token exists
//     if (!token) {
//       console.error("No token found, user may not be logged in.");
//       return; // Optionally handle unauthorized state here
//     }
//     try {
//       // Verify the token and handle it appropriately
//       const { payload } = await jwtVerify(
//         token,
//         new TextEncoder().encode(JWT_SECRET)
//       );

//       // Log the payload for debugging
//       console.log("Retrieved token payload:", payload.id);
//       const userId = payload.id as string;
//       const response = await fetch("/api/creatives", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${userId}`, // Pass the token in the Authorization headeruserId,
//         },
//         body: JSON.stringify({
//           detailsid: payload.id,
//           userDetails: formData,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json(); // Get the error message
//         console.error("Error response:", errorData);
//         throw new Error(errorData.message);
//       }

//       // Handle success
//       console.log("User details updated successfully");
//       setIsEditing(false); // Exit edit mode
//     } catch (error) {
//       console.error("Error updating user details:", error);
//     }
//   };

//   const [openModal, setOpenModal] = useState<boolean>(false);

//   const openProfileModal = () => {
//     setOpenModal(true);
//   };

//   const closeProfileModal = () => {
//     setOpenModal(false);
//   };

//   return (
//     <>
//       {isEditing ? (
//         <div className="text-primary-2">
//           {/* Input fields for editing user details */}
//           <div>
//             <small className="font-bold opacity-80 capitalize">Location</small>
//             <input
//               type="text"
//               name="address"
//               value={formData.address}
//               onChange={handleInputChange}
//               className="font-bold"
//             />
//           </div>
//           <div>
//             <small className="font-bold opacity-80 capitalize">
//               Contact Number
//             </small>
//             <input
//               type="text"
//               name="mobileNo"
//               value={formData.mobileNo}
//               onChange={handleInputChange}
//               className="font-bold"
//             />
//           </div>
//           <div>
//             <small className="font-bold opacity-80 capitalize">About me</small>
//             <textarea
//               name="bio"
//               value={formData.bio}
//               onChange={handleInputChange}
//               className="font-bold"
//             />
//           </div>

//           <div>
//             {formData.role != 'buyer' && (
//               <><small className="font-bold opacity-80 capitalize">
//                 Creative Field
//               </small><input
//                   type="text"
//                   name="creative_field"
//                   value={formData.creative_field}
//                   onChange={handleInputChange}
//                   className="font-bold" /></>
//             )}

//           </div>
//           <button
//             onClick={handleSave}
//             className="bg-shade-1 text-secondary-1 uppercase py-2 px-4 rounded-lg font-semibold"
//           >
//             Save Changes
//           </button>
//           <button
//             onClick={() => setIsEditing(false)}
//             className="ml-2 bg-red-500 text-white py-2 px-4 rounded-lg font-semibold"
//           >
//             Cancel
//           </button>
//         </div>
//       ) : (
//         <div className="text-primary-2">
//           {/* Display user details */}
//           <small className="font-bold opacity-80 capitalize">Location</small>
//           <p className="font-bold">{formData.address}</p>
//           <small className="font-bold opacity-80 capitalize">
//             Contact Number
//           </small>
//           <p className="font-bold">{formData.mobileNo}</p>
//           <small className="font-bold opacity-80 capitalize">About me</small>
//           <p className="font-bold">{formData.bio}</p>

//           {formData.role != 'buyer' && (
//             <div>
//               <small className="font-bold opacity-80 capitalize">Creative Field</small>
//               <p className="font-bold">{formData.creative_field}</p>
//             </div>
//           )}

//           {/* Edith */}
//           <Icon
//             className="absolute top-2 right-2 cursor-pointer"
//             icon="material-symbols-light:edit-square-outline"
//             width="35"
//             height="35"
//             onClick={openProfileModal}
//           />

//           {/* Pass formData to ProfileModal */}
//           {openModal && (
//             <ProfileModal
//               openModal={openModal}
//               setOpenModal={closeProfileModal}
//               formData={formData} // Passing formData as prop
//               setFormData={setFormData} // Passing setFormData to update in modal
//             />
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// const Button = () => {
//   return (
//     <Link className="w-full flex justify-center items-center" href={"/gallery-display/publish"}>
//       <motion.button
//         className="bg-shade-1 text-secondary-1 uppercase py-3 w-full md:max-w-xs text-xl rounded-lg font-semibold"
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//       >
//         Add Your Work
//       </motion.button>
//     </Link>
//   );
// };

// const ProfileButton: React.FC<ProfileButtonProps> = ({ open, setOpen }) => {
//   return (
//     <div className="w-full h-fit flex bg-shade-8">
//       <button
//         onClick={() => setOpen(false)}
//         className={`w-full py-4 font-bold text-lg uppercase flex justify-center items-center gap-2 ${!open ? "bg-shade-1" : "bg-shade-8"
//           } rounded-tr-lg overflow-hidden`}
//       >
//         <Icon icon="ph:calendar-dots-thin" width="35" height="35" />
//         Schedule
//       </button>
//     </div>
//   );
// };