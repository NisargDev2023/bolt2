"use client";
import { useEffect } from "react";

export default function ClientInstallListener() {
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      (window as any).__A2HS_PROMPT__ = e;
      console.log("[A2HS] beforeinstallprompt captured globally");
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  return null;
}