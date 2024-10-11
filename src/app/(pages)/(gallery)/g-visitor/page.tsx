import { Infinite } from "@/components/reusable-component/Infinite";
import { Subscribe } from "@/components/reusable-component/Subscribe";
import IndividualWorks from "./g-visitor-components/IndividualWorks";
import StatisticsBanner from "./g-visitor-components/StatisticsBanner";
import BrowseGallery from "./g-visitor-components/BrowseGallery";
import GalleryTitle from "./g-visitor-components/GalleryTitle";

export default function GalleryVisitorPage() {
    return (
        <main className="w-full h-fit text-primary-2 overflow-x-hidden"> {/* Ensure no horizontal scrolling */}
            <div className="pt-[10dvh] flex flex-col w-full max-w-full"> {/* Ensure full width with no overflow */}
                <GalleryTitle />
                <BrowseGallery />
                <StatisticsBanner />
                <IndividualWorks />
                <Infinite />
                <Subscribe />
            </div>
        </main>
    )
}
