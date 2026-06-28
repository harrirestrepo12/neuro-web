"use client";

import React, { useMemo } from "react";

type AssetTag = "Forex" | "Metales" | "Crypto" | "Índices";
type Asset = { symbol: string; name: string; tag: AssetTag };

type TickRow = {
  symbol: string;
  bid: number;
  ask: number;
  spread: number;
  chg: number;
  ts: number;
};

type HeatTile = Asset & {
  chg: number;
  spread: number;
  ts: number;
  intensity: number;
};

function fmt(n: number, d = 2) {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(d);
}

function toneLevel(chg: number) {
  const abs = Math.abs(chg);
  if (abs >= 1.2) return "strong";
  if (abs >= 0.6) return "mid";
  return "soft";
}

function tagTone(tag: AssetTag) {
  if (tag === "Forex") return "border-emerald-400/20 bg-emerald-500/10 text-emerald-200";
  if (tag === "Metales") return "border-amber-400/20 bg-amber-500/10 text-amber-200";
  if (tag === "Crypto") return "border-sky-400/20 bg-sky-500/10 text-sky-200";
  return "border-purple-400/20 bg-purple-500/10 text-purple-200";
}

function tileShellClass(chg: number) {
  const up = chg >= 0;
  const tone = toneLevel(chg);

  if (up && tone === "strong") {
    return "border-emerald-400/35 bg-[linear-gradient(180deg,rgba(16,185,129,0.18)_0%,rgba(16,185,129,0.08)_100%)]";
  }
  if (up && tone === "mid") {
    return "border-emerald-400/25 bg-[linear-gradient(180deg,rgba(16,185,129,0.12)_0%,rgba(16,185,129,0.05)_100%)]";
  }
  if (up) {
    return "border-emerald-400/15 bg-[linear-gradient(180deg,rgba(16,185,129,0.07)_0%,rgba(16,185,129,0.03)_100%)]";
  }

  if (!up && tone === "strong") {
    return "border-rose-400/35 bg-[linear-gradient(180deg,rgba(244,63,94,0.18)_0%,rgba(244,63,94,0.08)_100%)]";
  }
  if (!up && tone === "mid") {
    return "border-rose-400/25 bg-[linear-gradient(180deg,rgba(244,63,94,0.12)_0%,rgba(244,63,94,0.05)_100%)]";
  }
  return "border-rose-400/15 bg-[linear-gradient(180deg,rgba(244,63,94,0.07)_0%,rgba(244,63,94,0.03)_100%)]";
}

function changeClass(chg: number) {
  if (chg >= 1.2) return "text-emerald-200";
  if (chg >= 0) return "text-emerald-300";
  if (chg <= -1.2) return "text-rose-200";
  return "text-rose-300";
}

function signalLabel(chg: number) {
  const abs = Math.abs(chg);
  if (abs >= 1.2) return "Alta";
  if (abs >= 0.6) return "Media";
  return "Baja";
}

function buildIntensityWidth(chg: number) {
  const width = Math.min(100, Math.max(8, Math.round((Math.abs(chg) / 2.5) * 100)));
  return `${width}%`;
}

function freshnessLabel(ts: number) {
  if (!ts) return "Sin feed";
  return "Feed activo";
}

export default function MarketHeatmap({
  watchlist,
  rows,
  selectedSymbol,
  onPick,
}: {
  watchlist: Asset[];
  rows: Record<string, TickRow>;
  selectedSymbol: string;
  onPick: (sym: string) => void;
}) {
  const tiles = useMemo<HeatTile[]>(() => {
    return watchlist
      .map((asset) => {
        const row = rows[asset.symbol];
        const chg = row?.chg ?? 0;

        return {
          ...asset,
          chg,
          spread: row?.spread ?? 0,
          ts: row?.ts ?? 0,
          intensity: Math.abs(chg),
        };
      })
      .sort((a, b) => b.intensity - a.intensity);
  }, [watchlist, rows]);

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,11,18,0.94)_0%,rgba(7,10,16,0.88)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_82%_0%,rgba(168,85,247,0.08),transparent_28%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[1px] rounded-[27px] border border-white/5"
      />

      <div className="relative flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.8)]" />
            <div className="text-lg font-semibold text-white/92">Market Heatmap</div>
          </div>

          <div className="mt-1 text-sm text-white/58">
            Superficie de fuerza relativa para lectura rápida del mercado.
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/58">
            Click para seleccionar
          </span>
          <span className="rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1 text-[11px] text-sky-200">
            Overview
          </span>
        </div>
      </div>

      <div className="relative mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {tiles.map((tile) => {
          const active = tile.symbol === selectedSymbol;
          const positive = tile.chg >= 0;
          const barWidth = buildIntensityWidth(tile.chg);

          return (
            <button
              key={tile.symbol}
              type="button"
              onClick={() => onPick(tile.symbol)}
              className={[
                "group/tile relative overflow-hidden rounded-[24px] border p-4 text-left transition duration-300",
                "hover:-translate-y-0.5 hover:border-white/20",
                tileShellClass(tile.chg),
                active
                  ? "ring-1 ring-white/20 shadow-[0_0_70px_rgba(255,255,255,0.06)]"
                  : "shadow-[0_16px_40px_rgba(0,0,0,0.24)]",
              ].join(" ")}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,transparent_45%,transparent_100%)] opacity-80"
              />

              <div className="relative flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-white/92">{tile.symbol}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] ${tagTone(tile.tag)}`}>
                      {tile.tag}
                    </span>
                    {active ? (
                      <span className="rounded-full border border-white/15 bg-white/8 px-2 py-0.5 text-[10px] text-white/75">
                        Selected
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-1 truncate text-[11px] text-white/50">{tile.name}</div>
                </div>

                <div className="text-right">
                  <div className={`text-sm font-semibold ${changeClass(tile.chg)}`}>
                    {positive ? "▲ +" : "▼ "}
                    {fmt(tile.chg, 2)}%
                  </div>
                  <div className="mt-1 text-[11px] text-white/45">spread {fmt(tile.spread, 2)}</div>
                </div>
              </div>

              <div className="relative mt-4">
                <div className="flex items-center justify-between text-[11px] text-white/46">
                  <span>Intensidad</span>
                  <span>{signalLabel(tile.chg)}</span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/8">
                  <div
                    className={[
                      "h-full rounded-full transition-all",
                      positive
                        ? "bg-emerald-400/85 shadow-[0_0_16px_rgba(52,211,153,0.30)]"
                        : "bg-rose-400/85 shadow-[0_0_16px_rgba(251,113,133,0.30)]",
                    ].join(" ")}
                    style={{ width: barWidth }}
                  />
                </div>
              </div>

              <div className="relative mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-[11px] text-white/68">
                  Señal: {signalLabel(tile.chg)}
                </span>

                <span className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-[11px] text-white/68">
                  {freshnessLabel(tile.ts)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
        <div className="text-xs text-white/55">
          El heatmap debe responder: <span className="text-white/78">¿dónde está la presión del mercado ahora?</span>
        </div>
        <div className="text-[11px] text-white/42">
          Próximo nivel: intensidad por volatilidad, spread y microestructura real desde gateway.
        </div>
      </div>
    </section>
  );
}