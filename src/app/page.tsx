import { redirect } from "next/navigation";

/**
 * The site no longer has a standalone landing/onboarding screen — visiting the
 * root sends you straight to the work page. (The old welcome + cursor-picker
 * components still live in the repo if we ever want to bring it back.)
 */
export default function Home() {
  redirect("/work");
}
