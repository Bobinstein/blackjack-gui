import type { Metadata } from "next";
import "./globals.css";
import React, { ReactNode } from "react";

export const metadata: Metadata = {
  title: "AO Blackjack",
  description: "Interface for the AO Blackjack process.",
  openGraph: {
    title: "AO Blackjack",
    description: "Interface for the AO Blackjack process.",
    url: "", // No URL specified
    type: "website",
    images: [
      {
        url: "/public/preview.png",
        width: 800,
        height: 600,
        alt: "AO Blackjack",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@stephencodes42",
    title: "AO Blackjack",
    description: "Interface for the AO Blackjack process.",
    images: ["/public/preview.png"],
  },
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/src/app/favicon.ico",
    apple: "/src/app/favicon.ico",
  },
  robots: "index, follow",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
