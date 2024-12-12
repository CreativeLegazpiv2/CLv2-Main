import React from "react";

const CommentSkeleton = () => (
  <div className="bg-gray-50 p-4 rounded-lg animate-pulse">
    <div className="flex gap-2.5 items-start justify-start">
      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
      <div className="w-full flex flex-col gap-1 justify-start items-start">
        <div className="w-full flex flex-col gap-0.5 bg-gray-200 p-2.5 rounded-md">
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mt-2"></div>
        </div>
        <div className="w-full flex justify-between">
          <div className="flex gap-4">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    </div>
    <div className="ml-12 mt-2">
      <div className="w-full flex gap-2.5 items-start justify-start">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        <div className="w-full flex flex-col gap-1 justify-start items-start">
          <div className="w-full flex flex-col gap-0.5 bg-gray-200 p-2.5 rounded-md">
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mt-2"></div>
          </div>
          <div className="flex gap-4">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CommentSkeleton;