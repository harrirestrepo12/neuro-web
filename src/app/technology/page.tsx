"use client";

import React, { useMemo, useState } from "react";
import Navbar from "@/components/site/Navbar";
import FXBackground from "@/components/site/FXBackground";
import Container from "@/components/layout/Container";
import FXButtonPro from "@/components/site/FXButtonPro";
import Panel3D from "@/components/site/Panel3D";

type Mode = "novato" | "experto";
type Tag = "IA" | "Riesgo" | "Ejecución" | "Mercado" | "Mentor";
type Filter = "Todos" | Tag;

type Module = {
  key: string;
  name: string;
  tag: Tag;
  simple: string;
  tech: {
    purpose: string;
    inputs: string[];
    outputs: string[];
    safeguards: string[];
  };
};

const MODULES: Module[] = [
  {
    key: "self-training-rnn",
    name: "Self-Training RNN",
    tag: "IA",
    simple: "Aprende del mercado con el tiempo para mejorar decisiones y reducir errores.",
    tech: {
      purpose: "Aprendizaje continuo (online/offline) para adaptar señales a regímenes de mercado.",
      inputs: ["ticks/velas (OHLCV)", "volatilidad (ATR, RV)", "spread/slippage históricos", "régimen (tendencia/rango)"],
      outputs: ["probabilidad de escenario", "scores de confianza por activo", "preferencia (no-trade / trade)"],
      safeguards: ["no opera sin límites activos", "fallback conservador", "congelamiento por drift extremo"],
    },
  },
  {
    key: "capital-shield",
    name: "Capital Shield IA",
    tag: "Riesgo",
    simple: "Protege tu cuenta: controla exposición, pérdidas máximas y pausa en peligro.",
    tech: {
      purpose: "Control de exposición efectiva (apalancamiento real) + reglas Risk-On/Risk-Off.",
      inputs: ["balance/equity", "P/L flotante", "margen y exposición por símbolo", "volatilidad/impacto macro"],
      outputs: ["lote máximo permitido", "límite por sesión/día", "freeze/unfreeze"],
      safeguards: ["hard limits por pérdida", "bloqueo por volatilidad extrema", "reducción progresiva de riesgo"],
    },
  },
  {
    key: "manipulation-radar",
    name: "Market Manipulation Radar",
    tag: "Mercado",
    simple: "Detecta trampas típicas: spikes, barridos de stops y falsas rupturas.",
    tech: {
      purpose: "Detección de anomalías micro-estructurales y patrones de liquidez.",
      inputs: ["spreads/quotes", "micro-volatilidad", "volumen relativo", "desviaciones vs histórico"],
      outputs: ["alerta de manipulación", "zonas de riesgo (no-trade)", "ajuste SL/TP recomendado"],
      safeguards: ["reduce/pausa exposición automáticamente", "no abre entradas en zona roja"],
    },
  },
  {
    key: "firewall",
    name: "Firewall de Trading",
    tag: "Ejecución",
    simple: "Evita ejecuciones malas: latencia, slippage y spreads anómalos.",
    tech: {
      purpose: "Protección de ejecución (anti-riesgo extremo) y consistencia del ledger.",
      inputs: ["latencia conexión Neuro↔broker", "slippage observado", "spread actual vs normal", "rechazos del broker"],
      outputs: ["bloqueo de órdenes", "reintentos controlados", "cambio a modo seguro"],
      safeguards: ["no spamear órdenes", "reduce/cierra exposición si se degrada ejecución"],
    },
  },
  {
    key: "adaptive-optimizer",
    name: "Adaptive Optimizer",
    tag: "IA",
    simple: "Ajusta SL/TP y riesgo según el mercado para evitar operar “a ciegas”.",
    tech: {
      purpose: "Optimización dinámica de parámetros con límites estrictos (evita overfit).",
      inputs: ["ATR/volatilidad", "tendencia/rango", "correlaciones", "condiciones de liquidez"],
      outputs: ["SL/TP sugerido", "tamaño de posición sugerido", "filtros (no-trade)"],
      safeguards: ["topes duros por plan/mode", "rollback a presets conservadores"],
    },
  },
  {
    key: "meta-strategies",
    name: "Meta-Estrategias",
    tag: "IA",
    simple: "Selecciona la mejor estrategia según el mercado (no una sola para todo).",
    tech: {
      purpose: "Ensamble: elige estrategia por régimen con control de riesgo y validación.",
      inputs: ["scores de señales", "régimen de mercado", "drawdown reciente", "calidad de ejecución"],
      outputs: ["estrategia activa", "ponderación por estrategia", "justificación (logs)"],
      safeguards: ["evita rotación excesiva", "bloqueo si cae la calidad"],
    },
  },
  {
    key: "news-reaction",
    name: "AI News Reaction System",
    tag: "Mercado",
    simple: "Filtra eventos macro: reduce riesgo antes de noticias fuertes.",
    tech: {
      purpose: "Gestión de riesgo por calendario macro y ventanas de impacto.",
      inputs: ["calendario económico", "ventanas alto impacto", "volatilidad previa al evento"],
      outputs: ["pausa/limitación temporal", "reducción de lote", "reanudación condicionada"],
      safeguards: ["modo ultra-seguro en real", "bloqueo de entradas impulsivas"],
    },
  },
  {
    key: "market-radar-360",
    name: "Market Radar 360°",
    tag: "Mercado",
    simple: "Visión global: volatilidad, correlaciones y alertas multi-mercado.",
    tech: {
      purpose: "Monitor global para detectar cambios de régimen y riesgo sistémico.",
      inputs: ["forex/índices/cripto/metales", "correlaciones", "volatilidad global", "volúmenes inusuales"],
      outputs: ["alertas de riesgo sistémico", "sugerencias de watchlist", "modo risk-off automático"],
      safeguards: ["prioriza protección sobre agresividad"],
    },
  },
  {
    key: "multi-broker",
    name: "Multi-Broker Engine",
    tag: "Ejecución",
    simple: "Conecta varios brokers/cuentas y distribuye riesgo (por fases).",
    tech: {
      purpose: "Conexión Neuro + módulos por broker con estados consistentes y auditoría.",
      inputs: ["cuentas demo/real", "estado de conexión", "posiciones/órdenes por cuenta"],
      outputs: ["enrutamiento de órdenes", "split de riesgo", "sincronización ledger"],
      safeguards: ["no mezcla cuentas sin selección explícita", "consistencia de cierres (full/partial)"],
    },
  },
  {
    key: "neuro-chat",
    name: "Neuro Chat IA",
    tag: "Mentor",
    simple: "Chat integrado: guía de riesgo, reglas, y explicación clara sin humo.",
    tech: {
      purpose: "Asistente híbrido: lenguaje natural + motor especializado en trading/riesgo.",
      inputs: ["pregunta del usuario", "modo (novato/experto)", "contexto (si se conecta)"],
      outputs: ["respuesta estructurada", "reglas accionables", "warnings de riesgo"],
      safeguards: ["sin promesas falsas", "enfatiza riesgo + decisión final del usuario"],
    },
  },
];

