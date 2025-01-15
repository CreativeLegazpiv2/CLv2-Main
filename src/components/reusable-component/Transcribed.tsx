"use client";

interface TranscribedProps {
  bgColor?: string;
  textColor?: string;
}

export const Transcribed = ({
  bgColor = "bg-palette-7",
  textColor = "text-secondary-1",
}: TranscribedProps = {}) => {
  return (
    <div className={`w-full md:h-[35dvh] h-fit ${bgColor} ${textColor}`}>
      <div className="w-full h-full flex md:flex-row md:py-0 py-12 flex-col md:justify-between justify-center  items-center md:max-w-[70%] max-w-[90%] mx-auto">
        <div className="md:w-fit md:h-full h-fit flex flex-col gap-4 text-lg justify-center items-start uppercase font-semibold">
          <div className="w-fit flex flex-col gap-3 justify-center items-center">
            <p className="text-center w-fit text-base">
              <span className="text-4xl">CREATIVES</span> <br /> ACROSS BICOL REGION{" "}
            </p>
            <p className="text-[55px]">5,000+</p>
          </div>
        </div>
        <div className="md:w-fit md:h-full h-fit flex justify-end items-center py-10 font-semibold">
          <div className="w-fit flex md:flex-col flex-col-reverse md:justify-start justify-center md:items-center items-center  gap-0.5">
            <p className="md:text-left text-center text-2xl -tracking-wide">
              LISTED PRODUCTS <br /> <span className="text-3xl">AND SERVICES</span>
            </p>
            <p className=" text-5xl tracking-widest">15,234</p>
          </div>
        </div>
      </div>
    </div>
  );
};
