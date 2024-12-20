import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="bg-gray-50 fixed min-h-screen w-full flex justify-center items-center">
      <Loader size={70} className="animate-spin" />
    </div>
  );
}
