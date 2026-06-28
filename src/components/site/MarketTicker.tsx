"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sparkline from "@/components/site/Sparkline";

const symbols = ["EURUSD", "BTCUSD", "XAUUSD", "NAS100", "USDJPY"] as const;
type SymbolType = (typeof symbols)[number];

type TickRow = {
  symbol: string;
  bid: number;
  ask: number;
  changePct: number;
  ts: number;
};

type MarketWatchMsg =
  | { ok: true; type: "market_watch"; rows: TickRow[] }
  | { ok: false; error: string };

type PriceState = {
  bid: number;
  ask: number;
  mid: number;
  prevMid?: number;
  ts: number;
  hist: number[];
};

type WsStatus = "live" | "reconnecting" | "offline";

function isValidSymbol(symbol: string): symbol is SymbolType {
  return (symbols as readonly string[]).includes(symbol);
}

function fmt(symbol: string, v: number) {
  if (symbol === "BTCUSD" || symbol === "XAUUSD" || symbol === "NAS100") return v.toFixed(2);
  if (symbol.includes("JPY")) return v.toFixed(2);
  return v.toFixed(5);
}

export default function MarketTicker() {
  const [data, setData] = useState<Record<SymbolType, PriceState | undefined>>({
    EURUSD: undefined,
    BTCUSD: undefined,
    XAUUSD: undefined,
    NAS100: undefined,
    USDJPY: undefined,
  });

  // ✅ default offline (evita setState sincrónico dentro del effect)
  const [status, setStatus] = useState<WsStatus>("offline");

  const wsRef = useRef<WebSocket | null>(null);
  const retryRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;

    const base = process.env.NEXT_PUBLIC_API_BASE;
    if (!base) {
      // ✅ NO setStatus aquí (eslint rule)
      return () => {
        aliveRef.current = false;
      };
    }

    const wsUrl = base.replace(/^http/i, "ws") + "/market/ws";

    const cleanup = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = null;

      if (wsRef.current) {
        try {
          wsRef.current.onopen = null;
          wsRef.current.onclose = null;
          wsRef.current.onerror = null;
          wsRef.current.onmessage = null;
          wsRef.current.close();
        } catch {
          // ignore
        }
      }
      wsRef.current = null;
    };

    const scheduleReconnect = () => {
      if (!aliveRef.current) return;

      retryRef.current += 1;
      const delay = Math.min(6000, 300 * Math.pow(2, Math.min(5, retryRef.current)));

      // ✅ esto sucede por callback / control flow (no “sincrónico” inicial)
      setStatus((s) => (s === "live" ? "reconnecting" : s === "offline" ? "reconnecting" : s));

      timerRef.current = window.setTimeout(() => {
        connect();
      }, delay);
    };

    const connect = () => {
      if (!aliveRef.current) return;

      cleanup();
      setStatus("reconnecting");

      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          if (!aliveRef.current) return;
          retryRef.current = 0;
          setStatus("live");
        };

        ws.onmessage = (ev) => {
          try {
            const msg = JSON.parse(ev.data) as MarketWatchMsg;
            if (!msg || msg.ok !== true || msg.type !== "market_watch") return;

            setData((prev) => {
              const next = { ...prev };

              for (const r of msg.rows) {
                if (!isValidSymbol(r.symbol)) continue;

                const mid = (r.bid + r.ask) / 2;
                const current = next[r.symbol];

                const prevHist = current?.hist ?? [];
                const hist = [...prevHist, mid].slice(-40);

                next[r.symbol] = {
                  bid: r.bid,
                  ask: r.ask,
                  mid,
                  prevMid: current?.mid,
                  ts: r.ts,
                  hist,
                };
              }

              return next;
            });
          } catch {
            // ignore
          }
        };

        ws.onerror = () => {
          // dejamos que onclose maneje reconexión
        };

        ws.onclose = () => {
          if (!aliveRef.current) return;
          setStatus("offline");
          scheduleReconnect();
        };
      } catch {
        setStatus("offline");
        scheduleReconnect();
      }
    };

    // ✅ no setState “inmediato” fuera de callbacks salvo este (reconnecting) que es esperado
    connect();

    return () => {
      aliveRef.current = false;
      cleanup();
    };
  }, []);

  const items = useMemo(() => symbols.map((s) => ({ symbol: s, v: data[s] })), [data]);

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
        <span
          className={`h-2 w-2 rounded-full ${
            status === "live"
              ? "bg-emerald-400 animate-pulse"
              : status === "reconnecting"
              ? "bg-yellow-300 animate-pulse"
              : "bg-red-400"
          }`}
        />
        <span className="text-white/80">
          {status === "live" ? "LIVE MARKET" : status === "reconnecting" ? "RECONNECTING" : "OFFLINE"}
        </span>
      </div>

      {items.map(({ symbol, v }) => {
        const up = v?.prevMid !== undefined && v.mid > v.prevMid;
        const down = v?.prevMid !== undefined && v.mid < v.prevMid;
        const sparkUp: boolean | null = v ? (up ? true : down ? false : null) : null;

        return (
          <div
            key={symbol}
            className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2"
          >
            <AnimatePresence>
              {up && (
                <motion.div
                  key="up"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="pointer-events-none absolute inset-0 bg-emerald-500/12"
                />
              )}
              {down && (
                <motion.div
                  key="down"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="pointer-events-none absolute inset-0 bg-red-500/10"
                />
              )}
            </AnimatePresence>

            <div className="relative flex items-center gap-3">
              <div className="text-white/65">{symbol}</div>

              <div className="flex items-center gap-3">
                <div className="flex items-baseline gap-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={v?.mid ?? symbol}
                      initial={{ y: -4, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 4, opacity: 0 }}
                      transition={{ duration: 0.16 }}
                      className={`font-semibold ${
                        up ? "text-emerald-300" : down ? "text-red-300" : "text-white"
                      }`}
                    >
                      {v ? fmt(symbol, v.mid) : "—"}
                    </motion.div>
                  </AnimatePresence>

                  <div className="hidden md:flex items-center gap-2 text-[11px] text-white/55">
                    <span className="rounded-md border border-white/10 bg-black/20 px-2 py-0.5">
                      BID {v ? fmt(symbol, v.bid) : "—"}
                    </span>
                    <span className="rounded-md border border-white/10 bg-black/20 px-2 py-0.5">
                      ASK {v ? fmt(symbol, v.ask) : "—"}
                    </span>
                  </div>
                </div>

                <div className="hidden sm:block">
                  <Sparkline values={v?.hist ?? []} up={sparkUp} />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="text-[11px] text-white/50">
        * Demo stream. Conecta feed real cuando lo tengas.
      </div>
    </div>
  );
}
