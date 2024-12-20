import { Loader } from "lucide-react";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return <LoadingSkeleton />;
}

const LoadingSkeleton = () => {
  return (
    <div className="bg-gray-50 text-black fixed min-h-screen h-dvh min-w-screen w-dvh flex justify-center items-center">
       <Loader size={70} className="animate-spin" />
    </div>
  );
};
