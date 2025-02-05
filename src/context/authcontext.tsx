"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtVerify } from "jose";

interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const verifyToken = async (token: string) => {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || "your-secret")
      );

      if (typeof payload.id === "number" && typeof payload.username === "string") {
        setUser({
          id: payload.id,
          username: payload.username,
        });
      } else {
        throw new Error("Invalid token payload");
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      verifyToken(token);
    } else {
      setIsLoading(false);
      router.push("/signin"); // Redirect if no token is found
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin");
    }
  }, [isLoading, user, router]);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    verifyToken(token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    router.push("/signin");
  };


  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
