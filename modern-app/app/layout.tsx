import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import { ReactNode } from "react";
import { AutoTimeoutWrapper } from "@/components/AutoTimeoutWrapper";

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
        <Header />
        <main className="min-h-screen pt-14">
          <AutoTimeoutWrapper>{children}</AutoTimeoutWrapper>
        </main>
      </body>
    </html>
  );
}
