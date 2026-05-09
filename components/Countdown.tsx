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
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(date));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(date)), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className="py-8 text-center">
        <p
          className="font-script"
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
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
              style={{
                fontSize: "clamp(1.6rem, 5vw, 2.8rem)",
                color: "var(--color-heading-rose)",
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontWeight: 300,
                lineHeight: 1,
              }}
            >
              {String(value).padStart(2, "0")}
            </span>
          </div>
          <span
            className="mt-2 uppercase tracking-widest"
            style={{ fontSize: "0.6rem", color: "var(--color-heading-olive)" }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
