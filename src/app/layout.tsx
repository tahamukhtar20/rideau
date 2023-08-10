import "./globals.css";
import type { Metadata } from "next";
import { Header } from "@/components/shared/Header";
import React from "react";
import Providers from "@/components/Providers/Providers";
import { Footer } from "@/components/shared/Footer";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Analytics } from "@vercel/analytics/react";

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
          <ToastContainer />
          <Analytics />
        </body>
      </html>
    </Providers>
  );
}
