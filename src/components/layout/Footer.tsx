import { Icon } from "@iconify/react/dist/iconify.js";
import { Logo } from "../reusable-component/Logo";

export const Footer = () => {
  return (
    <div className="w-full md:h-[35dvh] h-fit bg-palette-2 md:py-0 pt-[5dvh] pb-[10dvh] z-50">
      <div className="w-full h-full flex md:flex-row flex-col md:justify-between justify-center items-center md:max-w-[80%] max-w-[90%] mx-auto">
        <div className="w-fit h-full flex flex-col justify-center items-center md:gap-6 gap-2">
          <div className="w-full py-12 h-fit flex flex-col gap-2 font-medium text-sm">
            <Logo
              width={"auto"}
              height={"auto"}
              color="text-palette-5 w-full h-full"
            />
          </div>
        </div>
        <div className="w-fit h-full flex flex-col justify-center items-center md:gap-10 gap-6">
          <div className="w-full h-fit flex flex-col gap-2 text-sm text-palette-5">
            <p className="max-w-[23rem] text-lg font-normal md:text-left text-center">
              Stay in the loop with the latest news, special offers, and insider
              insights.
            </p>
          </div>
          <div className="w-full h-fit flex md:flex-row flex-col md:justify-start items-center justify-center md:gap-4 gap-4 text-palette-5">
            <div className="w-fit md:gap-4 gap-4 flex justify-start items-center">
              {iconNifyColored.map((src, index) => (
                <Icon
                  className="cursor-pointer"
                  key={index}
                  icon={src}
                  width="35"
                  height="35"
                />
              ))}
            </div>
            <p className="font-normal text-sm">&copy; All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// uncomment nalang if trip yung may color na icons
export const iconNifyColored = [
  "devicon:facebook",
  "skill-icons:instagram",
  "skill-icons:gmail-light",
];

// uncomment nalang if trip yung walang color na icons
export const iconNifyNonColored = [
  "iconoir:facebook-tag",
  "ph:instagram-logo-light",
  "fluent:mail-28-regular",
];
