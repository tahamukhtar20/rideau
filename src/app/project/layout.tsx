"use client";
import React from "react";
import authProtection from "@/components/HOC/authProtection";

function Project({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-[calc(100vh-15.5rem)] font-secondary text-primary bg-white flex flex-col">
      {children}
    </main>
  );
}

export default authProtection(Project);
