"use client";
import { Infinite } from "@/components/reusable-component/Infinite";
import { Subscribe } from "@/components/reusable-component/Subscribe";
import { UserProfile } from "./profile/UserProfile";
import withAuth from "@/services/hoc/withAuth";


import { UserDetail } from './profile/UserProfile'; 
import ProfileDetailsSkeleton from "@/components/Skeletal/profileSkeleton";

interface ProfileProps {
  userDetail: UserDetail | null; 
}

function Profile({ userDetail }: ProfileProps) {
  if (!userDetail) {
    return <ProfileDetailsSkeleton />;
  }

  return (
    <div className="min-h-dvh w-full bg-palette-5">
      <UserProfile userDetail={userDetail} />
      <Infinite />
    </div>
  );
}

export default withAuth(Profile);
