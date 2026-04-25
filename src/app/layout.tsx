import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alex Rivera | Cinematographer & Visual Storyteller",
  description: "Award-winning cinematographer and visual storyteller specializing in wedding films, commercial production, music videos, and documentary filmmaking.",
  keywords: ["videographer", "cinematographer", "filmmaker", "wedding films", "commercial video", "music video", "documentary"],
  authors: [{ name: "Alex Rivera" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Alex Rivera | Cinematographer & Visual Storyteller",
    description: "Award-winning cinematographer specializing in cinematic storytelling",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
