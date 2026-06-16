import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Acorn Care — Cockpit",
  description: "Concierge financial coordination workspace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
