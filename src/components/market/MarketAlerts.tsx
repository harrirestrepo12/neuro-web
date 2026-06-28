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

type AlertItem = {
  symbol: string;
  title: string;
  detail: string;
  level: "info" | "warn" | "bad";
  score: number;
};

function fmt(n: number, d = 2) {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(d);
}

function isFxSymbol(sym: string) {
  return sym.length === 6 && /^[A-Z]{6}$/.test(sym);
}

function pipValue(sym: string) {
  if (sym.includes("JPY")) return 0.01;
  if (isFxSymbol(sym)) return 0.0001;
  if (sym.includes("XAU")) return 0.1;
  if (sym.includes("BTC")) return 1;
  return 1;
}

function spreadWarnPips(sym: string) {
  if (isFxSymbol(sym)) return 2.2;
  if (sym.includes("XAU")) return 35;
  if (sym.includes("BTC")) return 120;
  if (sym.includes("NAS")) return 10;
  if (sym.includes("US30")) return 25;
  return 10;
}

function levelClass(level: AlertItem["level"]) {
  if (level === "bad") return "border-rose-400/25 bg-rose-500/10 text-rose-200";
  if (level === "warn") return "border-amber-400/25 bg-amber-500/10 text-amber-200";
  return "border-sky-400/25 bg-sky-500/10 text-sky-200";
}

function levelDot(level: AlertItem["level"]) {
  if (level === "bad") return "bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.75)]";
  if (level === "warn") return "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.75)]";
  return "bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.75)]";
}

export default function MarketAlerts({
  watchlist,
  rows,
  onPick,
}: {
  watchlist: Asset[];
  rows: Record<string, TickRow>;
  onPick: (symbol: string) => void;
}) {
  const alerts = useMemo<AlertItem[]>(() => {
    const list: AlertItem[] = [];

    for (const asset of watchlist) {
      const row = rows[asset.symbol];
      if (!row) continue;

      const absChg = Math.abs(row.chg);
      const spreadPips = row.spread / pipValue(asset.symbol);
      const spreadWarn = spreadWarnPips(asset.symbol);

      if (absChg >= 1.4) {
        list.push({
          symbol: asset.symbol,
          title: "Volatilidad alta",
          detail: `${asset.symbol} se mueve ${fmt(absChg, 2)}%`,
          level: "bad",
          score: absChg + 3,
        });
      } else if (absChg >= 0.8) {
        list.push({
          symbol: asset.symbol,
          title: "Volatilidad media",
          detail: `${asset.symbol} se mueve ${fmt(absChg, 2)}%`,
          level: "warn",
          score: absChg + 2,
        });
      }

      if (spreadPips >= spreadWarn * 1.6) {
        list.push({
          symbol: asset.symbol,
          title: "Spread peligroso",
          detail: `${fmt(spreadPips, isFxSymbol(asset.symbol) ? 1 : 0)} pips`,
          level: "bad",
          score: spreadPips + 2,
        });
      } else if (spreadPips >= spreadWarn) {
        list.push({
          symbol: asset.symbol,
          title: "Spread elevado",
          detail: `${fmt(spreadPips, isFxSymbol(asset.symbol) ? 1 : 0)} pips`,
          level: "warn",
          score: spreadPips + 1,
        });
      }

      if (row.ts > 0) {
        list.push({
          symbol: asset.symbol,
          title: "Feed activo",
          detail: new Date(row.ts).toLocaleTimeString(undefined, { hour12: false }),
          level: "info",
          score: 0.1,
        });
      }
    }

    return list.sort((a, b) => b.score - a.score).slice(0, 8);
  }, [watchlist, rows]);

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,11,18,0.94)_0%,rgba(7,10,16,0.88)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_0%,rgba(56,189,248,0.10),transparent_30%),radial-gradient(circle_at_86%_0%,rgba(251,191,36,0.08),transparent_26%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[1px] rounded-[27px] border border-white/5"
      />

      <div className="relative flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.8)]" />
            <div className="text-lg font-semibold text-white/92">Alerts Center</div>
          </div>
          <div className="mt-1 text-sm text-white/58">
            Alertas visuales para priorizar contexto antes de actuar.
          </div>
        </div>

        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/70">
          {alerts.length} alerts
        </span>
      </div>

      <div className="relative mt-5 grid gap-3">
        {alerts.map((alert, idx) => (
          <button
            key={`${alert.symbol}-${alert.title}-${idx}`}
            type="button"
            onClick={() => onPick(alert.symbol)}
            className="group/alert relative overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.025)_100%)] p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-white/20"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05)_0%,transparent_48%)] opacity-80"
            />

            <div className="relative flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${levelDot(alert.level)}`} />

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-white/92">{alert.symbol}</span>
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${levelClass(alert.level)}`}>
                      {alert.title}
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-white/72">{alert.detail}</div>
                </div>
              </div>

              <span className="text-[11px] text-white/40 transition group-hover/alert:text-white/62">
                Ver
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="relative mt-5 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-xs text-white/55">
        Las alertas deben ayudarte a decidir <span className="text-white/78">qué merece atención primero</span>, no saturarte con ruido.
      </div>
    </section>
  );
}