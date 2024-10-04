"use client";
import { Logo } from "./Logo";
import { Icon } from "@iconify/react/dist/iconify.js";

interface SubscribeProps {
  bgColor?: string;
  textColor?: string;
  justifyContent?: string;
  itemPosition?: string;
  placeHolder?: string;
}


export const Subscribe = () => {
  return (
    <div className="w-full md:h-[35dvh] h-fit md:py-0 py-12 bg-primary-2 text-secondary-1">
      <div className="w-full h-full flex md:flex-row flex-col-reverse gap-4 justify-between items-center md:justify-between md:max-w-[80%] max-w-[90%] mx-auto">
        <SubscribeInsigts />
        <div className="w-full h-full flex md:justify-end justify-center items-center py-10">
          <Logo
            width="auto"
            height="auto"
            color="white"
            justifyContent="justify-end"
            itemPosition="items-end"
          />
        </div>
      </div>
    </div>
  );
};

// para maging resuable sya sa ibang components
export const SubscribeInsigts: React.FC<SubscribeProps> = ({
  bgColor = "bg-primary-2",
  textColor = "text-secondary-1",
  placeHolder = "Sign up your email",
}) => {

  return (
    <div className={`md:w-full h-full flex flex-col gap-4 justify-center items-start md:text-lg text-base  ${textColor}`}>
          <p className="w-full max-w-sm text-left font-medium">
            Stay in the loop with the latest news, special offers, and insider
            insights.
          </p>
          <div className="w-full max-w-sm relative">
            <input
              className={`w-full h-10 p-4 pl-12 border-b-2 border-secondary-1 outline-none ring-0 ${bgColor}`}
              type="text"
              placeholder={placeHolder}
            />
            <Icon
              className="text-secondary-1 absolute top-1/2 left-0 -translate-y-1/2"
              icon="material-symbols-light:mail-outline"
              width="35"
              height="35"
            />
          </div>
        </div>
  )
}