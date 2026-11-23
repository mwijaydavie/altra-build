"use client";

import { useEffect } from "react";

/** Registers the field-only service worker (scope `/field`). */
export function ServiceWorker() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/field" })
        .catch(() => {
          // Registration is a progressive enhancement; IndexedDB queueing still works.
        });
    };
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);

  return null;
}
