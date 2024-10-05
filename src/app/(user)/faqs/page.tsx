
import { GeneralFaqs } from "./faqs-component/GeneralFaqs";
import { StillHaveQue } from "./faqs-component/StillHaveQue";
import { Support } from "./faqs-component/Support";


export default function FaQsPage() {
    return (
        <main className="w-full h-fit flex flex-col md:gap-[20dvh] gap-[10dvh]">
            <Support />
            <GeneralFaqs />
            <StillHaveQue />

        </main>
    );
}