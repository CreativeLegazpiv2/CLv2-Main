import { motion } from "framer-motion";

const UserCardSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full border border-gray-400 rounded-xl p-4 bg-secondary-1 shadow-customShadow mt-10"
    >
      <div className="flex flex-col justify-center items-center">
        {/* Profile Picture and Like Button Skeleton */}
        <div className="w-full h-full max-h-28 -mt-12 flex flex-row-reverse gap-4 justify-center items-center relative">
          {/* Like Button Skeleton */}
          <div className="w-fit flex items-center justify-center gap-1.5 cursor-pointer absolute right-0 -translate-y-1/2 top-16">
            <div className="h-8 w-8 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="h-4 w-12 bg-gray-300 rounded animate-pulse"></div>
          </div>

          {/* Profile Picture Skeleton */}
          <div className="h-28 w-28 z-50 rounded-full bg-gray-300 animate-pulse border-2 border-gray-400"></div>
        </div>

        {/* Bio and Name Skeleton */}
        <div className="w-full min-h-32 max-h-fit py-6">
          <div className="w-full h-full max-w-[87%] mx-auto flex flex-col gap-2 justify-center items-center">
            {/* Name Skeleton */}
            <div className="h-6 w-48 bg-gray-300 rounded animate-pulse"></div>

            {/* Bio Skeleton */}
            <div className="w-full flex flex-col gap-2">
              <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-4 w-1/2 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCardSkeleton;