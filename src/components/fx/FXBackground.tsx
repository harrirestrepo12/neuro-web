// src/components/fx/FXBackground.tsx
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/cn";

export default function FXBackground({
  className,
  imageSrc,
  children,
}: {
  className?: string;
  imageSrc?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("relative", className)}>
      {/* ✅ Fixed background: NO ocupa espacio, siempre detrás */}
      {imageSrc && (
        <div className="fixed inset-0 -z-10">
          <Image
            src={imageSrc}
            alt="Neuro background"
            fill
            priority
            unoptimized
            className="object-cover opacity-35"
          />
          {/* Overlay oscuro para legibilidad */}
          <div className="absolute inset-0 bg-linear-to-b from-black/75 via-black/70 to-black" />
          <div className="absolute inset-0 backdrop-blur-[1px]" />

          {/* Glows */}
          <div className="pointer-events-none absolute -top-40 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 left-10 h-130 w-130 rounded-full bg-sky-500/12 blur-3xl" />
        </div>
      )}

      {/* Contenido normal */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}