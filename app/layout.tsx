import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import BottomPlayer from "@/components/player/BottomPlayer";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { Bottombar } from "@/components/shared/Bottombar";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { AudioProvider } from "@/components/player/AudioContext";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ayfaar Radio",
  description: "Music player as spotify, but with author's favorite music.",
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
            <AuthGuard>
              <AppSidebar />
              <SidebarTrigger />
              {children}
              <BottomPlayer />
              <Bottombar />
            </AuthGuard>
          </AudioProvider>
        </SidebarProvider>
      </body>
    </html>
  );
};