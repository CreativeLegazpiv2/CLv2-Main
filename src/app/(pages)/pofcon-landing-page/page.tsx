import { GallerySection } from "@/app/user-interface/landing-page/GallerySection";
import { Malikhain } from "@/app/user-interface/landing-page/Malikhain";
import { Infinite } from "@/components/reusable-component/Infinite";
import { Events } from "@/components/reusable-component/LandingEventsPage";
import { Subscribe } from "@/components/reusable-component/Subscribe";
import { Transcribed } from "@/components/reusable-component/Transcribed";
import { PofconHeroPage } from "../../user-interface/landing-page/PofconHeroPage";

export default function PofconLandingPage() {
  return (
    <main className="w-full h-fit text-primary-2">
      <PofconHeroPage />
      <Events />
      <GallerySection />
      <Malikhain />
      <Transcribed />
      <Infinite />
      <Subscribe />
    </main>
  );
}
