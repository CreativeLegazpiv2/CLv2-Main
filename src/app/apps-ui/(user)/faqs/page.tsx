
import { Infinite } from "@/components/reusable-component/Infinite";
import { GeneralFaqs } from "./faqs-component/GeneralFaqs";
import { StillHaveQue } from "./faqs-component/StillHaveQue";
import { Support } from "./faqs-component/Support";
import { Subscribe } from "@/components/reusable-component/Subscribe";


export default function FaQsPage() {
    return (
        <main className="w-full h-fit flex flex-col md:gap-[20dvh] gap-[10dvh]">
            <Support />
            <GeneralFaqs />
            <StillHaveQue />
            <div className="w-full flex flex-col">
            <Infinite />            
            </div>
        </main>
    );
}