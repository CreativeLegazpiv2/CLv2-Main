const NoCollectionsSkeleton = () => {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Title Skeleton */}
        
  
          {/* Carousel Skeleton */}
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="h-[500px] md:h-[300px]">
              <div className="absolute top-0 left-0 w-full h-full flex flex-col md:flex-row ">
                {/* Image Skeleton */}
                <div className="w-full md:w-1/2 h-64 md:h-full relative bg-gray-200  flex flex-col gap-2 justify-center items-center">
                 <h1 className="z-10">No collections found</h1>
                 <span className="text-gray-400 text-sm">(Your collections will appear here )</span>
                </div>
  
                {/* Content Skeleton */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
                  <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="h-4 w-72 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="h-4 w-56 bg-gray-200 rounded animate-pulse mb-8"></div>
                  <div className="h-12 w-48 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
  
        </div>
      </div>
    );
  };
  
  export default NoCollectionsSkeleton;