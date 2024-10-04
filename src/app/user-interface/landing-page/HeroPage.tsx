
import { Logo } from "@/components/reusable-component/Logo";
import { CreativeDirectory } from "../../../components/reusable-component/CreativeDirectory";

export const HeroPage = () => {
  return (
    <div className="w-full md:max-w-[80%] max-w-[90%] h-full min-h-[30dvh] mx-auto flex flex-col gap-8 justify-center pt-[20dvh] items-center">
      <div className="w-full h-full flex flex-col lg:justify-start lg:items-start justify-center items-center gap-4">
        <h1 className="font-extrabold lg:text-6xl text-5xl text-left">Welcome to </h1>
        <Logo width={"auto"} height={"auto"} color="text-primary-2" justifyContent="justify-center" itemPosition="items-center" />
      </div>
      <CreativeDirectory textColor="text-secondary-1" />
    </div>
  );
};
