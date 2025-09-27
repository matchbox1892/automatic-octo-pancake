import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "MatchCloud Narrative Studio",
  description:
    "Modernized EMS SOAP narrative generator with configurable protocols and GUI editing."
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
