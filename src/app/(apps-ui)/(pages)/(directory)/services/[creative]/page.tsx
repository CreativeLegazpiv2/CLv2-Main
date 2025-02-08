
import { ServiceCreatives } from "../services/ServiceCreatives";
import { ServiceHeroPage } from "../services/ServiceHeroPage";
import { Services } from "../services/Services";


export default function CreativeServices() {
    return (
        <main className="w-full h-fit text-primary-2">
            <ServiceHeroPage />
            <ServiceCreatives />
            <Services />
        </main>
    )
}