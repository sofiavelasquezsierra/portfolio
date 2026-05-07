"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import PageTransition from "./PageTransition";

/** Adds the sidebar offset on every page except the landing/onboarding. */
export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <div className={isLanding ? "" : "lg:pl-[280px] xl:pl-[320px]"}>
      <PageTransition>{children}</PageTransition>
      {!isLanding && <Footer />}
    </div>
  );
}
