"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [timerLabel, setTimerLabel] = useState("Time Remaining");
  const [isUrgent, setIsUrgent] = useState(false);
  const supabase = createClient();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    async function loadDeadline() {
      const { data } = await supabase.from("site_settings").select("start_time, deadline").eq("id", 1).single();
      const now = new Date();
      if (data?.start_time && now < new Date(data.start_time)) {
        setTargetDate(new Date(data.start_time));
        setTimerLabel("Time Until Start");
      } else if (data?.deadline) {
        setTargetDate(new Date(data.deadline));
        setTimerLabel("Time Remaining");
      } else {
        setTargetDate(new Date("2026-06-07T23:59:59Z")); // Fallback
        setTimerLabel("Time Remaining");
      }
    }
    loadDeadline();
  }, []);

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        setIsUrgent(false);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setIsUrgent(difference < 1000 * 60 * 60 * 24);

      return { days, hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isMounted || !targetDate) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
        <Clock size={16} /> Loading timer...
      </div>
    );
  }

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center sm:items-start">
      <div className="flex items-center gap-2 mb-2 text-sm font-mono uppercase tracking-widest text-muted-foreground">
        <Clock size={16} className={isUrgent ? "text-[var(--color-star-danger)]" : "text-[var(--color-star-accent)]"} />
        <span className={isUrgent ? "text-[var(--color-star-danger)] font-bold" : ""}>
          {timerLabel}
        </span>
      </div>
      
      <div className="flex gap-2 sm:gap-4">
        <TimeUnit value={formatNumber(timeLeft.days)} label="Days" isUrgent={isUrgent} />
        <span className="text-2xl font-bold text-muted-foreground self-start mt-2">:</span>
        <TimeUnit value={formatNumber(timeLeft.hours)} label="Hours" isUrgent={isUrgent} />
        <span className="text-2xl font-bold text-muted-foreground self-start mt-2">:</span>
        <TimeUnit value={formatNumber(timeLeft.minutes)} label="Mins" isUrgent={isUrgent} />
        <span className="text-2xl font-bold text-muted-foreground self-start mt-2">:</span>
        <TimeUnit value={formatNumber(timeLeft.seconds)} label="Secs" isUrgent={isUrgent} />
      </div>
    </div>
  );
}

function TimeUnit({ value, label, isUrgent }: { value: string; label: string; isUrgent: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div 
        className={`w-14 h-16 sm:w-16 sm:h-20 rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-mono font-bold shadow-inner ${
          isUrgent 
            ? "bg-[var(--color-star-danger)]/10 text-[var(--color-star-danger)] border border-[var(--color-star-danger)]/30" 
            : "bg-[var(--color-star-surface2)] text-foreground border border-[var(--color-star-border)]"
        }`}
      >
        {value}
      </div>
      <span className="text-[10px] sm:text-xs text-muted-foreground mt-2 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}
