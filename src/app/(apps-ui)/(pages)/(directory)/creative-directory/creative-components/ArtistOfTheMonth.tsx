import { ChevronRight } from "lucide-react";

export const ArtistOfTheMonth = () => {
  return (
    <div className="w-full lg:h-dvh h-fit bg-palette-2 text-white">
      <div className="w-full h-full md:max-w-[80%] max-w-[90%] mx-auto flex lg:flex-row flex-col lg:py-0 py-[10dvh] lg:gap-[10dvh] gap-12">
        <div className="w-full lg:h-full h-fit flex md:justify-start justify-center items-center">
          <div className="h-fit lg:w-fit w-full flex flex-col  gap-3">
            <h1 className="title text-4xl font-normal">ARTIST OF THE MONTH</h1>
            {description.map((item, index) => (
              <div className="h-fit w-full flex flex-col  gap-3">
                <span className="w-full max-w-lg text-5xl font-bold">
                  {item.name}
                </span>
                <span className="text-3xl italic font-bold">{item.field}</span>
                <p
                  className={`text-semibold max-w-md ${item.bio.length > 100 ? "line-clamp-5" : ""
                    }`}
                >
                  {item.bio}
                </p>

                <div className="pt-6 relative h-fit w-full">
                  <button className="w-full max-w-60 py-3 text-xl z-20 bg-palette-6 uppercase text-palette-5 rounded-full font-semibold tracking-wider relative">
                    See Works
                    <span className="absolute right-4 top-1/2 -translate-y-1/2">
                      <ChevronRight />
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full h-full flex lg:justify-end justify-center items-center">
          <div className="w-full h-full bg-gray-500 rounded-[2rem] min-h-[50dvh] max-h-[70dvh] md:max-w-md">
            {/* laaga na sana digdi padi */}
            {/* <img src="" alt="" />  */}
          </div>
        </div>

      </div>
    </div>
  );
};

const description = [
  {
    name: "Name here!",
    field: "Creative field here!",
    bio: " Bio here Lorem ipsum dolor, sit amet consectetur adipisicing elit Eveniet vitae impedit exercitationem consectetur inventore! Ipsam nesciunt dolore similique, earum distinctio eum, culpa eos eveniet quis itaque et corrupti praesentium cumque.",
  },
];
