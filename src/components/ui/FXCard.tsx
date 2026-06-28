import React from "react";
import { cn } from "@/lib/cn";

export default function FXCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "group relative rounded-3xl border border-white/10 bg-black/40 " +
          "shadow-[0_22px_80px_rgba(0,0,0,0.55)] " +
          "transition duration-300 hover:-translate-y-1 hover:border-white/18",
        className
      )}
    >
      {/* Gradient rim */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 blur-xl transition duration-300 group-hover:opacity-80 bg-linear-to-r from-emerald-400/18 via-sky-400/12 to-indigo-400/14"
      />

      {/* Top shine */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-3 h-10 rounded-full bg-white/15 blur-2xl opacity-35"
      />

      <div className="relative p-6 md:p-8">{children}</div>
    </div>
  );
}