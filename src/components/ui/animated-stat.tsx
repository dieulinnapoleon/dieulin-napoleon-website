"use client";

import { useState, useEffect, useRef } from "react";

interface StatProps {
  value: number;
  suffix?: string;
  label: string;
  icon: React.ReactNode;
}

export function AnimatedStat({ value, suffix = "", label, icon }: StatProps) {
  // Start with the real value so search engines, previews, and slow connections never see "0"
  const [count, setCount] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyVisible) return;

    setCount(0);
    let timer: ReturnType<typeof setInterval> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const steps = 40;
        const increment = value / steps;
        let current = 0;
        timer = setInterval(() => {
          current += increment;
          if (current >= value) {
            setCount(value);
            if (timer) clearInterval(timer);
          } else {
            setCount(Math.floor(current));
          }
        }, 1500 / steps);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [value]);

  return (
    <div ref={ref} className="text-center p-6">
      <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-3">{icon}</div>
      <p className="font-display text-3xl font-bold text-navy">{count}{suffix}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}
