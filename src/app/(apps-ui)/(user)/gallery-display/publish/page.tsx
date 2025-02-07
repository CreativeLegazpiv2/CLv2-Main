"use client"
import { Infinite } from "@/components/reusable-component/Infinite";
import PublishGallery from "../collections/[slug]/(collectionModal)/PublishGallery";
import { Subscribe } from "@/components/reusable-component/Subscribe";
import useAuthRedirect from "@/services/hoc/auth";

export default function CreativeServices() {
    useAuthRedirect(); 
    return (
        <main className="w-full h-fit text-primary-2">
            <PublishGallery />
            <Infinite />            
        </main>
    )
}