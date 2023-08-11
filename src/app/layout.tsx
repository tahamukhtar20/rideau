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
  title: "créadhésif",
  description: "créadhésif-SAS",
  other: {
    google: "notranslate",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html lang="en" translate="no">
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
