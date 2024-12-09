import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";

// Profile.tsx
export const Profile = () => {
  return (
    <div className="w-full md:h-dvh h-fit md:max-w-[70%] max-w-[90%] mx-auto pt-[10dvh] flex flex-col md:flex-row gap-6 items-end justify-between">
      <div className="w-full md:h-[70dvh] h-fit md:pt-0 pt-[20dvh] border border-black z-50 flex flex-col-reverse md:flex-row md:gap-8 gap-4 justify-center items-center">
        <div className=" w-fit md:h-full h-fit border border-black flex md:flex-col flex-row items-center justify-center gap-4">
          {iconNifyNonColored.map((src, index) => (
            <Icon
              className="cursor-pointer text-white"
              key={index}
              icon={src}
              width="35"
              height="35"
            />
          ))}
        </div>
        <div className="w-full md:h-[70dvh] h-fit border border-black max-w-md rounded-t-3xl bg-white relative space-y-4">
          <div className="w-full flex flex-col h-[18rem] max-w-[18rem] rounded-full mx-auto -mt-[8rem] bg-white overflow-hidden">
            <img
              src="/images/emptyProfile.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full p-4 text-center flex flex-col gap-6">
            <div>
              <p className="text-2xl font-semibold uppercase ">
                Pangaran digdi
              </p>
              <p className="text-base">Email here</p>
            </div>
            <div className="w-full">
              <p className="w-full max-w-sm mx-auto">
                Bio here // Lorem ipsum dolor sit amet consectetur adipisicing
                elit. Fugit minus tenetur, hic error voluptas voluptatem nostrum
                soluta eaque impedit voluptates cupiditate eveniet dignissimos
                sapiente quasi? Iure molestias veniam qui quidem.
              </p>
              <div className="grid grid-cols-2 gap-1 md:hidden pt-4">
                <p>Email here</p>
                <p>Name here</p>
                <p>Bday</p>
                <p>Address here</p>
                <p>Mobile no.</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-40 border mt-4 border-new-3 hover:bg-new-3 hover:text-white text-new-3 py-2 rounded-full mx-auto duration-300 ease-in-out"
            >
              View Gallery
            </motion.button>
          </div>
        </div>
      </div>
      <div className="w-full h-[70dvh] max-w-screen-sm text-white z-50 md:text-right text-center flex flex-col justify-center items-end gap-6">
        <p className="text-6xl w-full max-w-sm uppercase">
          Creative field here
        </p>
        <p></p>
        <p className="w-full max-w-lg text-lg">
          Creative field description here // Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Fugit minus tenetur, hic error voluptas
          voluptatem nostrum soluta eaque impedit voluptates cupiditate eveniet
          dignissimos sapiente quasi? Iure molestias veniam qui quidem.
        </p>
        <div className="flex-col gap-1 md:flex hidden">
          <p>Email here</p>
          <p>Name here</p>
          <p>Bday</p>
          <p>Address here</p>
          <p>Mobile no.</p>
        </div>
      </div>
    </div>
  );
};

const iconNifyNonColored = [
  "mdi:facebook",
  "formkit:instagram",
  "dashicons:email-alt",
];
