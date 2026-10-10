import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/shared/ui/toaster";
import { getSiteSettings } from "@/lib/queries";
import { siteConfig } from "@/lib/site.config";

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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.seo.siteUrl;
  return {
    title: {
      default: `${settings.brand.name} — ${settings.brand.discipline} Filmmaker`,
      template: `%s | ${settings.brand.name}`,
    },
    description: siteConfig.seo.description,
    keywords: [...siteConfig.seo.keywords],
    authors: [{ name: settings.brand.name }],
    metadataBase: new URL(siteUrl),
    openGraph: {
      title: `${settings.brand.name} — ${settings.brand.discipline} Filmmaker`,
      description: siteConfig.seo.description,
      type: "website",
      locale: "en_US",
      url: siteUrl,
      images: [
        {
          url: settings.hero.image || siteConfig.seo.ogImage,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${settings.brand.name} — ${settings.brand.discipline} Filmmaker`,
      description: siteConfig.seo.description,
    },
    alternates: { canonical: siteUrl },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const DEFAULT_BRAND = "#c9a96e";
  // Only a plain hex colour may reach the inline <style> below
  const brandColor = /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(settings.brand.color)
    ? settings.brand.color
    : DEFAULT_BRAND;

  // Brand color override — non-devs change this in /studio or site.config.ts
  const themeStyle = `
    :root, .dark { --gold: ${brandColor}; }
    ::selection { background: ${brandColor}55; color: #f0ebe2; }
    ::-webkit-scrollbar-thumb:hover { background: ${brandColor}; }
  `;

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeStyle }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[9999] focus:bg-gold focus:text-background focus:px-4 focus:py-2 focus:text-xs focus:uppercase focus:tracking-widest focus:font-semibold"
        >
          Skip to content
        </a>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
