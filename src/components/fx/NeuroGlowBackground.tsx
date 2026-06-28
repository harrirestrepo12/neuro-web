"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  /** si quieres bajar/subir la fuerza del glow */
  intensity?: "soft" | "normal" | "strong";
};

const intensityMap: Record<NonNullable<Props["intensity"]>, string> = {
  soft: "opacity-60",
  normal: "opacity-80",
  strong: "opacity-100",
};

export default function NeuroGlowBackground({ children, intensity = "normal" }: Props) {
  const intensityClass = intensityMap[intensity];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Base gradient (profundo) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_700px_at_10%_10%,rgba(16,185,129,0.18),transparent_55%),radial-gradient(900px_600px_at_85%_25%,rgba(56,189,248,0.14),transparent_55%),radial-gradient(900px_650px_at_70%_95%,rgba(99,102,241,0.10),transparent_60%)]"
      />

      {/* Glow blobs (3D feel) */}
      <div aria-hidden className={`pointer-events-none absolute inset-0 ${intensityClass}`}>
        <div className="absolute -top-56 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-emerald-500/18 blur-3xl" />
        <div className="absolute -bottom-64 -left-40 h-[620px] w-[620px] rounded-full bg-sky-500/14 blur-3xl" />
        <div className="absolute -right-48 top-32 h-[520px] w-[520px] rounded-full bg-indigo-500/12 blur-3xl" />
      </div>

      {/* Subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:64px_64px]"
      />

      {/* Noise overlay (premium film grain) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Top highlight bar */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/35 to-transparent"
      />

      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  );
}