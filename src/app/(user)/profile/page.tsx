import { UserProfile } from "@/app/(user)/profile/profile/UserProfile";
import { Infinite } from "@/components/reusable-component/Infinite";
import { Subscribe } from "@/components/reusable-component/Subscribe";

export default function Profile() {
    return (
        <div className="min-h-dvh w-full">
            <UserProfile />
            <Infinite />
            <Subscribe />
        </div>
    )
}