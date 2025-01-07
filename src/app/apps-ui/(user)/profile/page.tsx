"use client";
import { Infinite } from "@/components/reusable-component/Infinite";
import { Subscribe } from "@/components/reusable-component/Subscribe";
import { UserProfile } from "./profile/UserProfile";
import withAuth from "@/services/hoc/withAuth";


import { UserDetail } from './profile/UserProfile'; 

interface ProfileProps {
  userDetail: UserDetail | null; 
}

function Profile({ userDetail }: ProfileProps) {
  if (!userDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-dvh w-full">
      <UserProfile userDetail={userDetail} />
      <Infinite />      
    </div>
  );
}

export default withAuth(Profile);
