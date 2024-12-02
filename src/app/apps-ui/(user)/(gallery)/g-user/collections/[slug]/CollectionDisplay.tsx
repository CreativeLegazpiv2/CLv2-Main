// collectionDisplay
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
import { Icon } from "@iconify/react/dist/iconify.js";

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

const CollectionDisplay: React.FC<CollectionProps> = ({ collection }) => {
  const router = useRouter();
  const [images, setImages] = useState(collection.images);
  const [getID, setID] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(
    collection.images[0] || null
  );
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const [imageToDelete, setImageToDelete] = useState<{
    generatedId: string;
    image_path: string;
  } | null>(null);


  const [commentInput, setCommentInput] = useState("");

  const [comments, setComments] = useState<any[]>([]);

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
      setComments(data.comments);
    } else {
      const data = await response.json();
      toast.error(`Failed to fetch comments: ${data.error}`, { position: "bottom-right" });
    }
  } catch (error) {
    console.error("Error fetching comments:", error);
    toast.error("Failed to fetch comments.", { position: "bottom-right" });
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
      toast.success("Comment added successfully!", { position: "bottom-right" });
      setCommentInput("");
      fetchComments(); // Fetch updated comments after submission
    } else {
      const data = await response.json();
      toast.error(`Failed to add comment: ${data.error}`, { position: "bottom-right" });
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

  return (
    <div className="bg-white min-h-screen relative lg:max-w-screen-xl w-full max-w-[95%] mx-auto">
      <Icon onClick={() => window.history.back()} className="absolute top-2 right-2 cursor-pointer z-50" icon="ion:arrow-back" width="35" height="35" />
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
                className="absolute top-0 left-0 w-full h-full bg-black flex justify-center items-center gap-8"
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

    {/* Comment Section */}
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Comments</h2>
      {comments.map((comment, index) => (
        <div key={index} className="bg-gray-100 p-4 rounded-lg mb-2">
          <p className="text-gray-600">{comment.comment}</p>
          <p className="text-sm text-gray-500">By: {comment.userid}</p>
        </div>
      ))}
    </div>

        
{/* Comment */}
<form onSubmit={handleCommentSubmit} className="mt-8">
  <input
    type="text"
    value={commentInput}
    onChange={(e) => setCommentInput(e.target.value)}
    className="border p-2 rounded w-full"
    placeholder="Add a comment..."
  />
  <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded">
    Submit
  </button>
</form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CollectionDisplay;
  