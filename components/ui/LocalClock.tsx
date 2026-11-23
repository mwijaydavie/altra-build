"use client";

import { useEffect, useState } from "react";

/**
 * Renders a placeholder on the server and hydrates to the live Dar es Salaam
 * clock — no locale-dependent formatting, so no hydration mismatch.
 */
export function LocalClock({ timezone = "Africa/Dar_es_Salaam" }: { timezone?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = () => {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date());
      setTime(parts);
    };
    format();
    const id = window.setInterval(format, 1000);
    return () => window.clearInterval(id);
  }, [timezone]);

  return (
    <span className="font-mono text-[11px] tabular-nums tracking-[0.12em] text-paper/70">
      {time ?? "--:--:--"} <span className="text-paper/35">EAT</span>
    </span>
  );
}
