import React from "react";

export default function Project({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] font-secondary text-primary bg-white flex flex-col">
      {children}
    </main>
  );
}
