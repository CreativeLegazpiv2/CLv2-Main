export const Transcribed = () => {
  return (
    <div className="w-full md:h-[35dvh] h-fit md:py-0 py-12 bg-primary-2 text-secondary-1">
      <div className="w-full h-full flex md:flex-row flex-col md:justify-between justify-evenly  items-center max-w-[80%] mx-auto">
        <div className="md:w-full md:h-full h-fit flex flex-col gap-4 text-lg justify-center items-start uppercase font-semibold">
          <div className="w-fit flex flex-col gap-0.5 justify-center items-center">
            <p className="">with over</p>
            <p className="text-5xl">5,000</p>
            <p className="text-center">CREATIVES ACROSS BICOL REGION </p>
          </div>
        </div>
        <div className="md:w-full md:h-full h-fit flex justify-end items-center py-10 font-semibold">
          <div className="w-fit flex md:flex-col flex-col-reverse md:justify-end justify-center md:items-end items-center  gap-0.5">
            <p className="md:text-left text-center">LISTED PRODUCTS AND SERVICES</p>
            <p className=" text-5xl">15,234</p>
          </div>
        </div>
      </div>
    </div>
  );
};
