import type { Metadata } from "next";
import "./globals.css";
import GoogleConsent from "../components/GoogleConsent";
import CookieBanner from "../components/CookieBanner";

export const metadata: Metadata = {
  title: "Acorn Care — Cockpit",
  description: "Acorn Care client workspace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Consent Mode v2 defaults fire before any other scripts */}
        <GoogleConsent />
        {children}
        {/* Banner renders client-side; disappears once a choice is stored */}
        <CookieBanner />
      </body>
    </html>
  );
}
