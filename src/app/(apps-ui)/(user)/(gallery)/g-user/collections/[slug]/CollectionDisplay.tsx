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
import Link from "next/link";
import CommentSkeleton from "@/components/Skeletal/commentSkeleton";
import SubcommentSkeleton from "@/components/Skeletal/subcommentSkeleton";
import { ViewCollection } from "./(collectionModal)/viewCollection";

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
  detailsid: string;
  first_name: string;
  profile_pic: string;
}

interface Subcomment {
  comment: string;
  userid: string;
  created_at: string;
  userDetails?: UserDetails;
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
  const [liked, setLike] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [replyInput, setReplyInput] = useState<{ [key: string]: string }>({});
  const [showReplyInput, setShowReplyInput] = useState<{
    [key: string]: boolean;
  }>({});
  const [showMoreReplies, setShowMoreReplies] = useState<{
    [key: string]: boolean;
  }>({});
  const [replyLoading, setReplyLoading] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [chat, setChat] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isViewModalOpen, setViewModalOpen] = useState(false);

  // Redirect to /g-user if images array becomes empty
  useEffect(() => {
    if (images.length === 0) {
      toast.info("No images found. Redirecting...", { position: "bottom-right" });
      setTimeout(() => {
        router.push("/g-user");
      }, 2000); // Redirect after 2 seconds
    }
  }, [images, router]);

  useEffect(() => {
    fetchComments();
  }, [selectedImage]);

  useEffect(() => {
    setIsLoadingComments(true);
  }, []);

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

        const commentsWithUserDetails = commentsWithSubcomments.map(
          (comment: any) => {
            const userDetail = comment.userDetails || {};
            return {
              ...comment,
              first_name: userDetail.first_name || "Unknown",
              profile_pic: userDetail.profile_pic || "",
              detailsid: userDetail.detailsid || "",
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
    } finally {
      setIsLoadingComments(false);
    }
  };

  const formatLikeCount = (count: number): any => {
    if (count < 1000) return count.toString();
    if (count < 1000000) {
      return (count / 1000).toFixed(1) + "k";
    }
    return (count / 1000000).toFixed(1) + "M";
  };

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!selectedImage?.generatedId || !getID) return;

      try {
        const response = await fetch(`/api/collections/like-collections`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            galleryId: selectedImage.generatedId,
            fetchOnly: true,
            userId: getID,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setLike(data.userLiked?.includes(getID) ?? false);
          setLikeCount(formatLikeCount(data.likeCount || 0));
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error(
            "Failed to fetch like status:",
            errorData.error || "Unknown error"
          );
        }
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    fetchLikeStatus();
  }, [selectedImage?.generatedId, getID, likeCount]);

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

      setReplyLoading({ ...replyLoading, [commentId]: true });

      const response = await fetch("/api/collections/subcomment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          x_galleryid: commentId,
          x_userid: userId,
          x_comment: replyInput[commentId],
          x_commentid: commentId,
        },
      });

      if (response.ok) {
        setReplyInput({ ...replyInput, [commentId]: "" });
        setShowReplyInput({ ...showReplyInput, [commentId]: false });
        setShowMoreReplies({ ...showMoreReplies, [commentId]: true });
        fetchComments();
      } else {
        const data = await response.json();
        toast.error(`Failed to add reply: ${data.error}`, {
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast.error("Failed to add reply.", { position: "bottom-right" });
    } finally {
      setTimeout(() => {
        setReplyLoading({ ...replyLoading, [commentId]: false });
      }, 2000);
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
        setCommentInput("");
        fetchComments();
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
    setViewModalOpen(true);
  };

  useAuthRedirect();

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

      const updatedImages = images.map((img) =>
        img.generatedId === selectedImage.generatedId
          ? {
            ...img,
            ...updatedData,
            image_path: updatedData.image_path || "/images/default.jpg",
          }
          : img
      );
      setImages(updatedImages);

      setSelectedImage({
        ...selectedImage,
        ...updatedData,
        image_path: updatedData.image_path || "/images/default.jpg",
      });

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
      setTimeAgo(formatTimeAgo(timestamp));
      const intervalId = setInterval(() => {
        setTimeAgo(formatTimeAgo(timestamp));
      }, 60000);
      return () => clearInterval(intervalId);
    }, [timestamp]);

    return <>{timeAgo}</>;
  }

  const toggleLike = async () => {
    if (!selectedImage || !getID) return;

    try {
      const toggleResponse = await fetch(`/api/collections/like-collections`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: getID,
          galleryId: selectedImage.generatedId,
          fetchOnly: false,
        }),
      });

      if (!toggleResponse.ok) {
        const errorData = await toggleResponse.json();
        toast.error(`Failed to toggle like: ${errorData.error}`, {
          position: "bottom-right",
        });
        return;
      }

      const fetchResponse = await fetch(`/api/collections/like-collections`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          galleryId: selectedImage.generatedId,
          fetchOnly: true,
        }),
      });

      if (!fetchResponse.ok) {
        const errorData = await fetchResponse.json();
        toast.error(`Failed to fetch updated like count: ${errorData.error}`, {
          position: "bottom-right",
        });
        return;
      }

      const { userLiked, likeCount } = await fetchResponse.json();
      setLike(userLiked.includes(getID));
      setLikeCount(likeCount);
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to toggle like.", { position: "bottom-right" });
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {images.map((image, index) => (
            <motion.div
              key={`${image.image_path}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`relative h-64 rounded-lg overflow-hidden shadow-lg cursor-pointer ${selectedImage?.generatedId === image.generatedId
                  ? "border-2 border-sky-500"
                  : ""
                }`}
              onClick={() => handleImageClick(image)}
            >
              <Image
                src={image.image_path}
                alt={`Image ${index + 1}`}
                fill
                priority
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

        <div className="w-full h-fit flex gap-12">
          {/* Collection Details */}
          {selectedImage && (
            <div className="bg-gray-200 p-6 rounded-lg mb-8 w-full h-fit max-w-[24.5rem]">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Collection Details
                </h2>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={toggleLike}
                >
                  <Icon
                    className="text-red-400"
                    icon={liked ? "jam:heart-f" : "jam:heart"}
                    width="30"
                    height="30"
                  />
                  <span className="ml-2 text-gray-600">{likeCount} likes</span>
                </div>
              </div>
              <p className="text-gray-600">
                <strong>Artist:</strong> {selectedImage.artist}
              </p>
              <p className="text-gray-600">
                <strong>Year:</strong> {selectedImage.year}
              </p>
            </div>
          )}

          <div className="max-h-[32rem] min-h-40 w-full border border-gray-300 rounded-lg p-4 overflow-hidden">
            {/* Comment Section */}
            <div className="h-full flex flex-col max-h-[32rem] min-h-40">
              <h2 className="h-fit text-xl font-semibold text-gray-900 mb-4">
                Comments
              </h2>
              <div className="h-full w-full overflow-y-auto">
                {isLoadingComments ? (
                  <>
                    <CommentSkeleton />
                    <CommentSkeleton />
                    <CommentSkeleton />
                  </>
                ) : (
                  comments.map((comment, index) => {
                    const subcommentsForComment: Subcomment[] =
                      comment.subcomments || [];
                    const shouldShowMoreButton = subcommentsForComment.length > 1;
                    const displayedSubcomments = showMoreReplies[comment.id]
                      ? subcommentsForComment
                      : subcommentsForComment.slice(0, 1);
                    const additionalRepliesCount =
                      subcommentsForComment.length - 1;

                    return (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-lg overflow-y-auto relative"
                      >
                        <div className="w-full flex gap-2.5 items-start justify-start">
                          <Link
                            href={`/g-user/view-profile/${comment.detailsid}`}
                            passHref
                          >
                            <div className="w-10 h-10">
                              <Image
                                src={
                                  comment.profile_pic ||
                                  "/images/creative-directory/profile.jpg"
                                }
                                className="w-full h-full rounded-full bg-cover object-cover border-2 border-gray-400"
                                width={100}
                                height={100}
                                alt={`Comment ${index + 1}`}
                              />
                            </div>
                          </Link>
                          <div className="w-full flex flex-col gap-1 justify-start items-start">
                            <div className="w-full flex flex-col gap-0.5 bg-gray-200 p-2.5 rounded-md">
                              <p className="text-base text-gray-700 font-semibold">
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

                        {displayedSubcomments.map(
                          (subcomment: Subcomment, subIndex: number) => (
                            <div
                              key={subIndex}
                              className="p-2 rounded-lg ml-12 mt-2"
                            >
                              <div className="w-full flex gap-2.5 items-start justify-start">
                                <Link
                                  href={`/g-user/view-profile/${subcomment.userDetails?.detailsid}`}
                                  passHref
                                >
                                  <div className="w-10 h-10 ">
                                    <Image
                                      src={
                                        subcomment.userDetails?.profile_pic ||
                                        "/images/creative-directory/profile.jpg"
                                      }
                                      className="w-full h-full rounded-full bg-cover object-cover border-2 border-gray-400"
                                      width={100}
                                      height={100}
                                      alt={`Comment ${index + 1}`}
                                    />
                                  </div>
                                </Link>
                                <div className="w-full flex flex-col gap-1 justify-start items-start">
                                  <div className="w-full flex flex-col gap-0.5 bg-gray-200 p-2.5 rounded-md">
                                    <p className="text-base text-gray-700 font-semibold">
                                      {subcomment.userDetails?.first_name}
                                    </p>
                                    <p className="text-gray-600">
                                      {subcomment.comment}
                                    </p>
                                  </div>
                                  <div className="flex gap-4">
                                    <p className="text-gray-600 text-sm pl-2">
                                      <TimeAgo
                                        timestamp={subcomment.created_at}
                                      />
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                        {replyLoading[comment.id] && (
                          <div className="ml-12 mt-2">
                            <SubcommentSkeleton />
                          </div>
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
                  })
                )}
              </div>
              <form
                onSubmit={handleCommentSubmit}
                className="bg-white flex gap-2 w-full p-4 mb-4 items-center"
              >
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="border-[1.5px] border-gray-300 py-2 rounded-full h-fit px-4 w-full"
                  placeholder="Add a comment..."
                />
                <button type="submit" className="p-2 rounded">
                  <SendHorizontal
                    className="text-blue-500 text-xl"
                    size={36}
                    strokeWidth={2}
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

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

      <AnimatePresence>
        {/* Edit Modal */}
        {isEditModalOpen && selectedImage && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full bg-black/50 z-[1000] flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setDeleteModalOpen(false)}
          >
            <EditCollection
              generatedId={selectedImage.generatedId}
              created_at={selectedImage.created_at}
              artist={selectedImage.artist}
              image={selectedImage.image_path}
              title={selectedImage.title}
              desc={selectedImage.desc}
              year={selectedImage.year}
              onEdit={handleEdit}
              onCancel={() => setEditModalOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {isInterestModalOpen && selectedImage && (
        <div className="fixed -bottom-2 -right-1 z-[550] p-4">
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

      {isViewModalOpen && selectedImage && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full bg-black/50 z-[1000] flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setViewModalOpen(false)} // Close modal when clicking outside
        >
          <ViewCollection
            generatedId={selectedImage.generatedId}
            created_at={selectedImage.created_at}
            image={selectedImage.image_path}
            title={selectedImage.title}
            desc={selectedImage.desc}
            year={selectedImage.year}
            artist={selectedImage.artist}
            onClose={() => setViewModalOpen(false)} // Close modal
          />
        </motion.div>
      )}
      <ToastContainer />
    </div>
  );
};

export default CollectionDisplay;