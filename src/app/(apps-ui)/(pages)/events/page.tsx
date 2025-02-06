
import { Subscribe } from "@/components/reusable-component/Subscribe";
import { EventHeroPage } from "./events/EventHeroPage";
import { CalendarEvent } from "./events/CalendarEvent";
import { UpcomingEvents } from "./events/UpcomingEvents";


export default function EventsPage() {
    return (
        <main className="w-full h-fit">
            <EventHeroPage />
            <UpcomingEvents />
            <CalendarEvent />
            
        </main>
    );
}