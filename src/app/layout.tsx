import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alex Rivera — Documentary Filmmaker & Visual Storyteller",
  description:
    "Award-winning documentary filmmaker telling stories that illuminate the human condition. Cultural heritage, environmental, and social impact documentaries.",
  keywords: [
    "documentary filmmaker",
    "cinematographer",
    "documentary director",
    "cultural heritage",
    "environmental documentary",
    "social impact film",
    "Alex Rivera",
  ],
  authors: [{ name: "Alex Rivera" }],
  openGraph: {
    title: "Alex Rivera — Documentary Filmmaker",
    description:
      "Award-winning documentary filmmaker telling stories that matter.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alex Rivera — Documentary Filmmaker",
    description: "Award-winning documentary filmmaker telling stories that matter.",
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
