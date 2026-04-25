"use client";

import { useEffect, useState } from "react";

type Props = {
  endDate: string;
  compact?: boolean;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

function calcTimeLeft(endDate: string): TimeLeft {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, expired: false };
}

export default function CountdownTimer({ endDate, compact = false }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft(endDate));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcTimeLeft(endDate)), 1000);
    return () => clearInterval(id);
  }, [endDate]);

  if (timeLeft.expired) {
    return <span className="text-[#9E9A94]">Subasta cerrada</span>;
  }

  if (compact) {
    return (
      <span className="countdown-digit tabular-nums">
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {String(timeLeft.hours).padStart(2, "0")}h{" "}
        {String(timeLeft.minutes).padStart(2, "0")}m{" "}
        {String(timeLeft.seconds).padStart(2, "0")}s
      </span>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {[
        { value: timeLeft.days, label: "días" },
        { value: timeLeft.hours, label: "horas" },
        { value: timeLeft.minutes, label: "min" },
        { value: timeLeft.seconds, label: "seg" },
      ].map(({ value, label }) => (
        <div key={label} className="text-center">
          <div
            className="countdown-digit font-playfair text-2xl font-semibold text-[#0D0C0A] tabular-nums w-12 text-center"
          >
            {String(value).padStart(2, "0")}
          </div>
          <div className="text-[10px] text-[#9E9A94] uppercase tracking-wider mt-0.5">{label}</div>
        </div>
      ))}
    </div>
  );
}
