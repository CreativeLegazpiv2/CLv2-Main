"use client"; // This tells Next.js that this component is a client-side component

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { deleteCollectionItem } from "@/services/Collections/deleteCollection";
import { getSession } from "@/services/authservice";
import { jwtVerify } from "jose";
import { useRouter } from "next/navigation";
import useAuthRedirect from "@/services/hoc/auth";
import DeleteCollection from "./(collectionModal)/DeleteCollection";
import { toast, ToastContainer } from "react-toastify";
import { EditCollection } from "./(collectionModal)/EditCollection";
import { Interested } from "./(collectionModal)/Interested";
import { Icon } from "@iconify/react/dist/iconify.js";
import { SendHorizontal } from "lucide-react";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret";

interface CollectionProps {
  collection: {
    images: {
      created_at: Date;
      generatedId: string;
      image_path: string;
      title: string;
      desc: string;
      artist: string;
      year: number;
      childid: string;
    }[];
  };
}

interface UserDetails {
  first_name: string;
  profile_pic: string;
  // Add other user details properties here if needed
}

interface Subcomment {
  comment: string;
  userid: string;
  created_at: string;
  userDetails?: UserDetails; // Add userDetails property
}

const CollectionDisplay: React.FC<CollectionProps> = ({ collection }) => {
  const router = useRouter();
  const [images, setImages] = useState(collection.images);
  const [getID, setID] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(
    collection.images[0] || null
  );
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isInterestModalOpen, setInterestModalOpen] = useState(false);

  const [imageToDelete, setImageToDelete] = useState<{
    generatedId: string;
    image_path: string;
  } | null>(null);

  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [replyInput, setReplyInput] = useState<{ [key: string]: string }>({});
  const [showReplyInput, setShowReplyInput] = useState<{
    [key: string]: boolean;
  }>({});
  const [showMoreReplies, setShowMoreReplies] = useState<{
    [key: string]: boolean;
  }>({});

  const [chat, setChat] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [selectedImage]);

  const fetchComments = async () => {
    if (!selectedImage) return;

    try {
      const response = await fetch(`/api/collections/comment`, {
        method: "GET",
        headers: {
          x_galleryid: selectedImage.generatedId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const commentsWithSubcomments = await Promise.all(
          data.comments.map(async (comment: any) => {
            const subcommentsResponse = await fetch(
              `/api/collections/subcomment`,
              {
                method: "GET",
                headers: {
                  x_galleryid: selectedImage.generatedId,
                  x_commentid: comment.id,
                },
              }
            );

            if (subcommentsResponse.ok) {
              const subcommentsData = await subcommentsResponse.json();
              return { ...comment, subcomments: subcommentsData.comments };
            } else {
              return { ...comment, subcomments: [] };
            }
          })
        );

        // Extract first_name from userDetails for main comments
        const commentsWithUserDetails = commentsWithSubcomments.map(
          (comment: any) => {
            const userDetail = comment.userDetails || {};
            return {
              ...comment,
              first_name: userDetail.first_name || "Unknown",
              profile_pic: userDetail.profile_pic || "",
            };
          }
        );

        setComments(commentsWithUserDetails);
      } else {
        const data = await response.json();
        toast.error(`Failed to fetch comments: ${data.error}`, {
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to fetch comments.", { position: "bottom-right" });
    }
  };

  const handleReplyClick = (commentId: string) => {
    setShowReplyInput({
      ...showReplyInput,
      [commentId]: !showReplyInput[commentId],
    });
    setReplyInput({ ...replyInput, [commentId]: "" });
  };

  const handleReplySubmit = async (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    if (!replyInput[commentId]?.trim()) return;

    const token = getSession();
    if (!token) return;

    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );
      const userId = payload.id as string;
      const response = await fetch("/api/collections/subcomment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          x_galleryid: commentId,
          x_userid: userId,
          x_comment: replyInput[commentId],
          x_commentid: commentId, // Include the comment ID here
        },
      });

      if (response.ok) {
        fetchComments();
        toast.success("Reply added successfully!", {
          position: "bottom-right",
        });
        const newSubcomment = {
          comment: replyInput[commentId],
          userid: userId,
          created_at: new Date().toISOString(),
        };
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  subcomments: [...comment.subcomments, newSubcomment],
                }
              : comment
          )
        );
        setReplyInput({ ...replyInput, [commentId]: "" });
        setShowReplyInput({ ...showReplyInput, [commentId]: false });
        setShowMoreReplies({ ...showMoreReplies, [commentId]: true }); // Show all replies for this comment
      } else {
        const data = await response.json();
        toast.error(`Failed to add reply: ${data.error}`, {
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast.error("Failed to add reply.", { position: "bottom-right" });
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const token = getSession();
    if (!token) return;

    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );
      const userId = payload.id as string;
      const response = await fetch("/api/collections/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          x_galleryid: selectedImage?.generatedId || "",
          x_userid: userId,
          x_comment: commentInput,
        },
      });

      if (response.ok) {
        toast.success("Comment added successfully!", {
          position: "bottom-right",
        });
        setCommentInput("");
        fetchComments(); // Fetch updated comments after submission
      } else {
        const data = await response.json();
        toast.error(`Failed to add comment: ${data.error}`, {
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Failed to add comment.", { position: "bottom-right" });
    }
  };

  const handleImageClick = (image: typeof selectedImage) => {
    setSelectedImage(image);
  };

  useAuthRedirect(); // authguard

  useEffect(() => {
    if (collection.images.length > 0) {
      setImages(collection.images);
      setSelectedImage(collection.images[0]);
    }
  }, [collection.images]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getSession();
        if (!token) return;
        const { payload } = await jwtVerify(
          token,
          new TextEncoder().encode(JWT_SECRET)
        );
        const userId = payload.id as string;
        setID(userId);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchData();
  }, [collection.images]);

  const handleDelete = async () => {
    if (!imageToDelete) return;

    const token = getSession();
    if (!token) return;

    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );
      const userId = payload.id as string;
      await deleteCollectionItem(
        imageToDelete.generatedId,
        userId,
        imageToDelete.image_path
      );
      toast.success("Deleted successfully!", { position: "bottom-right" });

      const updatedImages = images.filter(
        (img) => img.generatedId !== imageToDelete.generatedId
      );
      setImages(updatedImages);

      if (selectedImage?.generatedId === imageToDelete.generatedId) {
        setSelectedImage(
          updatedImages.length > 0 ? updatedImages[0] : collection.images[0]
        );
      }

      if (updatedImages.length === 0) {
        router.push("/g-user");
      }

      // Close the modal after deletion
      setDeleteModalOpen(false);
      setImageToDelete(null);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleEdit = async (updatedData: {
    title: string;
    desc: string;
    year: number;
    image_path: string | null;
  }) => {
    if (!selectedImage) return;

    const token = getSession();
    if (!token) return;

    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );
      const userId = payload.id as string;

      toast.success("Collection updated successfully!", {
        position: "bottom-right",
      });

      // Ensure image_path is not null, provide a fallback value if needed
      const updatedImages = images.map((img) =>
        img.generatedId === selectedImage.generatedId
          ? {
              ...img,
              ...updatedData,
              image_path: updatedData.image_path || "/images/default.jpg", // Fallback value
            }
          : img
      );
      setImages(updatedImages);

      // Update the selected image with new values
      setSelectedImage({
        ...selectedImage,
        ...updatedData,
        image_path: updatedData.image_path || "/images/default.jpg", // Fallback value
      });

      // Close the modal after editing
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error editing the collection:", error);
      toast.error("Failed to update the collection.", {
        position: "bottom-right",
      });
    }
  };

  function formatTimeAgo(timestamp: string): string {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? "min" : "mins"} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hr" : "hrs"} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks} ${diffInWeeks === 1 ? "week" : "weeks"} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
  }

  function TimeAgo({ timestamp }: { timestamp: string }) {
    const [timeAgo, setTimeAgo] = useState(formatTimeAgo(timestamp));

    useEffect(() => {
      // Update the time immediately
      setTimeAgo(formatTimeAgo(timestamp));

      // Set up an interval to update every minute
      const intervalId = setInterval(() => {
        setTimeAgo(formatTimeAgo(timestamp));
      }, 60000); // 60000 ms = 1 minute

      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }, [timestamp]);

    return <>{timeAgo}</>;
  }

  return (
    <div className="bg-white min-h-screen relative lg:max-w-screen-xl w-full max-w-[95%] mx-auto">
      <Icon
        onClick={() => window.history.back()}
        className="absolute top-2 right-2 cursor-pointer z-20"
        icon="ion:arrow-back"
        width="35"
        height="35"
      />
      <div className="w-full h-full">
        {selectedImage && (
          <>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              {selectedImage.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 mb-8"
            >
              {selectedImage.desc}
            </motion.p>
          </>
        )}

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {images.map((image, index) => (
            <motion.div
              key={`${image.image_path}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`relative h-64 rounded-lg overflow-hidden shadow-lg cursor-pointer ${
                selectedImage?.generatedId === image.generatedId
                  ? "border-2 border-sky-500"
                  : ""
              }`}
              onClick={() => handleImageClick(image)}
            >
              <Image
                src={image.image_path}
                alt={`Image ${index + 1}`}
                fill
                priority // Add this prop if the image is above the fold
                className="transition-transform duration-300 hover:scale-105 object-cover"
              />
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  opacity: 1,
                }}
                transition={{ duration: 0.3 }}
                className="absolute md:flex hidden top-0 left-0 w-full h-full bg-black justify-center items-center gap-8"
              >
                {image.childid === getID && (
                  <>
                    <motion.button
                      initial={{ backgroundColor: "#FFD094", color: "#403737" }}
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "#403737",
                        color: "white",
                      }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="w-32 py-2 rounded-full"
                      onClick={() => {
                        setSelectedImage(image);
                        setEditModalOpen(true);
                      }}
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      initial={{ backgroundColor: "#FFD094", color: "#403737" }}
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "#403737",
                        color: "white",
                      }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="w-32 py-2 rounded-full"
                      onClick={() => {
                        setImageToDelete({
                          generatedId: image.generatedId,
                          image_path: image.image_path,
                        });
                        setDeleteModalOpen(true);
                      }}
                    >
                      Delete
                    </motion.button>
                  </>
                )}

                {/* Interested? for buyers and other artists */}
                {image.childid != getID && (
                  <>
                    <motion.button
                      initial={{ backgroundColor: "#FFD094", color: "#403737" }}
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "#403737",
                        color: "white",
                      }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="w-32 py-2 rounded-full"
                      onClick={() => {
                        setSelectedImage(image);
                        setInterestModalOpen(true);
                        setChat(false);
                      }}
                    >
                      Interested?
                    </motion.button>
                  </>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Collection Details */}

        {selectedImage && (
          <div className="bg-gray-100 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Collection Details
            </h2>
            <p className="text-gray-600">
              <strong>Artist:</strong> {selectedImage.artist}
            </p>
            <p className="text-gray-600">
              <strong>Year:</strong> {selectedImage.year}
            </p>
          </div>
        )}

        {/* Confirmation Modal for Deletion */}
        <AnimatePresence>
          {isDeleteModalOpen && (
            <motion.div
              className="fixed top-0 left-0 w-full h-full bg-black/50 z-[1000]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setDeleteModalOpen(false)}
            >
              {imageToDelete && (
                <DeleteCollection
                  isOpen={isDeleteModalOpen}
                  generatedId={imageToDelete.generatedId}
                  imagePath={imageToDelete.image_path}
                  userId={getID!}
                  onCancel={() => setDeleteModalOpen(false)}
                  onDelete={handleDelete}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      

        <div className="max-h-[32rem] min-h-40 w-full border border-gray-300 rounded-lg p-4 overflow-hidden">
          {/* Comment Section */}

          <div className="h-full flex flex-col max-h-[32rem] min-h-40">
            <h2 className="h-fit text-xl font-semibold text-gray-900 mb-4">
              Comments
            </h2>
            <div className="h-full w-full overflow-y-auto">
              {comments.map((comment, index) => {
                const subcommentsForComment: Subcomment[] =
                  comment.subcomments || [];
                const shouldShowMoreButton = subcommentsForComment.length > 1;
                const displayedSubcomments = showMoreReplies[comment.id]
                  ? subcommentsForComment
                  : subcommentsForComment.slice(0, 1);
                const additionalRepliesCount = subcommentsForComment.length - 1;

                return (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg h-full overflow-y-auto relative"
                  >
                    <div className="w-full flex gap-2.5 items-start justify-start">
                      <div className="w-10 h-10">
                        <Image
                          src={
                            comment.profile_pic ||
                            "/images/creative-directory/boy.png"
                          }
                          className="w-full h-full rounded-full bg-cover object-cover"
                          width={100}
                          height={100}
                          alt={`Comment ${index + 1}`}
                        />
                      </div>
                      <div className="w-full flex flex-col gap-1 justify-start items-start">
                        <div className="w-full flex flex-col gap-0.5 bg-gray-200 p-2.5 rounded-md">
                          <p className="text-base  text-gray-700 font-semibold">
                            {comment.first_name}
                          </p>
                          <p className="text-gray-600">{comment.comment}</p>
                        </div>
                        <div className="w-full flex justify-between">
                          <div className="flex gap-4">
                            <p className="text-gray-600 text-sm pl-2">
                              <TimeAgo timestamp={comment.created_at} />
                            </p>
                            <button
                              className="text-sm text-gray-400"
                              onClick={() => handleReplyClick(comment.id)}
                            >
                              Reply
                            </button>
                          </div>
                          {shouldShowMoreButton && (
                            <button
                              onClick={() =>
                                setShowMoreReplies({
                                  ...showMoreReplies,
                                  [comment.id]: !showMoreReplies[comment.id],
                                })
                              }
                              className="text-gray-400 text-sm"
                            >
                              {showMoreReplies[comment.id]
                                ? ""
                                : `View More ${additionalRepliesCount} Comments`}
                            </button>
                          )}
                        </div>
                        {showReplyInput[comment.id] && (
                          <form
                            onSubmit={(e) => handleReplySubmit(e, comment.id)}
                            className="mt-2 pl-4 w-full flex gap-2"
                          >
                            <div className="w-10 h-10">
                              <Image
                                src={
                                  comment.profile_pic ||
                                  "/images/creative-directory/boy.png"
                                }
                                className="w-full h-full rounded-full bg-cover object-cover"
                                width={100}
                                height={100}
                                alt={`Comment ${index + 1}`}
                              />
                            </div>
                            <input
                              type="text"
                              value={replyInput[comment.id] || ""}
                              onChange={(e) =>
                                setReplyInput({
                                  ...replyInput,
                                  [comment.id]: e.target.value,
                                })
                              }
                              className="border-[1.5px] border-gray-300 focus:outline-none focus:ring-[1.5px] px-4 rounded-full h-fit py-2 w-full"
                              placeholder={
                                "Add a reply as" + " " + comment.first_name
                              }
                            />
                            <button
                              type="submit"
                              className="mt-2 text-blue-500 p-2 rounded"
                            >
                              <SendHorizontal size={36} strokeWidth={1.75} />
                            </button>
                          </form>
                        )}
                      </div>
                    </div>

                    {/* subcomment */}
                    {displayedSubcomments.map(
                      (subcomment: Subcomment, subIndex: number) => (
                        <div
                          key={subIndex}
                          className=" p-2 rounded-lg ml-12 mt-2"
                        >
                          <div className="w-full flex gap-2.5 items-start justify-start">
                            <div className="w-10 h-10">
                              <Image
                                src={
                                  comment.profile_pic ||
                                  "/images/creative-directory/boy.png"
                                }
                                className="w-full h-full rounded-full bg-cover object-cover"
                                width={100}
                                height={100}
                                alt={`Comment ${index + 1}`}
                              />
                            </div>
                            <div className="w-full flex flex-col gap-1 justify-start items-start">
                              <div className="w-full flex flex-col gap-0.5 bg-gray-200 p-2.5 rounded-md">
                                <p className="text-base  text-gray-700 font-semibold">
                                  {subcomment.userDetails?.first_name}
                                </p>
                                <p className="text-gray-600">
                                  {subcomment.comment}
                                </p>
                              </div>
                              <div className="flex gap-4">
                                <p className="text-gray-600 text-sm pl-2">
                                  <TimeAgo timestamp={subcomment.created_at} />
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                    {shouldShowMoreButton && (
                      <button
                        onClick={() =>
                          setShowMoreReplies({
                            ...showMoreReplies,
                            [comment.id]: !showMoreReplies[comment.id],
                          })
                        }
                        className="text-gray-400 text-sm ml-[92%] whitespace-nowrap"
                      >
                        {showMoreReplies[comment.id] ? "View Less" : ""}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Comment */}
            <form
              onSubmit={handleCommentSubmit}
              className="bg-white flex gap-2 w-full p-4 mb-4 items-center"
            >
              {/* Add here the image of the current user logged in base on session */}
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="border-[1.5px] border-gray-300 py-2 rounded-full h-fit  px-4 w-full"
                placeholder="Add a comment..."
              />
              <button type="submit" className=" p-2 rounded">
                <SendHorizontal
                  className=" text-blue-500 text-xl"
                  size={36}
                  strokeWidth={2}
                />
              </button>
            </form>
          </div>
        </div>
      </div>
      {isInterestModalOpen && selectedImage && (
        <div className="fixed -bottom-2 -right-1 z-[500] p-4">
          <Interested
            childid={selectedImage.childid}
            created_at={selectedImage.created_at}
            artist={selectedImage.artist}
            image={selectedImage.image_path}
            title={selectedImage.title}
            desc={selectedImage.desc}
            year={selectedImage.year}
            onCancel={() => setInterestModalOpen(false)}
            chat={chat}
          />
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default CollectionDisplay;
