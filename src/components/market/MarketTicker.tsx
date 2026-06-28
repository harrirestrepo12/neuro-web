// src/components/market/MarketTicker.tsx
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

type WsState = "READY" | "CONNECTING" | "LIVE" | "ERROR";

type TickerQuote = Asset & {
  bid: number;
  ask: number;
  spread: number;
  chg: number;
};

type SignalTone = "info" | "ok" | "warn" | "bad";

type SignalItem = {
  id: string;
  symbol: string;
  label: string;
  detail: string;
  tone: SignalTone;
  score: number;
};

function fmt(n: number, d = 2) {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(d);
}

function isFxSymbol(sym: string) {
  return sym.length === 6 && /^[A-Z]{6}$/.test(sym);
}

function digitsForSymbol(sym: string) {
  if (sym.includes("JPY")) return 3;
  if (isFxSymbol(sym)) return 5;
  if (sym.includes("XAU")) return 2;
  if (sym.includes("BTC")) return 2;
  if (sym.includes("US30")) return 1;
  return 2;
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

function toneByChg(chg: number) {
  const abs = Math.abs(chg);
  if (abs >= 1.2) return "strong";
  if (abs >= 0.6) return "mid";
  return "soft";
}

function quoteChangeClass(chg: number) {
  const up = chg >= 0;
  const tone = toneByChg(chg);

  if (up && tone === "strong") return "text-emerald-200";
  if (up && tone === "mid") return "text-emerald-300";
  if (up) return "text-emerald-300/90";

  if (!up && tone === "strong") return "text-rose-200";
  if (!up && tone === "mid") return "text-rose-300";
  return "text-rose-300/90";
}

function quoteGlowClass(chg: number) {
  const up = chg >= 0;
  const tone = toneByChg(chg);

  if (up && tone === "strong") return "shadow-[0_0_18px_rgba(52,211,153,0.16)]";
  if (up) return "shadow-[0_0_12px_rgba(52,211,153,0.10)]";
  if (!up && tone === "strong") return "shadow-[0_0_18px_rgba(251,113,133,0.16)]";
  return "shadow-[0_0_12px_rgba(251,113,133,0.10)]";
}

function wsPillClass(wsState: WsState) {
  if (wsState === "LIVE") return "border-emerald-400/25 bg-emerald-500/10 text-emerald-200";
  if (wsState === "CONNECTING") return "border-amber-400/25 bg-amber-500/10 text-amber-200";
  if (wsState === "ERROR") return "border-rose-400/25 bg-rose-500/10 text-rose-200";
  return "border-white/10 bg-white/5 text-white/70";
}

function activityDotClass(wsState: WsState) {
  if (wsState === "LIVE") return "bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.85)]";
  if (wsState === "CONNECTING") return "bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.75)]";
  if (wsState === "ERROR") return "bg-rose-400 shadow-[0_0_14px_rgba(251,113,133,0.75)]";
  return "bg-white/40";
}

function signalToneClass(tone: SignalTone) {
  if (tone === "ok") return "border-emerald-400/25 bg-emerald-500/10 text-emerald-200";
  if (tone === "warn") return "border-amber-400/25 bg-amber-500/10 text-amber-200";
  if (tone === "bad") return "border-rose-400/25 bg-rose-500/10 text-rose-200";
  return "border-sky-400/25 bg-sky-500/10 text-sky-200";
}

function buildSignals(quotes: TickerQuote[], wsState: WsState): SignalItem[] {
  const items: SignalItem[] = [];

  for (const quote of quotes) {
    const absChg = Math.abs(quote.chg);
    const spreadPips = Number.isFinite(quote.spread) ? quote.spread / pipValue(quote.symbol) : Number.NaN;
    const warnSpread = spreadWarnPips(quote.symbol);

    if (absChg >= 1.4) {
      items.push({
        id: `${quote.symbol}-vol-high`,
        symbol: quote.symbol,
        label: "Volatilidad alta",
        detail: `${fmt(absChg, 2)}%`,
        tone: "bad",
        score: 100 + absChg,
      });
    } else if (absChg >= 0.8) {
      items.push({
        id: `${quote.symbol}-vol-mid`,
        symbol: quote.symbol,
        label: "Momentum activo",
        detail: `${fmt(absChg, 2)}%`,
        tone: "warn",
        score: 70 + absChg,
      });
    }

    if (Number.isFinite(spreadPips)) {
      if (spreadPips >= warnSpread * 1.6) {
        items.push({
          id: `${quote.symbol}-spread-bad`,
          symbol: quote.symbol,
          label: "Spread peligroso",
          detail: `${fmt(spreadPips, isFxSymbol(quote.symbol) ? 1 : 0)} pips`,
          tone: "bad",
          score: 95 + spreadPips,
        });
      } else if (spreadPips >= warnSpread) {
        items.push({
          id: `${quote.symbol}-spread-warn`,
          symbol: quote.symbol,
          label: "Spread elevado",
          detail: `${fmt(spreadPips, isFxSymbol(quote.symbol) ? 1 : 0)} pips`,
          tone: "warn",
          score: 60 + spreadPips,
        });
      } else {
        items.push({
          id: `${quote.symbol}-spread-ok`,
          symbol: quote.symbol,
          label: "Spread limpio",
          detail: `${fmt(spreadPips, isFxSymbol(quote.symbol) ? 1 : 0)} pips`,
          tone: "ok",
          score: 20,
        });
      }
    }
  }

  items.push({
    id: `ws-${wsState.toLowerCase()}`,
    symbol: "SYSTEM",
    label: wsState === "LIVE" ? "Feed estable" : wsState === "CONNECTING" ? "Sincronizando feed" : wsState === "ERROR" ? "Fallback disponible" : "Standby operativo",
    detail: `WS ${wsState}`,
    tone: wsState === "LIVE" ? "ok" : wsState === "ERROR" ? "warn" : "info",
    score: wsState === "LIVE" ? 90 : 50,
  });

  return items.sort((a, b) => b.score - a.score).slice(0, 10);
}

export default function MarketTicker({
  watchlist,
  rows,
  wsState,
}: {
  watchlist: Asset[];
  rows: Record<string, TickRow>;
  wsState: WsState;
}) {
  const quotes = useMemo<TickerQuote[]>(() => {
    const enriched = watchlist
      .map((asset) => {
        const row = rows[asset.symbol];
        return {
          ...asset,
          bid: row?.bid ?? Number.NaN,
          ask: row?.ask ?? Number.NaN,
          spread: row?.spread ?? Number.NaN,
          chg: row?.chg ?? 0,
        };
      })
      .sort((a, b) => Math.abs(b.chg) - Math.abs(a.chg));

    return enriched.slice(0, Math.min(10, enriched.length));
  }, [watchlist, rows]);

  const signals = useMemo(() => buildSignals(quotes, wsState), [quotes, wsState]);

  const quoteRail = useMemo(() => [...quotes, ...quotes], [quotes]);
  const signalRail = useMemo(() => [...signals, ...signals], [signals]);

  const wsPill = wsPillClass(wsState);
  const dotClass = activityDotClass(wsState);

  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,12,18,0.94)_0%,rgba(6,10,16,0.88)_100%)] shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(52,211,153,0.13),transparent_30%),radial-gradient(circle_at_55%_0%,rgba(59,130,246,0.10),transparent_34%),radial-gradient(circle_at_88%_0%,rgba(168,85,247,0.08),transparent_28%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[1px] rounded-[27px] border border-white/5"
      />

      <div className="relative flex flex-wrap items-center gap-3 px-4 py-3 md:px-5">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/78">
            Neuro Market Feed
          </span>
        </div>

        <div className={`rounded-full border px-3 py-1 text-[11px] font-medium ${wsPill}`}>
          WS: {wsState}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Badge text="No custodio" />
          <Badge text="Risk-aware" />
          <Badge text="Realtime" />
          <Badge text="Terminal mode" />
        </div>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] text-white/55">
            Quotes + señales
          </div>
          <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] text-white/55">
            Hover pausa feed
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#060a10] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#060a10] to-transparent" />

        <div className="relative border-b border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.00)_100%)]">
          <div className="absolute left-4 top-3 z-10 hidden rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45 md:block">
            Quotes
          </div>

          <div className="ticker-mask py-3 pl-0 md:pl-16 [perspective:1400px]">
            <div className="ticker-lane ticker-lane-quotes">
              {quoteRail.map((item, idx) => {
                const up = item.chg >= 0;
                const chgClass = quoteChangeClass(item.chg);
                const itemGlow = quoteGlowClass(item.chg);

                return (
                  <article
                    key={`${item.symbol}-quote-${idx}`}
                    className={[
                      "ticker-card relative mx-2 inline-flex min-w-[240px] items-center gap-3 rounded-2xl border border-white/10",
                      "bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.03)_100%)]",
                      "px-4 py-3 text-left backdrop-blur-md transition-transform duration-300",
                      "hover:-translate-y-0.5 hover:border-white/20",
                      itemGlow,
                    ].join(" ")}
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.01)_45%,transparent_100%)]"
                    />

                    <div className="relative flex min-w-0 flex-1 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/72">
                        {item.tag.slice(0, 2)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-semibold text-white/92">{item.symbol}</span>
                          <span className="rounded-full border border-white/10 bg-black/25 px-2 py-0.5 text-[10px] text-white/45">
                            {item.tag}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center gap-3 text-[11px] text-white/52">
                          <span>bid {Number.isFinite(item.bid) ? fmt(item.bid, digitsForSymbol(item.symbol)) : "—"}</span>
                          <span>ask {Number.isFinite(item.ask) ? fmt(item.ask, digitsForSymbol(item.symbol)) : "—"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative flex shrink-0 flex-col items-end">
                      <span className={`text-sm font-semibold ${chgClass}`}>
                        {up ? "▲" : "▼"} {up ? "+" : ""}
                        {fmt(item.chg, 2)}%
                      </span>
                      <span className="mt-1 text-[11px] text-white/45">
                        spr {Number.isFinite(item.spread) ? fmt(item.spread, 2) : "—"}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative bg-[linear-gradient(180deg,rgba(255,255,255,0.01)_0%,rgba(255,255,255,0.00)_100%)]">
          <div className="absolute left-4 top-3 z-10 hidden rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45 md:block">
            Signals
          </div>

          <div className="ticker-mask py-3 pl-0 md:pl-16">
            <div className="ticker-lane ticker-lane-signals">
              {signalRail.map((signal, idx) => (
                <article
                  key={`${signal.id}-${idx}`}
                  className="mx-2 inline-flex min-w-[220px] items-center gap-3 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.025)_100%)] px-4 py-3 backdrop-blur-md transition-transform duration-300 hover:-translate-y-0.5 hover:border-white/20"
                >
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${signalToneClass(signal.tone)}`}
                  >
                    {signal.symbol}
                  </span>

                  <div className="min-w-0">
                    <div className="truncate text-[12px] font-semibold text-white/88">{signal.label}</div>
                    <div className="mt-1 truncate text-[11px] text-white/48">{signal.detail}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ticker-mask {
          overflow: hidden;
          width: 100%;
        }

        .ticker-lane {
          display: inline-flex;
          width: max-content;
          white-space: nowrap;
          will-change: transform;
          transform: translate3d(0, 0, 0);
        }

        .ticker-lane-quotes {
          animation: neuro-ticker-quotes 34s linear infinite;
        }

        .ticker-lane-signals {
          animation: neuro-ticker-signals 42s linear infinite;
        }

        .group:hover .ticker-lane {
          animation-play-state: paused;
        }

        .ticker-card {
          transform: translateZ(0) rotateX(0.0001deg);
        }

        @keyframes neuro-ticker-quotes {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        @keyframes neuro-ticker-signals {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        @media (max-width: 768px) {
          .ticker-lane-quotes {
            animation-duration: 24s;
          }

          .ticker-lane-signals {
            animation-duration: 30s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ticker-lane {
            animation: none !important;
            transform: translate3d(0, 0, 0) !important;
          }
        }
      `}</style>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/58">
      {text}
    </span>
  );
}