
"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface ViewCollectionProps {
    generatedId: string
    created_at: Date
    image: string | null
    title: string
    desc: string
    year: number
    artist: string
    onClose: () => void
}

export const ViewCollection = ({
    generatedId,
    created_at,
    image,
    title,
    desc,
    year,
    artist,
    onClose,
}: ViewCollectionProps) => {
    return (
        <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="w-full max-w-3xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg"
        >
            <div className="relative">
                <Image
                    src={image || "/placeholder.svg"}
                    alt={title}
                    width={768}
                    height={512}
                    className="h-[80dvh] object-fill"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <h2 className="text-white text-2xl font-bold">{title}</h2>
                    <div className="flex justify-between text-white text-base">
                        <span>{artist}</span>
                        <span>{year}</span>
                    </div>
                </div>
            </div>
            <div className="p-6">
                <p className="text-gray-400 text-sm mt-3">Posted: {new Date(created_at).toLocaleDateString('en-US', { 
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}</p>
                <p className="text-gray-600 text-base">{desc}</p>
            </div>
        </motion.div>
    )
}
