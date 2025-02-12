"use client"; // Make sure this is at the top of your file
import useAuthRedirect from "@/services/hoc/auth";
import { FeaturedCollections } from "./g-user-components/FeaturedGallery";
import { CreativeDirectory } from "../../(pages)/home/landing-page/CreativeDirectory";
import { FieldCollection } from "./g-user-components/FieldCollection";
import { useState } from "react";



export default function GalleryVisitorPage() {
    useAuthRedirect();    //authguard
    const [currentIndex, setCurrentIndex] = useState(0);
    return (
        <main className="w-full h-fit text-primary-2 overflow-x-hidden bg-palette-5">
            <div className="pt-[10dvh] flex flex-col w-full max-w-full">
                {/* <CollectionsCarousel /> */}
                <FieldCollection 
            
                 />
                <CreativeDirectory />
                <FeaturedCollections />

            </div>
        </main>
    );
}
