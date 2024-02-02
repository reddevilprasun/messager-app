"use client";
import { SessionProvider } from "next-auth/react";

interface AuthContextPrpos{
    children: React.ReactNode;
}

export default function AuthContext({children}: AuthContextPrpos){
    return (
        <SessionProvider>{children}</SessionProvider>
    )    
}