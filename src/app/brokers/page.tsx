"use client";

import React, { useMemo, useState } from "react";
import Navbar from "@/components/site/Navbar";
import FXBackground from "@/components/site/FXBackground";
import Container from "@/components/layout/Container";
import FXButtonPro from "@/components/site/FXButtonPro";
import Panel3D from "@/components/site/Panel3D";

type Status = "Live" | "En progreso" | "Próximamente";
type Connect = "MT5" | "API" | "FIX";

type Broker = {
  key: string;
  name: string;
  status: Status;
  connects: Connect[];
  note: string;
  highlight?: string;
};

const BROKERS: Broker[] = [
  {
    key: "exness",
    name: "Exness",
    status: "En progreso",
    connects: ["MT5", "API"],
    note: "Prioridad máxima. Base del ecosistema Neuro (flujo IB + MT5 oculto).",
    highlight: "Prioridad #1",
  },
  {
    key: "icmarkets",
    name: "IC Markets",
    status: "Próximamente",
    connects: ["MT5", "FIX"],
    note: "Alto rendimiento y buena liquidez. Enrutamiento por gateway (fase avanzada).",
  },
  {
    key: "pepperstone",
    name: "Pepperstone",
    status: "Próximamente",
    connects: ["MT5", "API"],
    note: "Integración por fases. Ideal para diversificar ejecución.",
  },
  {
    key: "xm",
    name: "XM",
    status: "Próximamente",
    connects: ["MT5"],
    note: "Compatibilidad mediante bridge MT5 (fase inicial).",
  },
  {
    key: "roboforex",
    name: "RoboForex",
    status: "Próximamente",
    connects: ["MT5"],
    note: "Integración multi-cuenta por gateway (fase posterior).",
  },
  {
    key: "fxpro",
    name: "FXPro",
    status: "Próximamente",
    connects: ["MT5"],
    note: "Conexión vía MT5 Bridge y control de riesgo institucional.",
  },
  {
    key: "octa",
    name: "Octa",
    status: "Próximamente",
    connects: ["MT5"],
    note: "Soporte planeado por bridge MT5.",
  },
  {
    key: "hfm",
    name: "HFM",
    status: "Próximamente",
    connects: ["MT5"],
    note: "Soporte planeado por bridge MT5.",
  },
  {
    key: "fpmarkets",
    name: "FP Markets",
    status: "Próximamente",
    connects: ["MT5", "FIX"],
    note: "Integración avanzada con ejecución robusta por gateway.",
  },
  {
    key: "tickmill",
    name: "Tickmill",
    status: "Próximamente",
    connects: ["MT5", "FIX"],
    note: "Integración avanzada por fases (routing + auditoría).",
  },
];

type Filter = "Todos" | Status;

const STATUS_STYLE: Record<Status, string> = {
  Live: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
  "En progreso": "border-sky-400/30 bg-sky-500/10 text-sky-300",
  Próximamente: "border-white/15 bg-black/20 text-white/70",
};

