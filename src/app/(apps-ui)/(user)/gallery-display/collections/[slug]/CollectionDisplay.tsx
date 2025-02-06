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

  // Redirect to /gallery if images array becomes empty
  useEffect(() => {
    if (images.length === 0) {
      toast.info("No images found. Redirecting...", { position: "bottom-right" });
      setTimeout(() => {
        router.push("/gallery-display");
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
    <div className=" min-h-screen relative w-full max-w-[80%] py-[10dvh] mx-auto">
      <Icon
        onClick={() => window.history.back()}
        className="absolute top-2 right-2 cursor-pointer z-20"
        icon="ion:arrow-back"
        width="35"
        height="35"
      />
      <div className="w-full h-full flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-palette-1 uppercase">collection</h1>
        {selectedImage && (
          <>
            {/* <motion.h1
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
            </motion.p> */}
          </>
        )}

        {/* Image Gallery */}
        <div className="columns-1 sm:columns-2 md:columns- lg:columns-4 gap-4">
          {images.map((image, index) => (
            <div key={`${image.image_path}-${index}`} className="mb-4 break-inside-avoid">
              <div className="bg-palette-6/20 rounded-3xl p-4 flex flex-col gap-4">
                <div
                  // onClick={() =>
                  //   (window.location.href = `/gallery-display/collections/${item.slug}`)
                  // }
                  onClick={() => handleImageClick(image)}
                  className="w-full relative cursor-pointer rounded-3xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition-opacity duration-300 ease-in-out z-10"></div>
                  <div className="max-h-[32rem] overflow-hidden">
                    <img

                      src={image.image_path}
                      alt={image.title}
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

        <div className="w-full h-fit flex gap-12">
          {/* Collection Details */}
          {/* {selectedImage && (
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
          )} */}
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
            collection={collection}
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