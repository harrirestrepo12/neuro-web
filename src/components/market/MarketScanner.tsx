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

type ScannerItem = Asset & {
  chg: number;
  spread: number;
  score: number;
};

function fmt(n: number, d = 2) {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(d);
}

function badge(kind: "good" | "warn" | "bad" | "info") {
  if (kind === "good") return "border-emerald-400/25 bg-emerald-500/10 text-emerald-200";
  if (kind === "warn") return "border-amber-400/25 bg-amber-500/10 text-amber-200";
  if (kind === "bad") return "border-rose-400/25 bg-rose-500/10 text-rose-200";
  return "border-sky-400/25 bg-sky-500/10 text-sky-200";
}

function tagTone(tag: AssetTag) {
  if (tag === "Forex") return "border-emerald-400/20 bg-emerald-500/10 text-emerald-200";
  if (tag === "Metales") return "border-amber-400/20 bg-amber-500/10 text-amber-200";
  if (tag === "Crypto") return "border-sky-400/20 bg-sky-500/10 text-sky-200";
  return "border-purple-400/20 bg-purple-500/10 text-purple-200";
}

function momentumTone(chg: number) {
  const abs = Math.abs(chg);
  if (abs >= 1.4) return "bad";
  if (abs >= 0.8) return "warn";
  return "good";
}

function changeClass(chg: number) {
  if (chg >= 1.2) return "text-emerald-200";
  if (chg >= 0) return "text-emerald-300";
  if (chg <= -1.2) return "text-rose-200";
  return "text-rose-300";
}

function buildBarWidth(value: number, max: number) {
  if (max <= 0) return "8%";
  const pct = Math.max(8, Math.min(100, (value / max) * 100));
  return `${pct}%`;
}

