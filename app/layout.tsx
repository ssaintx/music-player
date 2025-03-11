import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SidebarProvider } from "@/components/ui/sidebar";
import { Bottombar } from "@/components/shared/Bottombar";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { AudioProvider } from "@/components/player/AudioContext";

import "./globals.css";
import BottomPlayer from "@/components/player/BottomPlayer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider>
          <AudioProvider>
            <AppSidebar />
              {children}
            <BottomPlayer />
            <Bottombar />
          </AudioProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
