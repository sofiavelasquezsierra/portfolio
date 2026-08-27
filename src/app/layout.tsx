import type { Metadata } from "next";
import { DM_Sans, Fraunces, Caveat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import CaseStudySidebarMount from "@/components/CaseStudySidebarMount";
import LayoutShell from "@/components/LayoutShell";
import { Analytics } from "@vercel/analytics/next";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "opsz"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sofia Velasquez Sierra",
  description:
    "Sofia Velasquez Sierra — software engineer headed toward product. Computational BME MS at CMU (Aug 2026), SWE internships at BTG Pactual and BNP Paribas, and AI products built on real human signals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${fraunces.variable} ${caveat.variable}`}
    >
      <body>
        <Navbar />
        <Sidebar />
        <CaseStudySidebarMount />
        <LayoutShell>{children}</LayoutShell>
        <Analytics />
      </body>
    </html>
  );
}
