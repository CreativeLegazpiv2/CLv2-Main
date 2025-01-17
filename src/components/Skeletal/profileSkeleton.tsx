import { Icon } from "@iconify/react/dist/iconify.js";

 const ProfileDetailsSkeleton = () => {
  return (
    <div className="min-h-dvh w-full">
      <div className="w-full xl:max-w-[65%] lg:max-w-[80%] max-w-[90%] lg:px-8 mx-auto h-fit py-[12dvh]">
        <div className="w-full h-full flex flex-col">
          <h1 className="uppercase font-semibold text-3xl lg:block hidden">
            Creative profile
          </h1>
          <div className="w-full h-full mt-28">
            <div className="w-full h-fit bg-gray-300 animate-pulse rounded-xl shadow-lg relative">
              <div className="w-full md:max-w-[80%] mx-auto flex lg:flex-row flex-col justify-start lg:items-start items-center gap-8 lg:h-36 h-fit text-secondary-1">
                <div className="-mt-20">
                  <div className="w-48 h-48 bg-gray-300 rounded-full overflow-hidden relative">
                    <img
                      src={"/images/creative-directory/profile.jpg"}
                      alt={`Image of User`}
                      className="w-full h-full object-cover rounded-full" // Ensure it fills the container and keeps the rounded shape
                    />
                  </div>
                </div>
                <div className="h-full w-full flex lg:flex-row flex-col lg:justify-start justify-center lg:gap-12 gap-4 items-center lg:mt-4 lg:pb-0 pb-4">
                  <h1 className="text-3xl font-bold rounded-full bg-gray-300 h-2 w-32"></h1>
                  <div className="flex flex-row justify-row items-center gap-4">
                    <span className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></span>
                    <span className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></span>
                    <span className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></span>
                  </div>
                </div>
              </div>
              <div className="w-full h-fit py-12 bg-gray-200">
                <div className="w-full md:max-w-[80%] max-w-[90%] mx-auto flex flex-col gap-1.5">
                  <div className="text-primary-2">
                    {/* Display user details */}
                    <small className="font-bold opacity-80 capitalize">
                    <span className="w-24 h-2 bg-gray-300 rounded-full animate-pulse"></span>
                    </small>
                    <p className="font-bold w-48 h-2 bg-gray-300"></p>
                    <small className="font-bold opacity-80 capitalize">
                    <span className="w-24 h-2 bg-gray-300 rounded-full animate-pulse"></span>
                    </small>
                    <p className="font-bold w-48 h-2 bg-gray-300"></p>
                    <small className="font-bold opacity-80 capitalize">
                    <span className="w-24 h-2 bg-gray-300 rounded-full animate-pulse"></span>
                    </small>
                    <p className="font-bold w-48 h-2 bg-gray-300"></p>

                    
                  </div>
                </div>
              </div>
              <div className="w-full h-fit flex bg-gray-500">
                    
                  </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailsSkeleton;
