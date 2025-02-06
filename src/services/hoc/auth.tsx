// src/services/hoc/auth.tsx
"use client"; // Ensure this is included for client-side hooks

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Make sure to use the correct import for Next.js 13
import { getSession } from "../authservice"; // Adjust the import path as necessary
import { jwtVerify } from "jose";
import { checkTokenExpiration, logoutAndRedirect } from "../jwt";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';

const useAuthRedirect = () => {
    const router = useRouter();

    useEffect(() => {
        const checkToken = async () => {
            const token = getSession();

                 if (!token) {
                   logoutAndRedirect();
                   return;
                 }
                 const isTokenExpired = await checkTokenExpiration(token);
           
                 if (isTokenExpired) {
                   logoutAndRedirect();
                   return;
                 }

            try {
                const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
                const userId = payload.id; // Extract userId from token payload

                if (!userId) {
                    router.push("/signin"); 
                }
            } catch (error) {
                console.error("Token verification failed:", error);
                router.push("/signin");
            }
        };

        checkToken();
    }, [router]); 
};

export default useAuthRedirect;
