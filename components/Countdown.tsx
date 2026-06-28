"use client";

import { useState, useEffect } from "react";

function getTimeLeft(targetDate: Date) {
  const diff = targetDate.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function Countdown({ targetDate }: { targetDate: string }) {
  const date = new Date(targetDate);
  // Start as null so the server render and the first client render match
  // exactly (no live time yet). The real countdown is computed after mount,
  // avoiding a hydration mismatch on the ever-changing seconds value.
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft(date));
    const id = setInterval(() => setTimeLeft(getTimeLeft(date)), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  // Before mount, render the box layout with placeholders so the markup is
  // stable across SSR/hydration and there's no layout shift.
  if (!mounted) {
    return (
      <div className="flex gap-4 sm:gap-6 justify-center py-6">
        {["DAYS", "HOURS", "MINUTES", "SECONDS"].map((label) => (
          <div key={label} className="flex flex-col items-center">
            <div
              className="flex items-center justify-center rounded-lg px-3 py-3 sm:px-5 sm:py-4 min-w-[64px] sm:min-w-[80px] border"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-bg-white)",
              }}
            >
              <span
                className="countdown-number"
                style={{ color: "var(--color-heading-rose)", lineHeight: 1 }}
              >
                --
              </span>
            </div>
            <span
              className="countdown-label mt-2 uppercase tracking-widest"
              style={{ color: "var(--color-heading-olive)" }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (!timeLeft) {
    return (
      <div className="py-8 text-center">
        <p
          className="countdown-complete"
          style={{
            color: "var(--color-heading-rose)",
          }}
        >
          Today&apos;s the day!
        </p>
      </div>
    );
  }

  const units = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINUTES", value: timeLeft.minutes },
    { label: "SECONDS", value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-4 sm:gap-6 justify-center py-6">
      {units.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <div
            className="flex items-center justify-center rounded-lg px-3 py-3 sm:px-5 sm:py-4 min-w-[64px] sm:min-w-[80px] border"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-bg-white)",
            }}
          >
            <span
              className="countdown-number"
              style={{
                color: "var(--color-heading-rose)",
                lineHeight: 1,
              }}
            >
              {String(value).padStart(2, "0")}
            </span>
          </div>
          <span
            className="countdown-label mt-2 uppercase tracking-widest"
            style={{ color: "var(--color-heading-olive)" }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
