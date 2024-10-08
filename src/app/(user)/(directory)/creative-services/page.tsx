import { Infinite } from "@/components/reusable-component/Infinite";
import { ServiceCreatives } from "./service-components/ServiceCreatives";
import { ServiceHeroPage } from "./service-components/ServiceHeroPage";
import { Subscribe } from "@/components/reusable-component/Subscribe";

export default function CreativeServices() {
    return (
        <main className="w-full h-fit text-primary-2">
            <ServiceHeroPage />
            <ServiceCreatives />
            <Infinite />
            <Subscribe />
        </main>
    )
}