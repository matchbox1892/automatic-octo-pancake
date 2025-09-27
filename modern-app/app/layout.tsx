import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import { ReactNode } from "react";
import { useAutoTimeout } from "@/lib/auth";

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
  // start a default auto-timeout in client-side layout via a small wrapper component
  function AutoTimeoutWrapper({ children }: { children: ReactNode }) {
    // set a short timeout in dev (50 minutes production default)
    useAutoTimeout(50, () => {
      // noop for now; logout handled in store timer
      console.log("session timed out");
    });
    return <>{children}</>;
  }

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
