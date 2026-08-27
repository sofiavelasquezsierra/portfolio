"use client";

import Footer from "./Footer";
import PageTransition from "./PageTransition";
import Pet from "./Pet";

/** Offsets every page for the fixed sidebar rail. */
export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="lg:pl-[220px] xl:pl-[250px]">
        <PageTransition>{children}</PageTransition>
        <Footer />
      </div>
      {/* Sofia's pet — global, persists across pages, draggable. */}
      <Pet />
    </>
  );
}
