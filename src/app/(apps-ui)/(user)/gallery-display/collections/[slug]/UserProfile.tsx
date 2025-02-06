"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { dummyData } from "../../g-user-components/FeaturedGallery";
import Link from "next/link";

export interface UserDetail {
    detailsid: string;
    first_name: string;
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

interface CollectionItem {
    created_at: Date;
    generatedId: string;
    path: string;
    title: string;
    desc: string;
    artist: string;
    year: number;
    childid: string;
}

interface UserProfileProps {
    initialUserDetail: UserDetail;
    collection: CollectionItem[];
}

export const UserProfile: React.FC<UserProfileProps> = ({ initialUserDetail, collection }) => {
    return (
        <div className="min-h-dvh w-full text-primary-2">
            {/* User Profile Section */}
            <div className="w-full md:min-h-[80dvh] md:max-h-[80dvh] h-dvh relative">
                <img src={"/images/creative-profile/cover.png"} className="w-full h-full object-cover absolute top-0 left-0" alt="" />
                <div className="absolute w-full h-full flex z-10 bg-gradient-to-r from-palette-5 from-0% via-palette-5 md:via-15% via-25% to-transparent md:to-60% to-70%">
                    <div className="w-full h-fit pt-[20dvh] max-w-[80%] mx-auto relative flex flex-col gap-12 justify-center items-start">
                        <div className="flex flex-col gap-2">
                            <h1 className="md:text-5xl text-4xl font-bold uppercase text-palette-2">{initialUserDetail.first_name}</h1>
                            <span className="italic text-palette-2 md:text-2xl text-xl font-bold">{initialUserDetail.creative_field}</span>
                            <button className="bg-palette-6 py-2 px-4 w-32 text-palette-5 rounded-full tracking-wider uppercase mt-2">Edit</button>
                        </div>
                        <div className="flex flex-col h-full left-0 ">
                            <img src={initialUserDetail.profile_pic || "images/creative-profile/image.png"} className="w-full h-full rounded-xl md:max-w-[22rem] md:min-w-[22rem] md:max-h-[32rem] min-h-[32rem] object-cover" alt="" />
                            {/* <h1 className="text-2xl font-bold uppercase text-palette-7 pt-6 md:block hidden">{initialUserDetail.first_name}</h1>
                            <h2 className="text-palette-7 font-thin md:pt-0 pt-6">Num of Works</h2> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Second Section */}
            <div className="w-full h-full min-h-[70dvh] flex relative justify-center items-center">
                <div className="md:max-w-[50%] max-w-[90%] mx-auto w-full h-full flex flex-col gap-2 justify-center items-start md:absolute right-0">
                    <span className="flex gap-4 flex-row items-center">Date Joined: February 15, 2024 <hr className="w-16" /></span>
                    <h1 className="text-4xl font-bolder">Introductory Title</h1>
                    <div className="flex items-center gap-2 py-6">
                        <Link href={initialUserDetail.facebook} target="_blank" rel="noopener noreferrer"><Icon icon="arcticons:facebook" className="cursor-pointer text-palette-2" width="48" height="48" /></Link>
                        <Link href={initialUserDetail.twitter} target="_blank" rel="noopener noreferrer"><Icon icon="arcticons:twitter-alt-1" className="cursor-pointer text-palette-2" width="48" height="48" /></Link>
                        <Link href={initialUserDetail.instagram} target="_blank" rel="noopener noreferrer"><Icon icon="arcticons:instagram" className="cursor-pointer text-palette-2" width="48" height="48" /></Link>
                    </div>
                    <div className="pb-4">
                        <p className="font-thin w-full max-w-2xl">{initialUserDetail.bio}</p>
                    </div>
                    <div className="pt-4">
                        <h1 className="font-bolder capitalize">Address and Contact Number</h1>
                        <p className="font-thin">{initialUserDetail.address}, CN# {initialUserDetail.mobileNo}</p>
                    </div>
                </div>
            </div>

            {/* featured latest collection */}
            <div className="md:h-dvh h-fit  w-full  bg-palette-3">
                {collection.map((item) => (
                    <div key={item.generatedId} className="w-full h-full flex md:flex-row flex-col">
                        <div className="w-full h-full text-palette-5 md:py-0 py-[5dvh]">
                            <div className="w-full h-full md:max-w-[70%] max-w-[90%] mx-auto flex flex-col items-start justify-center">
                                <h1 className="uppercase title font-thin text-3xl">featured work</h1>
                                {/* title here */}
                                <h2 className="uppercase font-bolder text-5xl">{item.title}</h2>
                                <span className="italic font-bold text-xl py-4">{item.year}</span>
                                <p className="text-xl w-full max-w-xl font-thin">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                        <div className="w-full h-full relative">
                            {/* Background image (blurred) */}
                            <img
                                src={item.path || "/images/creative-profile/cover.png"}
                                className="w-full h-full object-cover absolute"
                                alt=""
                            />
                            <div className="w-full h-full absolute top-0 left-0 z-10 backdrop-blur-lg"></div>

                            {/* Foreground image (contained with shadow) */}
                            <div className="p-12 absolute inset-0 z-20 flex items-center justify-center">
                                <img
                                    src={item.path || "/images/creative-profile/cover.png"}
                                    className="max-w-full max-h-full object-contain shadow-lg rounded-xl"
                                    alt=""
                                />
                            </div>
                        </div>

                    </div>
                ))}

            </div>

            {/* Collection */}
            {/* <section className="sm:px-6 lg:px-8 min-h-screen pt-20">
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
                                                src={"/" + item.image_path}
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
                </div>
            </section> */}
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