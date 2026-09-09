// src/app/market/page.tsx
"use client";

import React, { useEffect, useMemo, useRef, useSyncExternalStore, useState } from "react";
import Navbar from "@/components/site/Navbar";
import FXBackground from "@/components/site/FXBackground";
import Container from "@/components/layout/Container";
import FXButtonPro from "@/components/site/FXButtonPro";
import Panel3D from "@/components/site/Panel3D";
import { NEURO_REGISTER_URL } from "@/lib/neuroLinks";

import MarketTicker from "@/components/market/MarketTicker";
import MarketScanner from "@/components/market/MarketScanner";
import MarketHeatmap from "@/components/market/MarketHeatmap";
import MarketRiskOverlay from "@/components/market/MarketRiskOverlay";
import MarketAlerts from "@/components/market/MarketAlerts";
import MarketExecutionCard from "@/components/market/MarketExecutionCard";

type AssetTag = "Forex" | "Metales" | "Crypto" | "Índices";
type Asset = { symbol: string; name: string; tag: AssetTag };

const WATCHLIST: Asset[] = [
  { symbol: "EURUSD", name: "Euro / US Dollar", tag: "Forex" },
  { symbol: "USDJPY", name: "US Dollar / Japanese Yen", tag: "Forex" },
  { symbol: "XAUUSD", name: "Gold / US Dollar", tag: "Metales" },
  { symbol: "BTCUSD", name: "Bitcoin / US Dollar", tag: "Crypto" },
  { symbol: "NAS100", name: "Nasdaq 100", tag: "Índices" },
  { symbol: "US30", name: "Dow Jones", tag: "Índices" },
];

type Mode = "WS_REAL" | "DEMO";
type WsState = "READY" | "CONNECTING" | "LIVE" | "ERROR";

type TickRow = {
  symbol: string;
  bid: number;
  ask: number;
  spread: number;
  chg: number;
  ts: number;
};

type SortKey = "symbol" | "chg" | "spread";
type SortDir = "asc" | "desc";

/* =========================
   Utils
========================= */
function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function fmt(n: number, d = 2) {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(d);
}

