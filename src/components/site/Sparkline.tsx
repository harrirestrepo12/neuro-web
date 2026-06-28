"use client";

import { useMemo } from "react";

export default function Sparkline({
  values,
  up,
}: {
  values: number[];
  up: boolean | null;
}) {
  const path = useMemo(() => {
    if (!values.length) return "";

    const w = 64;
    const h = 22;
    const pad = 1;

    let min = Infinity;
    let max = -Infinity;
    for (const v of values) {
      if (v < min) min = v;
      if (v > max) max = v;
    }

    const range = Math.max(1e-9, max - min);

    const step = (w - pad * 2) / Math.max(1, values.length - 1);

    const pts = values.map((v, i) => {
      const x = pad + i * step;
      const y = pad + (1 - (v - min) / range) * (h - pad * 2);
      return [x, y] as const;
    });

    return pts
      .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(2)},${p[1].toFixed(2)}`)
      .join(" ");
  }, [values]);

  const stroke =
    up === null ? "stroke-white/30" : up ? "stroke-emerald-300/80" : "stroke-red-300/80";

  return (
    <svg width="64" height="22" viewBox="0 0 64 22" className="opacity-90">
      <path
        d={path}
        className={`${stroke}`}
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
