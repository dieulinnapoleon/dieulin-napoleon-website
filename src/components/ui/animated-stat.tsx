"use client";

import { useState, useEffect, useRef } from "react";

interface StatProps {
  value: number;
  suffix?: string;
  label: string;
  icon: React.ReactNode;
}

export function AnimatedStat({ value, suffix = "", label, icon }: StatProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1500;
          const steps = 40;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center p-6">
      <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-3">{icon}</div>
      <p className="font-display text-3xl font-bold text-navy">{count}{suffix}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}
