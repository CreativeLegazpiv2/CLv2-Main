
import { GeneralFaqs } from "./faqs-component/GeneralFaqs";
import { Support } from "./faqs-component/Support";


export default function FaQsPage() {
    return (
        <main className="w-full h-fit flex flex-col py-[10dvh] bg-palette-5">
            <Support />
            <GeneralFaqs /> 

            
        </main>
    );
}