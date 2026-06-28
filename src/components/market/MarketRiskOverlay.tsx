"use client";

import React, { useMemo } from "react";

type TickRow = {
  symbol: string;
  bid: number;
  ask: number;
  spread: number;
  chg: number;
  ts: number;
};

type WsState = "READY" | "CONNECTING" | "LIVE" | "ERROR";
type Tone = "ok" | "warn" | "bad";

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

function toneClass(tone: Tone) {
  if (tone === "ok") return "border-emerald-400/25 bg-emerald-500/10 text-emerald-200";
  if (tone === "warn") return "border-amber-400/25 bg-amber-500/10 text-amber-200";
  return "border-rose-400/25 bg-rose-500/10 text-rose-200";
}

function barClass(tone: Tone) {
  if (tone === "ok") return "bg-emerald-400/85 shadow-[0_0_16px_rgba(52,211,153,0.30)]";
  if (tone === "warn") return "bg-amber-400/85 shadow-[0_0_16px_rgba(251,191,36,0.28)]";
  return "bg-rose-400/85 shadow-[0_0_16px_rgba(251,113,133,0.30)]";
}

function buildBarWidth(value: number, max: number) {
  if (!Number.isFinite(value) || max <= 0) return "10%";
  const pct = Math.max(10, Math.min(100, (value / max) * 100));
  return `${pct}%`;
}

function recommendationTone(execTone: Tone, spreadTone: Tone, volTone: Tone): Tone {
  if (execTone === "bad" || spreadTone === "bad" || volTone === "bad") return "bad";
  if (execTone === "warn" || spreadTone === "warn" || volTone === "warn") return "warn";
  return "ok";
}

export default function MarketRiskOverlay({
  symbol,
  row,
  wsState,
}: {
  symbol: string;
  row?: TickRow;
  wsState: WsState;
}) {
  const spreadPips = useMemo(() => {
    if (!row) return null;
    return row.spread / pipValue(symbol);
  }, [row, symbol]);

  const spreadTone = useMemo<Tone>(() => {
    if (spreadPips == null) return "warn";
    const warn = spreadWarnPips(symbol);
    if (spreadPips >= warn * 1.6) return "bad";
    if (spreadPips >= warn) return "warn";
    return "ok";
  }, [spreadPips, symbol]);

  const volValue = Math.abs(row?.chg ?? 0);

  const volTone = useMemo<Tone>(() => {
    if (volValue >= 1.4) return "bad";
    if (volValue >= 0.8) return "warn";
    return "ok";
  }, [volValue]);

  const execTone = useMemo<Tone>(() => {
    if (wsState === "LIVE") return "ok";
    if (wsState === "CONNECTING" || wsState === "READY") return "warn";
    return "bad";
  }, [wsState]);

  const overallTone = recommendationTone(execTone, spreadTone, volTone);

  const recommendation = useMemo(() => {
    if (execTone === "bad") return "No operar todavía";
    if (spreadTone === "bad") return "Esperar mejor spread";
    if (volTone === "bad") return "Reducir riesgo / observar";
    if (spreadTone === "warn" || volTone === "warn" || execTone === "warn") return "Operar con cautela";
    return "Condición aceptable";
  }, [execTone, spreadTone, volTone]);

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,11,18,0.94)_0%,rgba(7,10,16,0.88)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(251,191,36,0.10),transparent_32%),radial-gradient(circle_at_82%_0%,rgba(244,63,94,0.08),transparent_28%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[1px] rounded-[27px] border border-white/5"
      />

      <div className="relative flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
            <div className="text-lg font-semibold text-white/92">Risk Overlay</div>
          </div>
          <div className="mt-1 text-sm text-white/58">
            Lectura rápida de ejecución, costo y presión antes de actuar.
          </div>
        </div>

        <span className={`rounded-full border px-3 py-1 text-[11px] font-medium ${toneClass(overallTone)}`}>
          {recommendation}
        </span>
      </div>

      <div className="relative mt-5 grid gap-4 md:grid-cols-3">
        <RiskMetric
          label="Execution"
          value={wsState}
          tone={execTone}
          detail={wsState === "LIVE" ? "Feed listo" : wsState === "CONNECTING" ? "Sincronizando" : wsState === "READY" ? "Standby operativo" : "Validar conexión"}
          width={buildBarWidth(wsState === "LIVE" ? 1 : wsState === "CONNECTING" ? 0.6 : wsState === "READY" ? 0.45 : 0.15, 1)}
        />

        <RiskMetric
          label="Spread"
          value={spreadPips == null ? "—" : `${fmt(spreadPips, isFxSymbol(symbol) ? 1 : 0)} pips`}
          tone={spreadTone}
          detail={`Símbolo ${symbol}`}
          width={buildBarWidth(spreadPips ?? 0, Math.max(spreadWarnPips(symbol) * 1.8, 1))}
        />

        <RiskMetric
          label="Volatilidad"
          value={row ? `${fmt(volValue, 2)}%` : "—"}
          tone={volTone}
          detail="Cambio relativo"
          width={buildBarWidth(volValue, 1.8)}
        />
      </div>

      <div className="relative mt-5 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
        <div className="text-xs text-white/55">
          Objetivo del panel: <span className="text-white/78">evitar decisiones impulsivas y leer contexto operativo antes de ejecutar.</span>
        </div>
      </div>
    </section>
  );
}

function RiskMetric({
  label,
  value,
  tone,
  detail,
  width,
}: {
  label: string;
  value: string;
  tone: Tone;
  detail: string;
  width: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/30 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.26)]">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-white/55">{label}</div>
        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${toneClass(tone)}`}>
          status
        </span>
      </div>

      <div className="mt-3 text-base font-semibold text-white/90">{value}</div>
      <div className="mt-1 text-[11px] text-white/45">{detail}</div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
        <div className={`h-full rounded-full ${barClass(tone)}`} style={{ width }} />
      </div>
    </div>
  );
}