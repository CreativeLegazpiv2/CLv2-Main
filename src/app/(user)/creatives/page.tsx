import { Infinite } from "@/components/reusable-component/Infinite";
import { CreativeCarousel } from "./creative-components/CreativeCarousel";
import { CreativeHeroPage } from "./creative-components/CreativeHeroPage";
import { Subscribe } from "@/components/reusable-component/Subscribe";
import { CreativeUsers } from "./creative-components/CreativeUsers";


export default function CreativeDirectoryPage() {
    return (
        <main className="w-full h-fit">
            <div className="py-[10dvh] flex flex-col w-full gap-2">
                <CreativeHeroPage />
                <CreativeCarousel />
            </div>
            <CreativeUsers />
            <Infinite />
            <Subscribe />
        </main>
    )
}