import type { Metadata } from "next";
import { DM_Sans, Fraunces, Caveat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import CaseStudySidebarMount from "@/components/CaseStudySidebarMount";
import CustomCursor from "@/components/CustomCursor";
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
    "Sofia Velasquez Sierra — product and ML in wearables and health AI. Side projects built with AI for fun. CMU MS Biomedical Engineering, Aug 2026.",
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
        <CustomCursor />
        <Navbar />
        <Sidebar />
        <CaseStudySidebarMount />
        <LayoutShell>{children}</LayoutShell>
        <Analytics />
      </body>
    </html>
  );
}
