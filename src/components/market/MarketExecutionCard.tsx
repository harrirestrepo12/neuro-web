"use client";

import React from "react";
import FXButtonPro from "@/components/site/FXButtonPro";

type WsState = "READY" | "CONNECTING" | "LIVE" | "ERROR";

function tone(wsState: WsState) {
  if (wsState === "LIVE") return "border-emerald-400/25 bg-emerald-500/10 text-emerald-200";
  if (wsState === "CONNECTING") return "border-amber-400/25 bg-amber-500/10 text-amber-200";
  if (wsState === "ERROR") return "border-rose-400/25 bg-rose-500/10 text-rose-200";
  return "border-white/10 bg-white/5 text-white/70";
}

function dot(wsState: WsState) {
  if (wsState === "LIVE") return "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]";
  if (wsState === "CONNECTING") return "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.75)]";
  if (wsState === "ERROR") return "bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.75)]";
  return "bg-white/40";
}

export default function MarketExecutionCard({
  symbol,
  wsState,
}: {
  symbol: string;
  wsState: WsState;
}) {
  const live = wsState === "LIVE";

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,11,18,0.94)_0%,rgba(7,10,16,0.88)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(52,211,153,0.10),transparent_30%),radial-gradient(circle_at_88%_0%,rgba(59,130,246,0.08),transparent_28%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[1px] rounded-[27px] border border-white/5"
      />

      <div className="relative flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${dot(wsState)}`} />
            <div className="text-lg font-semibold text-white/92">Execution Readiness</div>
          </div>
          <div className="mt-1 text-sm text-white/58">
            Estado operativo antes de abrir flujo hacia trading.
          </div>
        </div>

        <span className={`rounded-full border px-3 py-1 text-[11px] font-medium ${tone(wsState)}`}>
          {live ? "Listo" : wsState === "READY" ? "Listo" : wsState}
        </span>
      </div>

      <div className="relative mt-5 grid gap-4 sm:grid-cols-2">
        <ExecutionBox label="Símbolo" value={symbol} detail="Activo seleccionado" />
        <ExecutionBox
          label="Modo recomendado"
          value={live ? "Operación asistida" : "Observación / demo"}
          detail={live ? "Feed estable para continuar" : "Validar condiciones primero"}
        />
      </div>

      <div className="relative mt-5 grid gap-3 rounded-2xl border border-white/10 bg-black/25 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-white/55">Estado de flujo</div>
          <div className="text-[11px] text-white/42">Market → Charts → Trading</div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <FlowNode label="Market" active />
          <FlowNode label="Charts" active={live || wsState === "CONNECTING"} />
          <FlowNode label="Trading" active={live} />
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap gap-3">
        <FXButtonPro href={`/trading?symbol=${symbol}`} variant={live ? "primary" : "outline"} size="sm">
          {live ? "Operar ahora" : "Ir a trading"}
        </FXButtonPro>

        <FXButtonPro href={`/charts?symbol=${symbol}`} variant="secondary" size="sm">
          Abrir gráfico
        </FXButtonPro>

        <FXButtonPro href="/security" variant="ghost" size="sm">
          Validar seguridad
        </FXButtonPro>
      </div>

      <p className="relative mt-4 text-xs text-white/50">
        Neuro prioriza ejecución clara, no impulsiva. Si el feed no está estable, primero observar.
      </p>
    </section>
  );
}

function ExecutionBox({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/30 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.26)]">
      <div className="text-xs text-white/55">{label}</div>
      <div className="mt-2 text-base font-semibold text-white/92">{value}</div>
      <div className="mt-1 text-[11px] text-white/45">{detail}</div>
    </div>
  );
}

function FlowNode({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={[
        "rounded-2xl border px-3 py-3 text-center text-xs font-medium transition",
        active
          ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-200"
          : "border-white/10 bg-white/5 text-white/45",
      ].join(" ")}
    >
      {label}
    </div>
  );
}