const CONNECT_STYLE: Record<Connect, string> = {
  MT5: "border-purple-400/30 bg-purple-500/10 text-purple-200",
  API: "border-amber-400/30 bg-amber-500/10 text-amber-200",
  FIX: "border-blue-400/30 bg-blue-500/10 text-blue-200",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function BrokersPage() {
  const [filter, setFilter] = useState<Filter>("Todos");

  const list = useMemo(() => {
    if (filter === "Todos") return BROKERS;
    return BROKERS.filter((b) => b.status === filter);
  }, [filter]);

  return (
    <FXBackground imageSrc="/ai/neuro-bg.jpg" className="min-h-screen" imageOpacity={0.34}>
      <div className="min-h-screen">
        <Navbar />

        <main>
          {/* HERO */}
          <section className="pt-10 md:pt-14">
            <Container className="py-8 md:py-12">
              <Panel3D
                title={
                  <>
                    Brokers compatibles con <span className="text-emerald-400">Neuro</span>
                  </>
                }
                subtitle="Conexión por fases • MT5 oculto • Gateway/Bridge • Auditoría"
                right={
                  <div className="flex flex-wrap gap-3">
                    <FXButtonPro href="/technology" variant="outline" size="sm">
                      Ver tecnología
                    </FXButtonPro>
                    <FXButtonPro href="/security" variant="secondary" size="sm">
                      Ver seguridad
                    </FXButtonPro>
                  </div>
                }
              >
                <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
                  <div className="lg:col-span-8">
                    <p className="text-white/75 text-sm md:text-base leading-relaxed max-w-3xl">
                      Neuro se conecta por{" "}
                      <b className="text-white/90">fases</b>: primero mediante <b className="text-white/90">MT5 Bridge</b> (MT5
                      oculto al usuario), luego conexiones más directas cuando el broker lo permita (API/FIX).
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <FXButtonPro href="/download" variant="primary" size="lg">
                        Descargar Neuro
                      </FXButtonPro>
                      <FXButtonPro href="/pricing" variant="outline" size="lg">
                        Ver planes
                      </FXButtonPro>
                      <FXButtonPro href="/neuro-chat" variant="ghost" size="lg">
                        Preguntar a Neuro Chat
                      </FXButtonPro>
                    </div>

                    <p className="mt-4 text-xs md:text-sm text-white/55 max-w-3xl">
                      Nota: Neuro no custodia fondos. El capital se mantiene en tu broker. Neuro solo envía órdenes bajo permisos y reglas.
                    </p>
                  </div>

                  <div className="lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
                      <div className="text-sm text-white/70">Filtrar por estado</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(["Todos", "Live", "En progreso", "Próximamente"] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setFilter(t)}
                            className={cx(
                              "rounded-full border px-3 py-2 text-xs transition",
                              filter === t
                                ? "border-white/20 bg-white/10 text-white"
                                : "border-white/10 bg-black/25 text-white/70 hover:text-white hover:border-white/20"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Panel3D>
            </Container>
          </section>

          {/* LISTA */}
          <section className="pb-10 md:pb-14">
            <Container>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-white">Lista de brokers</h2>
                  <p className="mt-2 text-white/70 max-w-3xl">
                    Los estados indican el avance real de integración en Neuro. Cuando un broker esté “Live”, el flujo será guiado
                    dentro de la app.
                  </p>
                </div>

                <div className="hidden md:flex gap-3">
                  <FXButtonPro href="/download" variant="outline" size="sm">
                    Descargar
                  </FXButtonPro>
                  <FXButtonPro href="/pricing" variant="secondary" size="sm">
                    Ver planes
                  </FXButtonPro>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {list.map((b) => (
                  <BrokerCard key={b.key} broker={b} />
                ))}
              </div>

              <div className="mt-6 flex md:hidden gap-3">
                <FXButtonPro href="/download" variant="outline" size="sm">
                  Descargar
                </FXButtonPro>
                <FXButtonPro href="/pricing" variant="secondary" size="sm">
                  Ver planes
                </FXButtonPro>
              </div>
            </Container>
          </section>

          {/* CÓMO CONECTA */}
          <section className="pb-10 md:pb-14">
            <Container>
              <Panel3D title="Cómo se conecta Neuro" subtitle="Arquitectura por fases (sin humo)">
                <div className="grid gap-4 md:grid-cols-3">
                  <StepCard
                    title="Fase 1 — MT5 Bridge"
                    desc="Neuro usa un bridge con MT5 para leer cuenta/posiciones y ejecutar órdenes. El usuario no ve MT5."
                    chips={["MT5", "Auditoría", "Control de riesgo"]}
                  />
                  <StepCard
                    title="Fase 2 — Gateway Multi-Broker"
                    desc="Un gateway unifica brokers/cuentas, sincroniza ledger y aplica políticas (Firewall, Capital Shield)."
                    chips={["Routing", "Ledger", "WebSocket"]}
                  />
                  <StepCard
                    title="Fase 3 — Conexión Directa"
                    desc="Cuando el broker lo permita: API oficial o FIX para ejecución más directa y robusta."
                    chips={["API", "FIX", "Menos latencia"]}
                  />
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <FXButtonPro href="/technology" variant="outline" size="sm">
                    Ver módulos
                  </FXButtonPro>
                  <FXButtonPro href="/security" variant="secondary" size="sm">
                    Ver protecciones
                  </FXButtonPro>
                  <FXButtonPro href="/neuro-chat" variant="ghost" size="sm">
                    Preguntar
                  </FXButtonPro>
                </div>

                <footer className="pt-10 text-xs text-white/55">
                  © {new Date().getFullYear()} Neuro Trading — Brokers.
                </footer>
              </Panel3D>
            </Container>
          </section>
        </main>
      </div>
    </FXBackground>
  );
}

function BrokerCard({ broker }: { broker: Broker }) {
  return (
    <div className="relative rounded-3xl p-0.5 bg-linear-to-r from-emerald-500/25 via-sky-500/15 to-indigo-500/20">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/45 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.70)] hover:-translate-y-1 hover:border-white/15 transition">
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />

        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-lg md:text-xl font-semibold text-white/90">{broker.name}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className={cx("rounded-full border px-3 py-1 text-xs", STATUS_STYLE[broker.status])}>
                  {broker.status}
                </span>
                {broker.connects.map((c) => (
                  <span key={c} className={cx("rounded-full border px-3 py-1 text-xs", CONNECT_STYLE[c])}>
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {broker.highlight ? (
              <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                {broker.highlight}
              </span>
            ) : null}
          </div>

          <p className="mt-4 text-sm md:text-base text-white/75 leading-relaxed">{broker.note}</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <FXButtonPro href="/download" variant="primary" size="sm">
              Descargar
            </FXButtonPro>
            <FXButtonPro href="/pricing" variant="outline" size="sm">
              Ver planes
            </FXButtonPro>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepCard({
  title,
  desc,
  chips,
}: {
  title: string;
  desc: string;
  chips: string[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_14px_50px_rgba(0,0,0,0.45)]">
      <div className="text-sm md:text-base font-semibold text-white/90">{title}</div>
      <p className="mt-2 text-sm text-white/70 leading-relaxed">{desc}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {chips.map((c) => (
          <span key={c} className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-white/70">
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}