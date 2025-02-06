"use client";
import { Infinite } from "@/components/reusable-component/Infinite";

import { UserProfile } from "../gallery-display/collections/[slug]/UserProfile";



import { UserDetail } from '../gallery-display/collections/[slug]/UserProfile'; 
import ProfileDetailsSkeleton from "@/components/Skeletal/profileSkeleton";



function Profile() {
  // if (!userDetail) {
  //   return <ProfileDetailsSkeleton />;
  // }

  return (
    <div className="min-h-dvh w-full bg-palette-5">
      <UserProfile  />
      <Infinite />
    </div>
  );
}

export default Profile;
