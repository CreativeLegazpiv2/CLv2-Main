"use client";

const ProfileSkeletonUI = () => {
  return (
    <div className="min-h-dvh w-full text-palette-7">
      {/* Hero Section Skeleton */}
      <div className="w-full md:min-h-[80dvh] md:max-h-[80dvh] h-dvh relative">
        <div className="w-full h-full bg-palette-4 animate-pulse absolute top-0 left-0" />
        <div className="absolute w-full h-full flex z-10 bg-gradient-to-r from-palette-5 from-0% via-palette-5 md:via-15% via-25% to-transparent md:to-60% to-70%">
          <div className="w-full h-fit pt-[20dvh] max-w-[80%] mx-auto relative flex flex-col gap-12 justify-center items-start">
            <div className="w-full flex flex-col gap-2">
              <div className="w-full flex md:flex-row flex-col-reverse md:justify-between justify-start md:items-center items-start">
                {/* Name Skeleton */}
                <div className="h-12 w-64 bg-palette-4 rounded-lg animate-pulse" />
                {/* Back Button Skeleton */}
                <div className="h-9 w-9 bg-palette-4 rounded-md animate-pulse" />
              </div>
              {/* Creative Field Skeleton */}
              <div className="h-8 w-48 bg-palette-4 rounded-lg animate-pulse mt-2" />
              {/* Edit Button Skeleton */}
              <div className="h-10 w-32 bg-palette-6 rounded-full animate-pulse mt-2" />
            </div>
            
            {/* Profile Image Skeleton */}
            <div className="flex flex-col h-full md:justify-start md:items-start justify-center items-center w-full">
              <div className="w-full h-full rounded-xl md:max-w-[22rem] md:min-w-[22rem] md:max-h-[32rem] min-h-[32rem] bg-palette-4 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section Skeleton */}
      <div className="w-full h-full min-h-[70dvh] flex relative justify-center items-center">
        <div className="md:max-w-[40%] lg:max-w-[50%] max-w-[90%] mx-auto w-full h-full flex flex-col gap-4 justify-center items-start md:absolute right-0">
          {/* Date Joined Skeleton */}
          <div className="flex gap-4 items-center w-full">
            <div className="h-6 w-48 bg-palette-4 rounded animate-pulse" />
            <div className="h-px w-16 bg-palette-4 animate-pulse" />
          </div>
          
          {/* Title Skeleton */}
          <div className="h-12 w-72 bg-palette-4 rounded-lg animate-pulse" />
          
          {/* Social Icons Skeleton */}
          <div className="flex items-center gap-4 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 w-12 bg-palette-4 rounded-full animate-pulse" />
            ))}
          </div>
          
          {/* Bio Text Skeleton */}
          <div className="space-y-2 w-full pb-4">
            <div className="h-4 w-full bg-palette-4 rounded animate-pulse" />
            <div className="h-4 w-[90%] bg-palette-4 rounded animate-pulse" />
            <div className="h-4 w-[80%] bg-palette-4 rounded animate-pulse" />
          </div>
          
          {/* Contact Info Skeleton */}
          <div className="pt-4 w-full">
            <div className="h-6 w-64 bg-palette-4 rounded animate-pulse mb-2" />
            <div className="h-4 w-72 bg-palette-4 rounded animate-pulse" />
          </div>
          
          {/* Publish Button Skeleton */}
          <div className="h-12 w-56 bg-palette-6 rounded-full animate-pulse mt-4" />
        </div>
      </div>

      {/* Featured Work Section Skeleton */}
      <div className="md:h-dvh h-fit w-full bg-palette-3">
        <div className="w-full h-full flex md:flex-row flex-col md:pb-0 pb-[5dvh]">
          {/* Featured Work Text Section */}
          <div className="w-full h-full text-palette-5 md:py-0 py-[5dvh]">
            <div className="w-full h-full md:max-w-[70%] max-w-[90%] mx-auto flex flex-col gap-4 md:items-start items-center justify-center">
              <div className="h-8 w-48 bg-palette-5/20 rounded animate-pulse" />
              <div className="h-12 w-72 bg-palette-5/20 rounded animate-pulse" />
              <div className="h-6 w-24 bg-palette-5/20 rounded animate-pulse" />
              <div className="space-y-2 w-full max-w-xl md:block hidden">
                <div className="h-4 w-full bg-palette-5/20 rounded animate-pulse" />
                <div className="h-4 w-[90%] bg-palette-5/20 rounded animate-pulse" />
                <div className="h-4 w-[80%] bg-palette-5/20 rounded animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Featured Work Image Section */}
          <div className="w-full h-full min-h-[60dvh] relative">
            <div className="w-full h-full bg-palette-4 animate-pulse absolute" />
            <div className="w-full h-full absolute top-0 left-0 z-10 backdrop-blur-sm md:block hidden" />
            <div className="p-12 absolute inset-0 z-20 flex items-center justify-center">
              <div className="w-full h-full bg-palette-4 rounded-xl animate-pulse md:block hidden" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeletonUI;