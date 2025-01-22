import { Icon } from "@iconify/react/dist/iconify.js";

export default function SkeletonHomeEvents() {
  return (
    <div className="w-dvw md:h-dvh h-fit bg-white/80">
      <div className="w-full h-full md:py-0 py-24 gap-12 flex flex-col justify-center items-center mx-auto">
        {/* Header with skeleton text and navigation buttons */}
        <div className="w-full md:w-[90%] max-w-[98%] mx-auto flex flex-row justify-between items-center">
          <div className="bg-gray-300 w-full max-w-lg h-12 rounded-full animate-pulse"></div>
          {/* Navigation buttons */}
          <div className="gap-10 md:flex hidden">
            <div className="bg-gray-200 p-3 rounded-full shadow-lg hover:bg-white h-14 w-14 animate-pulse"></div>
            <div className="bg-gray-200 p-3 rounded-full shadow-lg hover:bg-white h-14 w-14 animate-pulse"></div>
          </div>
        </div>

        {/* Skeleton cards */}
        <div className="w-full h-fit relative flex flex-col justify-center items-center gap-10">
          <div className="overflow-hidden md:w-[90%] w-[98%] mx-auto">
            <div className="flex">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full h-fit pb-12">
                {/* Repeat 3 skeleton cards */}
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="w-full h-fit min-h-[30rem] max-h-[30rem] flex flex-col bg-gray-50 rounded-xl shadow-xl transition-shadow"
                  >
                    {/* Skeleton image */}
                    <div className="w-full h-48 flex-shrink-0 overflow-hidden rounded-t-xl bg-gray-300 animate-pulse"></div>

                    {/* Skeleton content */}
                    <div className="flex flex-col flex-grow p-6 overflow-hidden">
                      {/* Skeleton time and location */}
                      <div className="flex flex-col gap-2 mb-4">
                        <div className="bg-gray-300 h-4 w-3/4 rounded-full animate-pulse"></div>
                        <div className="bg-gray-300 h-4 w-1/2 rounded-full animate-pulse"></div>
                      </div>

                      {/* Skeleton title */}
                      <div className="bg-gray-300 h-6 w-full rounded-full animate-pulse mb-4"></div>

                      {/* Skeleton button */}
                      <div className="flex justify-center mt-auto">
                        <div className="w-full h-14 bg-gray-300 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
