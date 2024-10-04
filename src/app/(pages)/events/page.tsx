import { CalendarEvent } from "@/app/(pages)/events/events/CalendarEvent";
import { EventHeroPage } from "@/app/(pages)/events/events/EventHeroPage";
import { UpcomingEvents } from "@/app/(pages)/events/events/UpcomingEvents";


export default function EventsPage() {
    return (
        <main className="w-full h-fit">
            <EventHeroPage />
            <UpcomingEvents />
            <CalendarEvent />
        </main>
    );
}