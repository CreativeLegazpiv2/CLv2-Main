import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authcontext";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin"); // Redirect inside useEffect to avoid render-phase updates
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return null; // Prevent rendering until authentication is verified
  }

  return <>{children}</>;
}

export default AuthGuard;
