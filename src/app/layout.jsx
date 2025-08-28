/* eslint-disable react/prop-types */
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import React from "react";
import LanguageInitializer from "./widgets/LanguageInit";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Majdata Net",
  description: "Majdata Net is a place to share maimai fanmade charts",
  generator: "Next.js",
  manifest: "/manifest.webmanifest",
  keywords: ["majdata", "simai", "maimai", "fanmade"],
  icons: [
    { rel: "apple-touch-icon", url: "icons/icon-128x128.png" },
    { rel: "icon", url: "icons/icon-128x128.png" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <meta name="theme-color" content="#FFFFFF" />
      <meta name="google-adsense-account" content="ca-pub-7973799234411834">
      </meta>
      <link rel="icon" type="image/x-icon" href="favicon.ico" />
      <Suspense>
        <body className={inter.className}>
          <LanguageInitializer></LanguageInitializer>
          {children}
        </body>
      </Suspense>
    </html>
  );
}
