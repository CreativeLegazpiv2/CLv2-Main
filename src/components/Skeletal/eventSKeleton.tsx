

export const SkeletonEventGrid = ({ list }: { list: boolean }) => {
    return (
      <div className="w-full h-fit flex flex-col gap-12 relative">
        <div className="w-full flex justify-end items-center">

        </div>
        {Array.from({ length: 3 }).map((_, groupIndex) => (
          <div key={groupIndex}>
            <div className="font-bold text-3xl sm:text-4xl uppercase pb-8 text-center md:text-left">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div
              className={`w-full h-fit ${
                list
                  ? "flex flex-col gap-4"
                  : "grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8"
              }`}
            >
              {Array.from({ length: list ? 2 : 4 }).map((_, index) => (
                <div
                  key={index}
                  className={`w-full ${
                    list
                      ? "flex flex-row gap-6 items-center p-6 rounded-lg shadow-md"
                      : "flex flex-col gap-4 p-6 rounded-lg shadow-md"
                  } bg-gray-100 border-2 border-gray-200 transition-all duration-300`}
                >
                  <div className={`${list ? "h-24 w-44" : "h-48 w-full"}`}>
                    <div
                      className={`${
                        list ? "w-44 h-24" : "h-48 w-full"
                      } bg-gray-200 animate-pulse`}
                    ></div>
                  </div>
                  <div
                    className={`w-full flex gap-4 ${
                      list ? "flex-col-reverse" : "flex-col"
                    }`}
                  >
                    <div className="w-full flex justify-between items-center">
                      <div className="w-fit flex flex-col leading-3">
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mt-2"></div>
                      </div>
                      {!list && (
                        <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                      )}
                    </div>
                    <div className="w-full">
                      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div
                    className={`px-6 py-1.5 bg-gray-200 text-transparent font-medium transition-colors duration-300 ease-in-out 
                      ${list ? "w-fit px-6 whitespace-nowrap" : "w-full"}
                    `}
                  >
                    Register for free
                  </div>
                </div>
              ))}
            </div>
            <div
              className={`w-full h-[1px] bg-gray-200 mt-12 ${
                list ? "hidden" : ""
              }`}
            ></div>
          </div>
        ))}
      </div>
    );
  };