export default function MarketScanner({
  watchlist,
  rows,
  onPick,
}: {
  watchlist: Asset[];
  rows: Record<string, TickRow>;
  onPick: (sym: string) => void;
}) {
  const scan = useMemo(() => {
    const items: ScannerItem[] = watchlist.map((asset) => {
      const row = rows[asset.symbol];
      const chg = row?.chg ?? 0;
      const spread = row?.spread ?? 0;

      return {
        ...asset,
        chg,
        spread,
        score: Math.abs(chg) * 0.78 + spread * 0.22,
      };
    });

    const movers = [...items].sort((a, b) => b.score - a.score).slice(0, 6);
    const spreads = [...items].sort((a, b) => b.spread - a.spread).slice(0, 6);

    const maxMoverScore = movers.reduce((acc, item) => Math.max(acc, item.score), 0);
    const maxSpread = spreads.reduce((acc, item) => Math.max(acc, item.spread), 0);

    return { movers, spreads, maxMoverScore, maxSpread };
  }, [watchlist, rows]);

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,11,18,0.94)_0%,rgba(7,10,16,0.88)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(52,211,153,0.10),transparent_32%),radial-gradient(circle_at_88%_0%,rgba(251,191,36,0.08),transparent_30%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[1px] rounded-[27px] border border-white/5"
      />

      <div className="relative flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.85)]" />
            <div className="text-lg font-semibold text-white/92">Market Scanner</div>
          </div>

          <div className="mt-1 text-sm text-white/58">
            Prioriza dónde mirar primero: movimiento, presión y costo de ejecución.
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-3 py-1 text-[11px] ${badge("good")}`}>Momentum</span>
          <span className={`rounded-full border px-3 py-1 text-[11px] ${badge("warn")}`}>Costos</span>
          <span className={`rounded-full border px-3 py-1 text-[11px] ${badge("info")}`}>Lectura rápida</span>
        </div>
      </div>

      <div className="relative mt-5 grid gap-4 xl:grid-cols-2">
        <ScannerPanel
          title="Top movers"
          subtitle="Activos con mayor prioridad visual por score"
          badgeText="Momentum"
          badgeClass={badge("good")}
        >
          <div className="space-y-3">
            {scan.movers.map((item, index) => {
              const tone = momentumTone(item.chg);
              const progress = buildBarWidth(item.score, scan.maxMoverScore);

              return (
                <button
                  key={item.symbol}
                  type="button"
                  onClick={() => onPick(item.symbol)}
                  className="group/item relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.025)_100%)] p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-white/20"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05)_0%,transparent_50%)] opacity-70"
                  />

                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-[11px] font-semibold text-white/70">
                        #{index + 1}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-white/92">{item.symbol}</span>
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] ${tagTone(item.tag)}`}>
                            {item.tag}
                          </span>
                        </div>

                        <div className="mt-1 truncate text-[11px] text-white/50">{item.name}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-sm font-semibold ${changeClass(item.chg)}`}>
                        {item.chg >= 0 ? "▲ +" : "▼ "}
                        {fmt(item.chg, 2)}%
                      </div>
                      <div className="mt-1 text-[11px] text-white/45">score {fmt(item.score, 2)}</div>
                    </div>
                  </div>

                  <div className="relative mt-3">
                    <div className="h-2 rounded-full bg-white/5">
                      <div
                        className={[
                          "h-2 rounded-full transition-all",
                          tone === "bad"
                            ? "bg-rose-400/80 shadow-[0_0_16px_rgba(251,113,133,0.35)]"
                            : tone === "warn"
                              ? "bg-amber-400/80 shadow-[0_0_16px_rgba(251,191,36,0.28)]"
                              : "bg-emerald-400/80 shadow-[0_0_16px_rgba(52,211,153,0.28)]",
                        ].join(" ")}
                        style={{ width: progress }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScannerPanel>

        <ScannerPanel
          title="Alertas de spread"
          subtitle="Detecta costos altos antes de actuar"
          badgeText="Execution cost"
          badgeClass={badge("warn")}
        >
          <div className="space-y-3">
            {scan.spreads.map((item, index) => {
              const progress = buildBarWidth(item.spread, scan.maxSpread);

              return (
                <button
                  key={item.symbol}
                  type="button"
                  onClick={() => onPick(item.symbol)}
                  className="group/item relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.025)_100%)] p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-white/20"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05)_0%,transparent_50%)] opacity-70"
                  />

                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-[11px] font-semibold text-white/70">
                        S{index + 1}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-white/92">{item.symbol}</span>
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] ${tagTone(item.tag)}`}>
                            {item.tag}
                          </span>
                        </div>

                        <div className="mt-1 text-[11px] text-white/50">Costo relativo de ejecución</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-semibold text-white/86">sp {fmt(item.spread, 2)}</div>
                      <div className="mt-1 text-[11px] text-white/45">rank #{index + 1}</div>
                    </div>
                  </div>

                  <div className="relative mt-3">
                    <div className="h-2 rounded-full bg-white/5">
                      <div
                        className="h-2 rounded-full bg-amber-400/80 shadow-[0_0_16px_rgba(251,191,36,0.28)] transition-all"
                        style={{ width: progress }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScannerPanel>
      </div>

      <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
        <div className="text-xs text-white/55">
          El scanner debe responder una sola pregunta: <span className="text-white/78">¿dónde debo mirar primero?</span>
        </div>
        <div className="text-[11px] text-white/42">
          Próximo nivel: spread real, slippage, latencia y microestructura desde la conexión Neuro.
        </div>
      </div>
    </section>
  );
}

function ScannerPanel({
  title,
  subtitle,
  badgeText,
  badgeClass,
  children,
}: {
  title: string;
  subtitle: string;
  badgeText: string;
  badgeClass: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/30 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.26)]">
      <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <div className="text-sm font-semibold text-white/88">{title}</div>
          <div className="mt-1 text-[11px] text-white/48">{subtitle}</div>
        </div>

        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${badgeClass}`}>
          {badgeText}
        </span>
      </div>

      <div className="mt-4">{children}</div>
    </div>
  );
}
