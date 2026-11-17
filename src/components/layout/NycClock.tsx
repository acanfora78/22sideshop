"use client";

import { useEffect, useState } from "react";

/** Live New York time — a small editorial "dateline" detail in the header. */
export function NycClock({ className }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className={className}>
      NYC <span className="tabular-nums">{time ?? "--:--"}</span>
    </span>
  );
}