function nowMs() {
  return Date.now();
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

function basePriceFor(sym: string) {
  if (sym === "EURUSD") return 1.085;
  if (sym === "USDJPY") return 148.2;
  if (sym === "XAUUSD") return 2035;
  if (sym === "BTCUSD") return 52000;
  if (sym === "NAS100") return 17500;
  if (sym === "US30") return 38750;
  return 100;
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

function safeSym(s: unknown) {
  return String(s ?? "").trim().toUpperCase();
}

function tagStyle(tag: AssetTag) {
  switch (tag) {
    case "Forex":
      return "border-emerald-400/25 bg-emerald-500/10 text-emerald-200";
    case "Metales":
      return "border-amber-400/25 bg-amber-500/10 text-amber-200";
    case "Crypto":
      return "border-sky-400/25 bg-sky-500/10 text-sky-200";
    case "Índices":
      return "border-purple-400/25 bg-purple-500/10 text-purple-200";
    default:
      return "border-white/10 bg-white/5 text-white/70";
  }
}

function statusStyle(s: WsState) {
  if (s === "LIVE") return "border-emerald-400/25 bg-emerald-500/10 text-emerald-200";
  if (s === "CONNECTING") return "border-amber-400/25 bg-amber-500/10 text-amber-200";
  if (s === "ERROR") return "border-rose-400/25 bg-rose-500/10 text-rose-200";
  return "border-white/10 bg-white/5 text-white/70";
}

function pillTone(kind: "ok" | "warn" | "bad") {
  if (kind === "ok") return "border-emerald-400/25 bg-emerald-500/10 text-emerald-200";
  if (kind === "warn") return "border-amber-400/25 bg-amber-500/10 text-amber-200";
  return "border-rose-400/25 bg-rose-500/10 text-rose-200";
}

function selectSymbol(symbol: string, setSelected: React.Dispatch<React.SetStateAction<Asset>>) {
  const found = WATCHLIST.find((x) => x.symbol === symbol) ?? WATCHLIST[0];
  setSelected(found);
  marketStore.setSelectedSymbol(found.symbol);
}

/* =========================
   Sparkline
========================= */
function Sparkline({ points }: { points: number[] }) {
  const w = 120;
  const h = 26;

  if (!points.length) {
    return <div className="h-6.5 w-30 rounded-lg border border-white/10 bg-white/5" />;
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = Math.max(1e-9, max - min);

  const d = points
    .map((v, i) => {
      const x = (i / Math.max(1, points.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 2) - 1;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  const up = points[points.length - 1] >= points[0];

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="rounded-lg border border-white/10 bg-black/25">
      <path
        d={d}
        fill="none"
        stroke={up ? "rgba(52,211,153,0.9)" : "rgba(251,113,133,0.9)"}
        strokeWidth={2}
      />
    </svg>
  );
}

/* =========================
   Unified Store (DEMO + WS_REAL)
========================= */
type MarketSnapshot = {
  mode: Mode;
  wsState: WsState;
  rows: Record<string, TickRow>;
  sparkBySymbol: Record<string, number[]>;
  feed: string[];
  lastTickTs: number | null;
  selectedSymbol: string;
  wsUrl: string;
};

function seedSnapshot(): Pick<MarketSnapshot, "rows" | "sparkBySymbol" | "feed" | "lastTickTs"> {
  const rows: Record<string, TickRow> = {};
  const sparkBySymbol: Record<string, number[]> = {};
  const ts = nowMs();

  for (const a of WATCHLIST) {
    const base = basePriceFor(a.symbol);
    const bid = base * (1 + (Math.random() - 0.5) * 0.001);
    const ask = bid + base * 0.00006;
    const spread = ask - bid;

    rows[a.symbol] = {
      symbol: a.symbol,
      bid,
      ask,
      spread,
      chg: (Math.random() - 0.5) * 0.35,
      ts,
    };
    sparkBySymbol[a.symbol] = [(bid + ask) / 2];
  }

  return { rows, sparkBySymbol, feed: [], lastTickTs: null };
}

function resolveWsUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_NEURO_WS_URL;
  const url =
    typeof envUrl === "string" && envUrl.trim()
      ? envUrl.trim()
      : "ws://localhost:8787/?accountId=default&stream=ticks";
  return url;
}

type TickMessage = {
  type: "tick";
  data: { symbol: unknown; bid: unknown; ask: unknown; ts?: unknown };
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isTickMessage(v: unknown): v is TickMessage {
  if (!isRecord(v)) return false;
  if (v.type !== "tick") return false;
  if (!isRecord(v.data)) return false;
  return true;
}

function createMarketStore() {
  const initialSeed = seedSnapshot();

  let snap: MarketSnapshot = {
    mode: "WS_REAL",
    wsState: "READY",
    ...initialSeed,
    selectedSymbol: WATCHLIST[0].symbol,
    wsUrl: resolveWsUrl(),
  };

  const listeners = new Set<() => void>();

  let demoInterval: number | null = null;
  let demoConnectTimeout: number | null = null;

  let ws: WebSocket | null = null;
  let wsConnectAttempt = 0;
  let wsFallbackTimeout: number | null = null;

  function emit() {
    for (const l of listeners) l();
  }

  function setSnap(next: Partial<MarketSnapshot>) {
    snap = { ...snap, ...next };
    emit();
  }

  function stopDemo() {
    if (demoConnectTimeout != null) window.clearTimeout(demoConnectTimeout);
    demoConnectTimeout = null;

    if (demoInterval != null) window.clearInterval(demoInterval);
    demoInterval = null;
  }

  function startDemo() {
    stopDemo();

    if (!snap.rows || !Object.keys(snap.rows).length) {
      const s = seedSnapshot();
      setSnap({ ...s });
    }

    setSnap({ mode: "DEMO", wsState: "CONNECTING" });

    demoConnectTimeout = window.setTimeout(() => {
      setSnap({ wsState: "LIVE" });
    }, 650);

    demoInterval = window.setInterval(() => {
      const symbols = WATCHLIST.map((x) => x.symbol);
      const nextRows = { ...snap.rows };
      const nextSpark = { ...snap.sparkBySymbol };
      const ts = nowMs();

      for (let i = 0; i < 2; i++) {
        const sym = symbols[Math.floor(Math.random() * symbols.length)];
        const r = nextRows[sym];
        if (!r) continue;

        const mid = (r.bid + r.ask) / 2;
        const drift = (Math.random() - 0.5) * mid * 0.00035;
        const newMid = Math.max(0.0000001, mid + drift);

        const spV = (Math.random() - 0.5) * r.spread * 0.25;
        const spread = Math.max(r.spread * 0.6, r.spread + spV);

        const bid = newMid - spread / 2;
        const ask = newMid + spread / 2;

        const chg = clamp((r.chg ?? 0) + (Math.random() - 0.5) * 0.06, -2.5, 2.5);

        nextRows[sym] = { symbol: sym, bid, ask, spread, chg, ts };

        const arr = nextSpark[sym] ?? [];
        nextSpark[sym] = [...arr, (bid + ask) / 2].slice(-28);
      }

      const stamp = new Date(ts).toLocaleTimeString(undefined, { hour12: false });
      const nextFeed = [`[${stamp}] demo tick • status:${snap.wsState}`, ...snap.feed].slice(0, 24);

      setSnap({
        rows: nextRows,
        sparkBySymbol: nextSpark,
        feed: nextFeed,
        lastTickTs: ts,
      });
    }, 450);
  }

  function stopWs() {
    if (wsFallbackTimeout != null) window.clearTimeout(wsFallbackTimeout);
    wsFallbackTimeout = null;

    try {
      ws?.close();
    } catch {
      // noop
    }
    ws = null;
  }

  function applyTick(symRaw: unknown, bidRaw: unknown, askRaw: unknown, tsRaw: unknown) {
    const sym = safeSym(symRaw);
    const bid = Number(bidRaw);
    const ask = Number(askRaw);
    const ts = Number(tsRaw ?? nowMs());

    if (!sym || !Number.isFinite(bid) || !Number.isFinite(ask)) return;

    const prev = snap.rows?.[sym];
    const spread = Math.max(0, ask - bid);

    const chg =
      prev?.chg != null
        ? clamp(prev.chg + (Math.random() - 0.5) * 0.02, -2.5, 2.5)
        : clamp((Math.random() - 0.5) * 0.35, -2.5, 2.5);

    const nextRows = { ...snap.rows, [sym]: { symbol: sym, bid, ask, spread, chg, ts } };

    const prevSpark = snap.sparkBySymbol?.[sym] ?? [];
    const mid = (bid + ask) / 2;
    const nextSpark = { ...snap.sparkBySymbol, [sym]: [...prevSpark, mid].slice(-28) };

    const stamp = new Date(ts).toLocaleTimeString(undefined, { hour12: false });
    const nextFeed = [`[${stamp}] ${sym} tick • mode:${snap.mode}`, ...snap.feed].slice(0, 24);

    setSnap({
      rows: nextRows,
      sparkBySymbol: nextSpark,
      feed: nextFeed,
      lastTickTs: ts,
    });
  }

  function wsSubscribeSelected() {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(
      JSON.stringify({
        type: "SUBSCRIBE",
        stream: "ticks",
        symbol: snap.selectedSymbol,
        accountId: "default",
      })
    );
  }

  function startWsReal() {
    stopDemo();
    stopWs();

    setSnap({ mode: "WS_REAL", wsState: "CONNECTING" });

    wsConnectAttempt += 1;
    const attempt = wsConnectAttempt;

    wsFallbackTimeout = window.setTimeout(() => {
      if (snap.mode === "WS_REAL" && (snap.wsState === "CONNECTING" || snap.wsState === "ERROR")) {
        startDemo();
      }
    }, 1600);

    try {
      ws = new WebSocket(snap.wsUrl);

      ws.onopen = () => {
        if (attempt !== wsConnectAttempt) return;
        setSnap({ wsState: "LIVE" });
        wsSubscribeSelected();
      };

      ws.onmessage = (ev) => {
        let msg: unknown = null;
        try {
          msg = JSON.parse(String(ev.data ?? ""));
        } catch {
          return;
        }

        if (isTickMessage(msg)) {
          applyTick(msg.data.symbol, msg.data.bid, msg.data.ask, msg.data.ts);
        }
      };

      ws.onerror = () => {
        if (attempt !== wsConnectAttempt) return;
        setSnap({ wsState: "ERROR" });
        startDemo();
      };

      ws.onclose = () => {
        if (attempt !== wsConnectAttempt) return;
        setSnap({ wsState: "READY" });
        startDemo();
      };
    } catch {
      setSnap({ wsState: "ERROR" });
      startDemo();
    }
  }

  function ensureRunning() {
    if (typeof window === "undefined") return;
    if (snap.mode === "WS_REAL") startWsReal();
    else startDemo();
  }

  return {
    getSnapshot: () => snap,
    getServerSnapshot: () => {
      const seeded = seedSnapshot();
      return {
        mode: "WS_REAL" as Mode,
        wsState: "READY" as WsState,
        ...seeded,
        selectedSymbol: WATCHLIST[0].symbol,
        wsUrl: resolveWsUrl(),
      };
    },
    subscribe: (cb: () => void) => {
      listeners.add(cb);
      ensureRunning();
      return () => {
        listeners.delete(cb);
        if (listeners.size === 0) {
          stopDemo();
          stopWs();
        }
      };
    },
    setSelectedSymbol: (symbol: string) => {
      const sym = safeSym(symbol) || WATCHLIST[0].symbol;
      if (sym === snap.selectedSymbol) return;
      setSnap({ selectedSymbol: sym });
      if (snap.mode === "WS_REAL" && snap.wsState === "LIVE") wsSubscribeSelected();
    },
    setMode: (mode: Mode) => {
      if (mode === snap.mode) return;
      if (typeof window === "undefined") {
        setSnap({ mode });
        return;
      }
      if (mode === "WS_REAL") startWsReal();
      else startDemo();
    },
    setWsUrl: (url: string) => {
      const u = String(url || "").trim();
      if (!u) return;
      setSnap({ wsUrl: u });
      if (typeof window !== "undefined" && snap.mode === "WS_REAL") startWsReal();
    },
    reconnect: () => {
      if (typeof window === "undefined") return;
      if (snap.mode === "WS_REAL") startWsReal();
      else startDemo();
    },
  };
}

const marketStore = createMarketStore();

/* =========================
   Page
========================= */
export default function MarketPage() {
  const [selected, setSelected] = useState<Asset>(WATCHLIST[0]);

  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState<AssetTag | "Todos">("Todos");
  const [sortKey, setSortKey] = useState<SortKey>("symbol");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const snap = useSyncExternalStore(
    marketStore.subscribe,
    marketStore.getSnapshot,
    marketStore.getServerSnapshot
  );

  const feedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = feedRef.current;
    if (!el) return;
    el.scrollTop = 0;
  }, [snap.feed]);

  const rows = snap.rows;
  const wsState = snap.wsState;
  const sparkBySymbol = snap.sparkBySymbol;
  const feed = snap.feed;
  const lastTickTs = snap.lastTickTs;

  const selectedRow = rows[selected.symbol];
  const selectedDigits = digitsForSymbol(selected.symbol);
  const selectedSpark = sparkBySymbol[selected.symbol] ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toUpperCase();
    return WATCHLIST.filter((a) => {
      const okTag = tagFilter === "Todos" ? true : a.tag === tagFilter;
      const okQ = !q ? true : a.symbol.includes(q) || a.name.toUpperCase().includes(q);
      return okTag && okQ;
    });
  }, [query, tagFilter]);

  const sorted = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    const arr = [...filtered];

    arr.sort((aa, bb) => {
      if (sortKey === "symbol") return aa.symbol.localeCompare(bb.symbol) * dir;
      const ra = rows[aa.symbol];
      const rb = rows[bb.symbol];
      const va = sortKey === "chg" ? (ra?.chg ?? 0) : (ra?.spread ?? 0);
      const vb = sortKey === "chg" ? (rb?.chg ?? 0) : (rb?.spread ?? 0);
      return (va - vb) * dir;
    });

    return arr;
  }, [filtered, sortKey, sortDir, rows]);

  const spreadPips = useMemo(() => {
    if (!selectedRow) return null;
    return selectedRow.spread / pipValue(selected.symbol);
  }, [selectedRow, selected.symbol]);

  const spreadTone: "ok" | "warn" | "bad" = useMemo(() => {
    if (spreadPips == null) return "ok";
    const warn = spreadWarnPips(selected.symbol);
    if (spreadPips >= warn * 1.6) return "bad";
    if (spreadPips >= warn) return "warn";
    return "ok";
  }, [spreadPips, selected.symbol]);

  const volTone: "ok" | "warn" | "bad" = useMemo(() => {
    const chg = selectedRow?.chg ?? 0;
    const a = Math.abs(chg);
    if (a >= 1.4) return "bad";
    if (a >= 0.8) return "warn";
    return "ok";
  }, [selectedRow?.chg]);

  return (
    <FXBackground imageSrc="/ai/neuro-bg.jpg" className="min-h-screen" imageOpacity={0.34}>
      <div className="min-h-screen">
        <Navbar />

        <div className="pt-6">
          <Container>
            <MarketTicker watchlist={WATCHLIST} rows={rows} wsState={wsState} />
          </Container>
        </div>

        <main>
          <section className="pt-8 md:pt-10">
            <Container className="py-6 md:py-10">
              <Panel3D
                title={
                  <>
                    Market Watch: mercado <span className="text-emerald-400">en tiempo real</span>
                  </>
                }
                subtitle="Ticks • Stream • WS real con fallback a DEMO (estilo institucional)"
                right={
                  <div className="flex flex-wrap items-center gap-2">
                    <div className={`rounded-full border px-3 py-1 text-xs ${statusStyle(wsState)}`}>
                      WS: {wsState}
                    </div>

                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                      Mode: {snap.mode}
                    </div>

                    <button
                      type="button"
                      onClick={() => marketStore.setMode(snap.mode === "WS_REAL" ? "DEMO" : "WS_REAL")}
                      className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs text-white/80 transition hover:border-white/20 hover:text-white"
                      title="Alternar WS real / DEMO"
                    >
                      Toggle
                    </button>

                    <button
                      type="button"
                      onClick={() => marketStore.reconnect()}
                      className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs text-white/80 transition hover:border-white/20 hover:text-white"
                      title="Reintentar conexión"
                    >
                      Reconnect
                    </button>

                    <FXButtonPro href={NEURO_REGISTER_URL} variant="primary" size="sm">
                      Probar Neuro
                    </FXButtonPro>

                    <FXButtonPro href="/neuro-chat" variant="secondary" size="sm">
                      Abrir Neuro Chat
                    </FXButtonPro>
                  </div>
                }
              >
                <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
                  <div className="lg:col-span-8">
                    <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-sm text-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Datos • contexto • control de riesgo
                    </p>

                    <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl xl:text-7xl">
                      Observa el mercado con <span className="text-emerald-400">claridad</span>.
                    </h1>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <div className={`rounded-full border px-3 py-1 text-xs ${pillTone(spreadTone)}`}>
                        Spread:{" "}
                        {spreadPips == null
                          ? "—"
                          : `${fmt(spreadPips, isFxSymbol(selected.symbol) ? 1 : 0)} pips`}
                      </div>

                      <div className={`rounded-full border px-3 py-1 text-xs ${pillTone(volTone)}`}>
                        Volatilidad: {selectedRow ? `${fmt(Math.abs(selectedRow.chg), 2)}%` : "—"}
                      </div>

                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                        Último tick:{" "}
                        {lastTickTs
                          ? new Date(lastTickTs).toLocaleTimeString(undefined, { hour12: false })
                          : "—"}
                      </div>

                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                        WS URL: <span className="text-white/85">{snap.wsUrl.replace(/^wss?:\/\//, "")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
                    <FXButtonPro href="/technology" variant="outline" size="lg">
                      Ver tecnología
                    </FXButtonPro>

                    <FXButtonPro href="/security" variant="ghost" size="lg">
                      Ver seguridad
                    </FXButtonPro>
                  </div>
                </div>
              </Panel3D>
            </Container>
          </section>

          <section className="pb-10 md:pb-14">
            <Container>
              <div className="grid gap-6 lg:grid-cols-12 xl:gap-8">
                <div className="lg:col-span-4">
                  <Panel3D
                    title="Watchlist"
                    subtitle="Buscar / filtrar / ordenar"
                    right={
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                        {sorted.length} / {WATCHLIST.length}
                      </span>
                    }
                  >
                    <div className="mt-4 grid gap-3">
                      <div>
                        <label className="text-xs text-white/55">Buscar</label>
                        <input
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="EURUSD, Gold, Nasdaq…"
                          className="mt-1 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white/85 outline-none placeholder:text-white/35 focus:border-white/20"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-white/55">Tag</label>
                          <select
                            value={tagFilter}
                            onChange={(e) => setTagFilter(e.target.value as AssetTag | "Todos")}
                            className="mt-1 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white/85 outline-none focus:border-white/20"
                          >
                            <option value="Todos">Todos</option>
                            <option value="Forex">Forex</option>
                            <option value="Metales">Metales</option>
                            <option value="Crypto">Crypto</option>
                            <option value="Índices">Índices</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs text-white/55">Orden</label>
                          <div className="mt-1 grid grid-cols-2 gap-2">
                            <select
                              value={sortKey}
                              onChange={(e) => setSortKey(e.target.value as SortKey)}
                              className="w-full rounded-2xl border border-white/10 bg-black/35 px-3 py-3 text-sm text-white/85 outline-none focus:border-white/20"
                            >
                              <option value="symbol">Símbolo</option>
                              <option value="chg">Cambio</option>
                              <option value="spread">Spread</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                              className="rounded-2xl border border-white/10 bg-black/35 px-3 py-3 text-sm text-white/85 transition hover:border-white/20 hover:text-white"
                            >
                              {sortDir === "asc" ? "Asc ↑" : "Desc ↓"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {sorted.map((a) => {
                        const active = a.symbol === selected.symbol;
                        const r = rows[a.symbol];
                        const d = digitsForSymbol(a.symbol);

                        const spPips = r ? r.spread / pipValue(a.symbol) : null;
                        const spTone: "ok" | "warn" | "bad" =
                          spPips == null
                            ? "ok"
                            : spPips >= spreadWarnPips(a.symbol) * 1.6
                              ? "bad"
                              : spPips >= spreadWarnPips(a.symbol)
                                ? "warn"
                                : "ok";

                        return (
                          <button
                            key={a.symbol}
                            type="button"
                            onClick={() => selectSymbol(a.symbol, setSelected)}
                            className={[
                              "w-full rounded-2xl border p-4 text-left transition",
                              active
                                ? "border-emerald-400/25 bg-emerald-500/10 shadow-[0_0_40px_rgba(34,197,94,0.12)]"
                                : "border-white/10 bg-white/5 hover:-translate-y-0.5 hover:border-white/15",
                            ].join(" ")}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <div className="text-base font-semibold text-white/90">{a.symbol}</div>
                                  <span className={`rounded-full border px-2 py-0.5 text-[11px] ${pillTone(spTone)}`}>
                                    {spPips == null
                                      ? "Spread —"
                                      : `Spread ${fmt(spPips, isFxSymbol(a.symbol) ? 1 : 0)}`}
                                  </span>
                                </div>

                                <div className="mt-1 text-xs text-white/60 md:text-sm">{a.name}</div>
                              </div>

                              <span className={`rounded-full border px-3 py-1 text-xs ${tagStyle(a.tag)}`}>
                                {a.tag}
                              </span>
                            </div>

                            <div className="mt-3 grid grid-cols-3 items-center gap-2">
                              <div className="text-xs text-white/60">Bid</div>
                              <div className="col-span-2 text-right text-sm text-white/85">
                                {r ? fmt(r.bid, d) : "—"}
                              </div>

                              <div className="text-xs text-white/60">Ask</div>
                              <div className="col-span-2 text-right text-sm text-white/85">
                                {r ? fmt(r.ask, d) : "—"}
                              </div>

                              <div className="text-xs text-white/60">Chg</div>
                              <div className="col-span-2 text-right text-sm">
                                <span className={r && r.chg >= 0 ? "text-emerald-300" : "text-rose-300"}>
                                  {r ? `${r.chg >= 0 ? "+" : ""}${fmt(r.chg, 2)}%` : "—"}
                                </span>
                              </div>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                              <FXButtonPro href={`/trading?symbol=${a.symbol}`} variant="outline" size="sm">
                                Operar
                              </FXButtonPro>

                              <FXButtonPro href={`/charts?symbol=${a.symbol}`} variant="ghost" size="sm">
                                Ver gráfico
                              </FXButtonPro>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </Panel3D>
                </div>

                <div className="lg:col-span-8">
                  <div className="grid gap-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <MarketScanner
                        watchlist={WATCHLIST}
                        rows={rows}
                        onPick={(sym) => selectSymbol(sym, setSelected)}
                      />

                      <MarketHeatmap
                        watchlist={WATCHLIST}
                        rows={rows}
                        selectedSymbol={selected.symbol}
                        onPick={(sym) => selectSymbol(sym, setSelected)}
                      />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <MarketRiskOverlay
                        symbol={selected.symbol}
                        row={selectedRow}
                        wsState={wsState}
                      />

                      <MarketExecutionCard
                        symbol={selected.symbol}
                        wsState={wsState}
                      />
                    </div>

                    <Panel3D
                      title={`Stream (${snap.mode === "WS_REAL" ? "WS real" : "Demo"}) — ${selected.symbol}`}
                      subtitle="Terminal + señales visuales (auto fallback si WS falla)"
                      right={
                        <div className={`rounded-full border px-3 py-1 text-xs ${statusStyle(wsState)}`}>
                          WS: {wsState}
                        </div>
                      }
                    >
                      <div className="mt-6 grid gap-4 md:grid-cols-12">
                        <div className="rounded-2xl border border-white/10 bg-black/35 p-5 shadow-[0_18px_65px_rgba(0,0,0,0.55)] md:col-span-5">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-white/75">Precio actual</div>
                            <span className="text-xs text-white/55">
                              {selectedRow
                                ? new Date(selectedRow.ts).toLocaleTimeString(undefined, { hour12: false })
                                : "—"}
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-3">
                            <MiniMetric label="BID" value={selectedRow ? fmt(selectedRow.bid, selectedDigits) : "—"} />
                            <MiniMetric label="ASK" value={selectedRow ? fmt(selectedRow.ask, selectedDigits) : "—"} />
                            <MiniMetric
                              label="SPREAD"
                              value={selectedRow ? fmt(selectedRow.spread, selectedDigits) : "—"}
                            />
                            <MiniMetric
                              label="CHG"
                              value={
                                selectedRow
                                  ? `${selectedRow.chg >= 0 ? "+" : ""}${fmt(selectedRow.chg, 2)}%`
                                  : "—"
                              }
                              accent={selectedRow ? (selectedRow.chg >= 0 ? "up" : "down") : "neutral"}
                            />
                          </div>

                          <div className="mt-4 flex items-center justify-between gap-3">
                            <div>
                              <div className="text-xs text-white/55">Momentum (mini)</div>
                              <div className="mt-2">
                                <Sparkline points={selectedSpark} />
                              </div>
                            </div>

                            <div className="grid gap-2">
                              <span className={`rounded-full border px-3 py-1 text-xs ${pillTone(spreadTone)}`}>
                                Spread{" "}
                                {spreadPips == null
                                  ? "—"
                                  : `${fmt(spreadPips, isFxSymbol(selected.symbol) ? 1 : 0)} pips`}
                              </span>

                              <span className={`rounded-full border px-3 py-1 text-xs ${pillTone(volTone)}`}>
                                Vol {selectedRow ? `${fmt(Math.abs(selectedRow.chg), 2)}%` : "—"}
                              </span>
                            </div>
                          </div>

                          <div className="mt-5 flex flex-wrap gap-3">
                            <FXButtonPro href={`/trading?symbol=${selected.symbol}`} variant="secondary" size="sm">
                              Operar
                            </FXButtonPro>

                            <FXButtonPro href={`/charts?symbol=${selected.symbol}`} variant="outline" size="sm">
                              Ver gráfico
                            </FXButtonPro>

                            <FXButtonPro href="/security" variant="ghost" size="sm">
                              Reglas de riesgo
                            </FXButtonPro>
                          </div>

                          <p className="mt-4 text-xs leading-relaxed text-white/55">
                            Si la conexión Neuro en tiempo real está activa, esto toma ticks reales ({`type:"tick"`}). Si WS falla, cae a
                            DEMO automáticamente.
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/35 p-5 shadow-[0_18px_65px_rgba(0,0,0,0.55)] md:col-span-7">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-white/80">Feed (terminal)</div>
                            <span className="text-xs text-white/55">últimos eventos</span>
                          </div>

                          <div
                            ref={feedRef}
                            className="mt-4 h-56 overflow-auto rounded-2xl border border-white/10 bg-black/40 p-4"
                          >
                            <div className="space-y-2 font-mono text-xs text-white/70">
                              {feed.map((line, idx) => (
                                <div key={`${idx}-${line}`} className="whitespace-pre-wrap">
                                  {line}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-3">
                            <FXButtonPro href="/technology" variant="outline" size="sm">
                              Ver módulos IA
                            </FXButtonPro>

                            <FXButtonPro href="/neuro-chat" variant="secondary" size="sm">
                              Preguntar a Neuro Chat
                            </FXButtonPro>
                          </div>
                        </div>
                      </div>
                    </Panel3D>

                    <MarketAlerts
                      watchlist={WATCHLIST}
                      rows={rows}
                      onPick={(sym) => selectSymbol(sym, setSelected)}
                    />
                  </div>
                </div>
              </div>
            </Container>
          </section>
        </main>
      </div>
    </FXBackground>
  );
}

function MiniMetric({
  label,
  value,
  accent = "neutral",
}: {
  label: string;
  value: string;
  accent?: "up" | "down" | "neutral";
}) {
  const cls =
    accent === "up"
      ? "text-emerald-200"
      : accent === "down"
        ? "text-rose-200"
        : "text-white/85";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-white/55">{label}</div>
      <div className={`mt-1 text-base font-semibold ${cls}`}>{value}</div>
    </div>
  );
}