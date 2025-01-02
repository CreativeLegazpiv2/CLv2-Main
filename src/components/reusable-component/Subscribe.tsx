"use client";
import { Icon } from "@iconify/react/dist/iconify.js";

interface SubscribeProps {
  bgColor?: string;
  textColor?: string;
  justifyContent?: string;
  itemPosition?: string;
  placeHolder?: string;
  borderColor?: string; // Add borderColor to the props
}

export const Subscribe: React.FC<SubscribeProps> = ({
  bgColor = "bg-primary-2",
  textColor = "text-secondary-1",
  placeHolder = "Sign up your email",
  borderColor = "border-secondary-1", // Default border color
}) => {
  return (
    <div
      className={`md:w-full h-full flex flex-col gap-4 justify-center items-start md:text-lg text-base ${textColor}`}
    >
      <p className="w-full max-w-sm text-left font-medium">
        Stay in the loop with the latest news, special offers, and insider
        insights.
      </p>
      <div className={`w-full flex items-center max-w-sm relative ${borderColor} border-b-2`}>
        <input
          className={`w-full h-10 p-4 pl-12 outline-none ring-0 ${bgColor}`}
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
  );
};