const TAG_STYLE: Record<Tag, string> = {
  IA: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
  Riesgo: "border-blue-400/30 bg-blue-500/10 text-blue-300",
  Ejecución: "border-purple-400/30 bg-purple-500/10 text-purple-300",
  Mercado: "border-white/15 bg-black/20 text-white/70",
  Mentor: "border-amber-400/30 bg-amber-500/10 text-amber-200",
};

const FILTERS: readonly Filter[] = ["Todos", "IA", "Riesgo", "Ejecución", "Mercado", "Mentor"];

const ARCH_BLOCKS = [
  ["Frontend (Next.js)", "UI premium, rápida, clara y orientada a decisión."],
  ["Backend (API + WS)", "Endpoints para market, pricing, neurochat, health y flujos operativos."],
  ["Conexión Neuro", "Ejecución, órdenes, cuentas, estados y auditoría consistente."],
] as const;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function countByTag(modules: Module[], tag: Tag) {
  return modules.filter((module) => module.tag === tag).length;
}

export default function TechnologyPage() {
  const [mode, setMode] = useState<Mode>("novato");
  const [filter, setFilter] = useState<Filter>("Todos");

  const filtered = useMemo(() => {
    if (filter === "Todos") return MODULES;
    return MODULES.filter((module) => module.tag === filter);
  }, [filter]);

  const stats = useMemo(
    () => [
      { label: "Módulos", value: String(MODULES.length) },
      { label: "IA", value: String(countByTag(MODULES, "IA")) },
      { label: "Riesgo", value: String(countByTag(MODULES, "Riesgo")) },
      { label: "Mercado", value: String(countByTag(MODULES, "Mercado")) },
    ],
    []
  );

  const year = new Date().getFullYear();

  return (
    <FXBackground imageSrc="/ai/neuro-bg.jpg" className="min-h-screen" imageOpacity={0.34}>
      <div className="min-h-screen">
        <Navbar />

        <main>
          <section className="pt-10 md:pt-14">
            <Container className="py-8 md:py-12">
              <Panel3D
                title={
                  <>
                    Tecnología Neuro: <span className="text-emerald-400">clara para novatos</span>, técnica para expertos
                  </>
                }
                subtitle="Tecnología • IA • Riesgo • Ejecución"
                right={
                  <div className="flex flex-wrap gap-3">
                    <FXButtonPro href="/pricing" variant="primary" size="sm">
                      Ver planes
                    </FXButtonPro>
                    <FXButtonPro href="/neuro-chat" variant="outline" size="sm">
                      Preguntar a Neuro Chat
                    </FXButtonPro>
                  </div>
                }
              >
                <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
                  <div className="lg:col-span-7">
                    <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-sm text-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.85)]" />
                      Arquitectura real • control de riesgo • ejecución con contexto
                    </p>

                    <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl xl:text-7xl">
                      Tecnología para <span className="text-emerald-400">analizar, proteger y ejecutar</span>.
                    </h1>

                    <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/80 md:text-xl">
                      Neuro no es un “robot milagroso”. Es un stack de módulos diseñado para{" "}
                      <b className="text-white/92">leer contexto</b>, <b className="text-white/92">reducir errores</b> y{" "}
                      <b className="text-white/92">operar con disciplina</b>.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      <Pill text="Stack modular" tone="emerald" />
                      <Pill text="Risk-aware" tone="blue" />
                      <Pill text="Execution control" tone="purple" />
                      <Pill text="Neuro Chat" tone="amber" />
                    </div>

                    <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      {stats.map((stat) => (
                        <StatCard key={stat.label} label={stat.label} value={stat.value} />
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,12,18,0.94)_0%,rgba(7,10,16,0.88)_100%)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl">
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(52,211,153,0.10),transparent_32%),radial-gradient(circle_at_85%_0%,rgba(59,130,246,0.08),transparent_28%)]"
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-[1px] rounded-[27px] border border-white/5"
                      />

                      <div className="relative">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-white/90">Modo de lectura</div>
                            <div className="mt-1 text-xs text-white/52">
                              Cambia entre explicación simple y vista técnica.
                            </div>
                          </div>

                          <div className="inline-flex rounded-2xl border border-white/10 bg-black/35 p-1">
                            <button
                              type="button"
                              onClick={() => setMode("novato")}
                              className={cx(
                                "rounded-xl px-4 py-2 text-sm transition",
                                mode === "novato"
                                  ? "bg-emerald-500/90 font-semibold text-black"
                                  : "text-white/80 hover:text-white"
                              )}
                            >
                              Modo Novato
                            </button>

                            <button
                              type="button"
                              onClick={() => setMode("experto")}
                              className={cx(
                                "rounded-xl px-4 py-2 text-sm transition",
                                mode === "experto"
                                  ? "bg-emerald-500/90 font-semibold text-black"
                                  : "text-white/80 hover:text-white"
                              )}
                            >
                              Modo Experto
                            </button>
                          </div>
                        </div>

                        <div className="mt-5 border-t border-white/10 pt-4">
                          <div className="text-xs uppercase tracking-[0.16em] text-white/46">Filtro</div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {FILTERS.map((item) => (
                              <button
                                key={item}
                                type="button"
                                onClick={() => setFilter(item)}
                                className={cx(
                                  "rounded-full border px-3 py-2 text-xs transition",
                                  filter === item
                                    ? "border-white/20 bg-white/10 text-white"
                                    : "border-white/10 bg-black/25 text-white/70 hover:border-white/20 hover:text-white"
                                )}
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                          <div className="text-xs text-white/55">
                            Vista activa:{" "}
                            <span className="text-white/82">
                              {mode === "novato" ? "explicación clara de valor" : "propósito, inputs, outputs y safeguards"}
                            </span>
                          </div>
                          <div className="mt-1 text-[11px] text-white/42">
                            Filtro actual: <span className="text-white/70">{filter}</span> · módulos visibles:{" "}
                            <span className="text-white/70">{filtered.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Panel3D>
            </Container>
          </section>

          <section className="pb-10 md:pb-14">
            <Container>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white md:text-3xl">Módulos</h2>
                  <p className="mt-2 max-w-3xl text-white/70">
                    En modo <b className="text-white/85">{mode === "novato" ? "Novato" : "Experto"}</b> verás{" "}
                    {mode === "novato"
                      ? "qué hace cada módulo y por qué te importa."
                      : "propósito, inputs, outputs y salvaguardas de operación."}
                  </p>
                </div>

                <div className="hidden gap-3 md:flex">
                  <FXButtonPro href="/market" variant="outline" size="sm">
                    Ver Market Watch
                  </FXButtonPro>
                  <FXButtonPro href="/security" variant="secondary" size="sm">
                    Ver seguridad
                  </FXButtonPro>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {filtered.map((module) => (
                  <details
                    key={module.key}
                    className="group rounded-[28px] p-[1px] bg-gradient-to-r from-emerald-500/30 via-sky-500/18 to-indigo-500/24"
                  >
                    <div className="relative overflow-hidden rounded-[27px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,12,18,0.94)_0%,rgba(7,10,16,0.88)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.46)]">
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,transparent_45%)]"
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-[1px] rounded-[26px] border border-white/5"
                      />

                      <summary className="relative cursor-pointer list-none">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="text-lg font-semibold text-white/92 md:text-xl">{module.name}</div>
                              <span className={cx("rounded-full border px-3 py-1 text-xs", TAG_STYLE[module.tag])}>
                                {module.tag}
                              </span>
                            </div>

                            <p className="mt-2 text-sm text-white/72 md:text-base">{module.simple}</p>
                          </div>

                          <span className="mt-1 shrink-0 text-xs text-white/55 transition group-open:text-emerald-300">
                            {mode === "novato" ? "Ver detalle" : "Ver specs"}
                          </span>
                        </div>
                      </summary>

                      <div className="relative mt-4 border-t border-white/10 pt-4">
                        {mode === "novato" ? (
                          <div className="rounded-[22px] border border-white/10 bg-black/25 p-5">
                            <p className="text-sm leading-relaxed text-white/74 md:text-base">
                              <span className="font-semibold text-white/88">¿Por qué importa?</span> Este módulo existe para
                              que tomes decisiones con menos error, más contexto y mejores límites. Si el mercado se vuelve
                              peligroso, Neuro prioriza protegerte antes que forzar actividad.
                            </p>

                            <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-100/90">
                              Consejo Neuro: empieza en demo, usa límites activos y sube a automático de forma progresiva.
                            </div>
                          </div>
                        ) : (
                          <div className="grid gap-4 md:grid-cols-2">
                            <SpecBlock title="Propósito" items={[module.tech.purpose]} />
                            <SpecBlock title="Salvaguardas" items={module.tech.safeguards} />
                            <SpecBlock title="Inputs" items={module.tech.inputs} />
                            <SpecBlock title="Outputs" items={module.tech.outputs} />
                          </div>
                        )}
                      </div>
                    </div>
                  </details>
                ))}
              </div>

              <div className="mt-4 flex gap-3 md:hidden">
                <FXButtonPro href="/market" variant="outline" size="sm">
                  Ver Market Watch
                </FXButtonPro>
                <FXButtonPro href="/security" variant="secondary" size="sm">
                  Ver seguridad
                </FXButtonPro>
              </div>

              <div className="mt-10">
                <Panel3D title="Arquitectura (visión clara)" subtitle="Frontend + Backend + Conexión Neuro">
                  <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
                    <div className="lg:col-span-7">
                      <p className="max-w-3xl text-white/72">
                        Frontend y backend separados. Mercado en vivo por WebSocket y endpoints propios. Neuro opera
                        conectado a broker/MT5 mediante una capa de conexión por fases, con foco en consistencia, control de riesgo
                        y trazabilidad.
                      </p>

                      <div className="mt-6 grid gap-4 md:grid-cols-3">
                        {ARCH_BLOCKS.map(([title, desc]) => (
                          <div
                            key={title}
                            className="rounded-[22px] border border-white/10 bg-white/5 p-6 shadow-[0_14px_50px_rgba(0,0,0,0.34)]"
                          >
                            <div className="text-sm font-semibold text-white/90">{title}</div>
                            <div className="mt-2 text-sm leading-relaxed text-white/70">{desc}</div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <FXButtonPro href="/security" variant="outline" size="sm">
                          Ver seguridad
                        </FXButtonPro>
                        <FXButtonPro href="/brokers" variant="ghost" size="sm">
                          Ver brokers
                        </FXButtonPro>
                        <FXButtonPro href="/market" variant="secondary" size="sm">
                          Ver Market Watch
                        </FXButtonPro>
                      </div>
                    </div>

                    <div className="lg:col-span-5">
                      <div className="rounded-[26px] border border-white/10 bg-black/25 p-5">
                        <div className="text-xs uppercase tracking-[0.16em] text-white/46">Resumen operativo</div>

                        <div className="mt-4 space-y-3">
                          <SummaryRow title="Leer mercado" desc="Market Watch, Radar 360°, eventos y contexto." />
                          <SummaryRow title="Controlar riesgo" desc="Capital Shield, Firewall y validaciones activas." />
                          <SummaryRow title="Ejecutar con disciplina" desc="Conexión Neuro, estados consistentes y auditoría." />
                        </div>
                      </div>
                    </div>
                  </div>

                  <footer className="pt-10 text-xs text-white/55">
                    © {year} Neuro Trading — Tecnología con control de riesgo.
                  </footer>
                </Panel3D>
              </div>
            </Container>
          </section>
        </main>
      </div>
    </FXBackground>
  );
}

function SpecBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-black/35 p-5 shadow-[0_14px_50px_rgba(0,0,0,0.34)]">
      <div className="text-xs text-white/58">{title}</div>
      <ul className="mt-3 space-y-2 text-sm text-white/75">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-400/80" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Pill({
  text,
  tone,
}: {
  text: string;
  tone: "emerald" | "blue" | "purple" | "amber";
}) {
  const cls =
    tone === "emerald"
      ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-200"
      : tone === "blue"
        ? "border-blue-400/25 bg-blue-500/10 text-blue-200"
        : tone === "purple"
          ? "border-purple-400/25 bg-purple-500/10 text-purple-200"
          : "border-amber-400/25 bg-amber-500/10 text-amber-200";

  return <span className={`rounded-full border px-3 py-1 text-[11px] ${cls}`}>{text}</span>;
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/5 p-4 shadow-[0_14px_50px_rgba(0,0,0,0.34)]">
      <div className="text-xs text-white/55">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white/92">{value}</div>
    </div>
  );
}

function SummaryRow({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
      <div className="text-sm font-semibold text-white/88">{title}</div>
      <div className="mt-1 text-sm leading-relaxed text-white/68">{desc}</div>
    </div>
  );
}