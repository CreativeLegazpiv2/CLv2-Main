import { Logo } from "@/components/reusable-component/Logo";
import { CreativeDirectory } from "../../../components/reusable-component/CreativeDirectory";

export const PofconHeroPage = () => {
  return (
    <div className="w-full h-fit pb-[10dvh] bg-[url('/images/pofcon/hero.jpg')] bg-cover bg-no-repeat bg-[50%_45%] relative">
      {/* Overlay */}
      <div className="w-full h-full absolute inset-0 bg-black bg-opacity-10 z-10"></div>
      
      {/* Content */}
      <div className="w-full md:max-w-[80%] max-w-[90%] h-full min-h-[30dvh] mx-auto flex flex-col gap-8 justify-center pt-[20dvh] items-center z-20 relative">
        <div className="w-full h-full flex flex-col lg:justify-start lg:items-start justify-center items-center gap-4">
          <h1 className="font-bold lg:text-6xl text-5xl text-left text-secondary-1">
            Welcome to{" "}
          </h1>
          <Logo
            width={"auto"}
            height={"auto"}
            color="text-secondary-1"
            justifyContent="justify-center"
            itemPosition="items-center"
          />
        </div>
        <CreativeDirectory 
        textColor="text-primary-2" 
        textFont="title" 
        borderColor="border-primary-2 border-2"
        trackingWide="tracking-widest"
        roundedEdges="rounded-none" />
      </div>
    </div>
  );
};

