import { CreativeCarousel } from "./creative-components/CreativeCarousel";
import { CreativeHeroPage } from "./creative-components/CreativeHeroPage";


export default function CreativeDirectoryPage() {
    return (
        <main className="w-full h-fit">
            <div className="py-[15dvh] flex flex-col w-full gap-12">
                <CreativeHeroPage />
                <CreativeCarousel />
            </div>
        </main>
    )
}