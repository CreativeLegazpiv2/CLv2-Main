"use client"
import Lottie from "lottie-react"
import animationData from "../../../../../../../../public/cat.json";
import CommentSkeleton from "@/components/Skeletal/commentSkeleton"
import SubcommentSkeleton from "@/components/Skeletal/subcommentSkeleton"
import { getSession } from "@/services/authservice"
import { deleteCollectionItem } from "@/services/Collections/deleteCollection"
import useAuthRedirect from "@/services/hoc/auth"
import { Icon } from "@iconify/react/dist/iconify.js"
import { motion } from "framer-motion"
import { jwtVerify } from "jose"
import { SendHorizontal, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { Interested } from "./Interested"

interface ViewCollectionProps {
    generatedId: string;
    created_at: Date;
    image: string | null;
    title: string;
    desc: string;
    year: number;
    artist: string;
    onClose: () => void; // Close the ViewCollection modal
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
    onOpenInterestModal: (image: any) => void; // Open the Interested modal
    onOpenEditModal: (image: any) => void; // Open the Edit modal
    onOpenDeleteModal: (image: any) => void; // Open the Delete modal
}

interface UserDetails {
    detailsid: string;
    first_name: string;
    profile_pic: string;
}
interface Subcomment {
    id: string;
    comment: string;
    userid: string;
    created_at: string;
    userDetails?: UserDetails;
}




const JWT_SECRET = process.env.JWT_SECRET || "your-secret";

export const ViewCollection = ({
    generatedId,
    created_at,
    image,
    title,
    desc,
    year,
    artist,
    onClose,
    collection,
    onOpenInterestModal,
    onOpenEditModal,
    onOpenDeleteModal,

}: ViewCollectionProps) => {

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
    const [isLoadingComments, setIsLoadingComments] = useState(true);
    const [isViewModalOpen, setViewModalOpen] = useState(false);

    useAuthRedirect();
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
        <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="w-full relative max-w-[90%] h-full max-h-[90vh] mx-auto bg-white rounded-lg overflow-y-auto shadow-lg"
        >
            <X className="absolute top-2 right-2 cursor-pointer z-[1000] border bg-palette-6 text-white rounded-md" size={24} onClick={onClose} />
            {/* Image Container */}
            <div className="flex lg:flex-row flex-col h-full w-full">
                <div className="w-full h-full flex flex-col ">
                    <div className="relative w-full h-[60vh] bg-palette-5">
                        <Image

                            src={image || "/placeholder.svg"}
                            alt={title}
                            fill
                            className="object-contain"
                        />
                        <div className="w-full absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 flex flex-row items-center justify-between">
 
                            <div className="w-fit flex flex-col text-white text-base">
                                <h2 className="text-white text-xl font-bold" key={title}>{title}</h2>
                                <div className="flex gap-2">
                                    <span key={artist}>{artist},</span>
                                    <span key={year}>{year}</span>
                                </div>

                            </div>
                            {collection.images.map((image, index) => (
                                <div key={image.generatedId} className="w-fit">
                                    {/* "Interested?" Button */}
                                    {image.childid !== getID && (
                                        <button
                                            className="absolute bottom-4 right-4 bg-palette-1 p-2 px-4 rounded-full text-palette-5 hover:bg-palette-2 duration-300"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onOpenInterestModal(image); // Open the Interested modal
                                            }}
                                        >
                                            Interested?
                                        </button>
                                    )}

                                    {/* Edit and Delete Buttons */}
                                    {image.childid == getID && image.generatedId == generatedId && (
                                        <div className="flex gap-2 mt-4 w-fit absolute right-4 bottom-4">
                                            <button
                                                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                                                onClick={() => {
                                                    onOpenEditModal(image); // Open the Edit modal
                                                    onClose(); // Close the ViewCollection modal
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                                                onClick={() => {
                                                    onOpenDeleteModal(image); // Open the Delete modal
                                                    onClose(); // Close the ViewCollection modal
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}


                        </div>
                    </div>

                    {/* Content Container */}
                    <div className="flex flex-col p-2 px-4 bg-white">

                        <div
                            className="flex items-center justify-between  h-fit"
                            onClick={toggleLike}
                        >
                            <h1 className="text-gray-400 text-sm mb-4">
                                {new Date(created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </h1>
                            <div className="flex items-center">
                                <Icon
                                    className="text-red-400 cursor-pointer"
                                    icon={liked ? "jam:heart-f" : "jam:heart"}
                                    width="30"
                                    height="30"
                                />
                                <span className="ml-2 text-gray-600">{likeCount} likes</span>
                            </div>
                        </div>
                        <p className="text-gray-600 text-base h-full overflow-y-auto">{desc}</p>
                    </div>
                </div>
                <div className="w-full h-full bg-white relative border border-black/20">
                    <div className=" w-full h-full p-4  flex flex-col">
                        <div className=" w-full h-dvh bg-white">
                            <div className="h-full flex flex-col max-h-[75dvh] min-h-40">
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
                                    ) : comments.length === 0 ? (
                                        <div className="text-center relative text-gray-500 w-full h-full justify-center items-center flex flex-col">
                                            <h1 className="italic text-palette-7/50 text-xl absolute top-10 max-w-64">Be the First to Comment on this collection</h1>
                                            <Lottie
                                                className="w-full h-full "
                                                loop={true}
                                                autoPlay={true}
                                                animationData={animationData}

                                            />

                                        </div>
                                    ) :
                                        (
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
                                                        key={comment.id}
                                                        className="bg-gray-50 p-4 rounded-lg overflow-y-auto relative"
                                                    >
                                                        <div className="w-full flex gap-2.5 items-start justify-start">
                                                            <Link
                                                                href={`/gallery-display/collections/${comment.detailsid}`}
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
                                                                    key={subcomment.id}
                                                                    className="p-2 rounded-lg ml-12 mt-2"
                                                                >
                                                                    <div className="w-full flex gap-2.5 items-start justify-start">
                                                                        <Link
                                                                            href={`/gallery/view-profile/${subcomment.userDetails?.detailsid}`}
                                                                            passHref
                                                                        >
                                                                            <div className="w-10 h-10 ">
                                                                                <Image
                                                                                    src={
                                                                                        subcomment.userDetails?.profile_pic ||
                                                                                        "/images/creative-directory/profile.jpg"
                                                                                    }
                                                                                    className="w-full h-full rounded-full bg-contain object-contain border-2 border-gray-400"
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

                            </div>
                        </div>
                    </div>
                    <form
                        onSubmit={handleCommentSubmit}
                        className="bg-white flex gap-2 w-full p-4 items-center absolute bottom-0"
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

            {/* {isInterestModalOpen && selectedImage && (
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
            )} */}
        </motion.div>
    )
}