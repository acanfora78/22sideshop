"use client";

import { usePathname, useRouter } from "next/navigation";
import { INTRO_STORAGE_KEY } from "@/components/home/intro-config";

/** Lets visitors (and the brand team) watch the door intro again. */
export function ReplayIntro({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        try {
          window.sessionStorage.removeItem(INTRO_STORAGE_KEY);
        } catch {
          /* ignore */
        }
        document.documentElement.removeAttribute("data-intro");
        if (pathname === "/") window.location.reload();
        else router.push("/");
      }}
    >
      Rivedi l’intro ↻
    </button>
  );
}
