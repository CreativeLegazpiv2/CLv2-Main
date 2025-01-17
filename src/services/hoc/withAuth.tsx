// src/services/hoc/withAuth.tsx
"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { decryptToken } from '@/services/authservice'; 
import { supabase } from '@/services/supabaseClient';
import ProfileDetailsSkeleton from '@/components/Skeletal/profileSkeleton';

// Define the UserDetail interface again here or import it
interface UserDetail {
    id: string;
    first_name: string;
    creative_field: string;
    address: string;
    mobileNo: string;
    bio: string;
    instagram: string;
    facebook: string;
    twitter: string;
    portfolioLink: string;
    role:string;
}

const withAuth = (WrappedComponent: React.ComponentType<{ userDetail: UserDetail | null; editUserDetails: (updatedData: Partial<UserDetail>) => Promise<void>; }>) => {
    return function AuthComponent() {
        const [isAuthenticated, setIsAuthenticated] = useState(false);
        const [loading, setLoading] = useState(true);
        const [userDetail, setUserDetail] = useState<UserDetail | null>(null); // Use the defined UserDetail type
        const router = useRouter();

        useEffect(() => {
            const token = localStorage.getItem('token'); 

            const checkAuthentication = async () => {
                if (!token) {
                    console.log("No token found. Redirecting to login.");
                    router.push('/signup');
                    return;
                }

                try {
                    const payload = await decryptToken(token); 

                    const { data, error } = await supabase
                        .from("userDetails")
                        .select("*")
                        .eq("detailsid", payload.id)
                        .eq("status", true)
                        .single();

                    if (error || !data) {
                        console.log("User details not found. Redirecting to login.");
                        if(token){
                            localStorage.removeItem('token'); 
                            }
                        router.push('/signin');
                        return;
                    }

                    setUserDetail(data); 
                    setIsAuthenticated(true); 
                } catch (error) {
                    console.error("Token verification or data fetching failed:", error);
                    router.push('/signup');
                } finally {
                    setLoading(false); 
                }
            };

            checkAuthentication();
        }, [router]);

        const editUserDetails = async (updatedData: Partial<UserDetail>) => {
            if (!userDetail) return;

            try {
                const { error } = await supabase
                    .from("userDetails")
                    .update(updatedData)
                    .eq("detailsid", userDetail.id);

                if (error) {
                    console.error("Error updating user details:", error);
                    throw new Error("Failed to update user details");
                }

                // Optionally fetch updated user details again to get the latest state
                const { data, error: fetchError } = await supabase
                    .from("userDetails")
                    .select("*")
                    .eq("detailsid", userDetail.id)
                    .single();

                if (fetchError || !data) {
                    console.error("Error fetching updated user details:", fetchError);
                    throw new Error("Failed to fetch updated user details");
                }

                setUserDetail(data); // Update state with new user details
            } catch (error) {
                console.error("Edit user details failed:", error);
            }
        };

        if (loading) {
            return   <div className="w-full min-h-screen flex justify-center items-center">
                    <ProfileDetailsSkeleton />
                  </div>; 
        }

        if (!isAuthenticated) {
            return null;
        }

        return <WrappedComponent userDetail={userDetail} editUserDetails={editUserDetails} />; // Pass userDetail and editUserDetails as props
    };
};

export default withAuth;
