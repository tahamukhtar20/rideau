import "./globals.css";
import type { Metadata } from "next";

import { Header } from "@/components/Header";
import localFont from "next/font/local";

const openSans = localFont({
  src: ,
  variable: "--font-primary",
});

const openSansExtraBold = localFont({
  src: "@/assets/OpenSans-ExtraBold.ttf",
  variable: "--font-secondary",
});
const publicSans = localFont({
  src: "@/assets/PublicSans-Regular.ttf",
  variable: "--font-tertiary",
});

const radley = localFont({
  src: "@/assets/Radley-Regular.ttf",
  variable: "--font-quaternary",
});

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
    <html lang="en">
      <body
        className={`${radley.className} ${publicSans.className} ${openSans.className} ${openSansExtraBold.className}`}
        suppressHydrationWarning={true}
      >
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
