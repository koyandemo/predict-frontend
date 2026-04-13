import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProviderClient } from "@/provider/AuthProviderClient";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PredictOcean - Football Match Predictions & Discussions",
  description:
    "Predict match outcomes, discuss football games, and join the ocean of football enthusiasts. Make your predictions and see how they compare to others.",
  generator: "v0.app",
  keywords: [
    "football",
    "predictions",
    "matches",
    "sports",
    "betting",
    "predictions",
    "soccer",
    "football discussion",
    "match analysis",
  ],
  authors: [{ name: "PredictOcean Team" }],
  creator: "PredictOcean",
  publisher: "PredictOcean",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "PredictOcean - Football Match Predictions & Discussions",
    description:
      "Predict match outcomes, discuss football games, and join the ocean of football enthusiasts.",
    url: "https://www.predictocean.com",
    siteName: "PredictOcean",
    images: [
      {
        url: "/og-image.png", // You should create this image
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PredictOcean - Football Match Predictions & Discussions",
    description:
      "Predict match outcomes, discuss football games, and join the ocean of football enthusiasts.",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://www.predictocean.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <meta name="color-scheme" content="dark"></meta>
      <link rel="icon" href="/logo.png" />
      <body className={`${inter.className} font-sans antialiased`}>
        <AuthProviderClient>
          <div className="flex flex-col min-h-screen">
            <main className="grow">{children}</main>
            <Footer />
            <CookieConsent />
          </div>
        </AuthProviderClient>
        <Toaster richColors />
      </body>
    </html>
  );
}
