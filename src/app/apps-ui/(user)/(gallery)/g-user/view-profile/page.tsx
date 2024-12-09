'use client';

import { BackGroundDesign } from "./profile-components/BackGroundDesign";
import { Profile } from "./profile-components/Profile";


export default function ViewProfilePage() {
  return (
    <main className="w-full h-fit text-primary-2 overflow-x-hidden min-h-screen">
      <div className="flex flex-col h-full w-full max-w-full relative">
        <BackGroundDesign />
        <Profile />
      </div>
    </main>
  );
}


