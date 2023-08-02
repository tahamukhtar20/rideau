import "./globals.css";
import type { Metadata } from "next";
import { Header } from "@/components/home/server/Header";
import React from "react";
import Providers from "@/components/Providers/Providers";
import { Footer } from "@/components/shared/Footer";

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
          <Footer />
        </body>
      </html>
    </Providers>
  );
}
