"use client"; // Make sure this is at the top of your file

import { Infinite } from "@/components/reusable-component/Infinite";
import useAuthRedirect from "@/services/hoc/auth";
import { FeaturedCollections } from "./g-user-components/FeaturedGallery";
import GalleryTitle from "../../(pages)/gallery/g-visitor-components/GalleryTitle";
import { CreativeDirectory } from "../../(pages)/home/landing-page/CreativeDirectory";



export default function GalleryVisitorPage() {
    useAuthRedirect();    //authguard

    return (
        <main className="w-full h-fit text-primary-2 overflow-x-hidden bg-palette-5">
            <div className="pt-[10dvh] flex flex-col w-full max-w-full">
                {/* <CollectionsCarousel /> */}
                
                <CreativeDirectory />
                <FeaturedCollections />
                <Infinite />                
            </div>
        </main>
    );
}
