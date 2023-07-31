import "./globals.css";
import type { Metadata } from "next";
import { Header } from "@/components/home/server/Header";
import React from "react";
import Providers from "@/components/Providers/Providers";

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html lang="en">
        <body suppressHydrationWarning={true}>
          <Header />
          {children}
        </body>
      </html>
    </Providers>
  );
}
