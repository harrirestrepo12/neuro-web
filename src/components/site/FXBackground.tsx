import React from "react";
import { cn } from "@/lib/cn";

export default function FXBackground({
  className,
  imageSrc,
  children,
  imageOpacity = 0.45,
}: {
  className?: string;
  imageSrc?: string;
  children?: React.ReactNode;
  imageOpacity?: number;
}) {
  return (
    <div className={cn("relative", className)}>
      {imageSrc && (
        <div className="fixed inset-0 -z-10">
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{
              backgroundImage: `url(${imageSrc})`,
              opacity: imageOpacity,
              transform: "translateZ(0)",
            }}
          />

          <div className="absolute inset-0 bg-linear-to-b from-black/78 via-black/72 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.10),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(56,189,248,0.10),transparent_55%)]" />

          <div className="pointer-events-none absolute -top-40 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-emerald-500/14 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 left-10 h-130 w-130 rounded-full bg-sky-500/12 blur-3xl" />

          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_180px_rgba(0,0,0,0.70)]" />
        </div>
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}