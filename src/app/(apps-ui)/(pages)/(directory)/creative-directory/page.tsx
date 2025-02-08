import { Infinite } from "@/components/reusable-component/Infinite";
import { CreativeCarousel } from "./creative-components/CreativeCarousel";
import CreativeHeroPage from "./creative-components/CreativeHeroPage";
import { CreativeUsers } from "./creative-components/CreativeUsers";
import { IconPage } from "./creative-components/Icon";
import { ArtistOfTheMonth } from "./creative-components/ArtistOfTheMonth";

export default function CreativeDirectoryPage() {
  return (
    <main className="w-full h-fit text-primary-2 ">
      <div className="pt-[15dvh] flex flex-col w-full h-full bg-palette-5 min-h-screen max-h-screen relative">
        <div className="w-full h-full z-10 absolute top-0 left-0">
          <IconPage />
        </div>
        <div className="w-full h-full z-20">
          <CreativeHeroPage />
          <CreativeCarousel />
        </div>
      </div>
      <ArtistOfTheMonth />
      <CreativeUsers />
    </main>
  );
}
