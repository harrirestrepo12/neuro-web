"use client";

import React, { useMemo, useState } from "react";
import Navbar from "@/components/site/Navbar";
import FXBackground from "@/components/site/FXBackground";
import Container from "@/components/layout/Container";
import FXButtonPro from "@/components/site/FXButtonPro";
import Panel3D from "@/components/site/Panel3D";

const highlights = [
  {
    title: "Control de riesgo institucional",
    desc: "Capital Shield + reglas Risk-On/Risk-Off, límites por operación/sesión y pausas automáticas ante peligro.",
  },
  {
    title: "Ejecución protegida",
    desc: "Firewall de Trading detecta latencia, slippage y spreads anómalos para bloquear órdenes peligrosas.",
  },
  {
    title: "Transparencia real",
    desc: "Logs y trazabilidad. Neuro no vende “milagros”: construye disciplina, reglas y control.",
  },
  {
    title: "Neuro Chat híbrido",
    desc: "Asistente tipo ChatGPT + motor especializado en trading/riesgo. Respuestas claras, sin promesas falsas.",
  },
  {
    title: "Arquitectura por fases",
    desc: "MT5 Bridge (oculto) → Gateway Multi-Broker → conexiones directas (API/FIX) cuando aplique.",
  },
  {
    title: "Experiencia premium",
    desc: "UI futurista, rápida y elegante. Hecha para novatos y expertos con modo guiado.",
  },
];

const steps = [
  { n: "1", title: "Descarga y entra en Demo", desc: "Empieza con saldo demo recargable para validar reglas, límites y disciplina." },
  { n: "2", title: "Configura límites y modo", desc: "Modo Novato/Experto + control de exposición para evitar operar a ciegas." },
  { n: "3", title: "Conecta broker por fases", desc: "Cuando esté habilitado: MT5 Bridge / Gateway y luego rutas directas (API/FIX)." },
];

const faqs = [
  {
    q: "¿Neuro garantiza ganancias?",
    a: "No. El trading implica riesgo. Neuro es una plataforma de control, automatización y disciplina bajo reglas. La decisión final siempre es tuya.",
  },
  {
    q: "¿Neuro custodia fondos?",
    a: "No. Tu dinero permanece en tu broker. Neuro solo envía órdenes bajo tus permisos y límites configurados.",
  },
  {
    q: "¿Puedo usar Neuro siendo novato?",
    a: "Sí. Está diseñado con modo Novato, guía clara y recomendación de empezar en demo antes de pasar a real.",
  },
  {
    q: "¿Cómo se conecta Neuro a brokers?",
    a: "Por fases: inicialmente bridge MT5 (MT5 oculto), luego gateway multi-broker y finalmente API/FIX cuando sea posible.",
  },
];

export default function HomePage() {
  const [controlsOn, setControlsOn] = useState(false);
  const [videoOk, setVideoOk] = useState(true);

  const videoSrc = useMemo(() => "/videos/neuro-working.mp4", []);

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
                    Neuro Trading: <span className="text-emerald-400">control</span>,{" "}
                    <span className="text-emerald-400">disciplina</span> y{" "}
                    <span className="text-emerald-400">ejecución</span>
                  </>
                }
                subtitle="Plataforma premium • Sin promesas falsas • Riesgo primero"
                right={
                  <div className="flex flex-wrap gap-3">
                    <FXButtonPro href="/download" variant="primary" size="sm">
                      Descargar
                    </FXButtonPro>
                    <FXButtonPro href="/pricing" variant="outline" size="sm">
                      Ver planes
                    </FXButtonPro>
                  </div>
                }
              >
                <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                  {/* LEFT */}
                  <div className="lg:col-span-6">
                    <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-sm text-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Diseño institucional • control de riesgo • transparencia
                    </p>

                    <h1 className="mt-5 text-4xl md:text-6xl xl:text-7xl font-semibold leading-[1.05] tracking-tight text-white">
                      Opera con reglas,
                      <br />
                      no con esperanza.
                    </h1>

                    <p className="mt-4 text-base md:text-xl text-white/80 leading-relaxed max-w-2xl">
                      Neuro no es un “robot milagroso”. Es un stack de módulos para{" "}
                      <b className="text-white/90">analizar</b>,{" "}
                      <b className="text-white/90">proteger</b> y{" "}
                      <b className="text-white/90">ejecutar</b> con disciplina.
                    </p>

                    <div className="mt-7 flex flex-wrap gap-3">
                      <FXButtonPro href="/download" variant="primary" size="lg">
                        Descargar Neuro
                      </FXButtonPro>
                      <FXButtonPro href="/neuro-chat" variant="secondary" size="lg">
                        Probar Neuro Chat
                      </FXButtonPro>
                      <FXButtonPro href="/security" variant="outline" size="lg">
                        Ver seguridad
                      </FXButtonPro>
                    </div>

                    {/* HERO STATS (impacto fuerte) */}
                    <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <HeroStat label="Modo" value="Demo / Real" />
                      <HeroStat label="Enfoque" value="Riesgo Primero" />
                      <HeroStat label="Protección" value="Capital Shield" />
                      <HeroStat label="Arquitectura" value="Multi-Broker" />
                    </div>

                    <p className="mt-5 text-xs md:text-sm text-white/55 max-w-2xl">
                      Neuro no custodia fondos. Tus fondos permanecen en tu broker. Operar implica riesgo.
                    </p>
                  </div>

                  {/* RIGHT: VIDEO */}
                  <div className="lg:col-span-6">
                    <div className="relative rounded-3xl p-0.5 bg-linear-to-r from-emerald-500/35 via-sky-500/20 to-indigo-500/30">
                      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/45 p-4 md:p-5 shadow-[0_30px_120px_rgba(0,0,0,0.70)]">
                        {/* glow */}
                        <div
                          aria-hidden
                          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/12 blur-3xl"
                        />
                        <div
                          aria-hidden
                          className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-sky-500/12 blur-3xl"
                        />
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-x-8 top-3 h-10 rounded-full bg-white/10 blur-2xl opacity-35"
                        />
                        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />

                        <div className="relative">
                          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                            <div className="text-sm text-white/85">Neuro — Demo (video)</div>
                            <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                              LIVE
                            </span>
                          </div>

                          <div className="mt-4">
                            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                              {/* HUD overlay */}
                              <div aria-hidden className="pointer-events-none absolute inset-0">
                                <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/20 to-black/55" />
                                <div className="absolute inset-x-6 top-6 h-px bg-white/10" />
                                <div className="absolute inset-x-6 bottom-6 h-px bg-white/10" />
                                <div className="absolute left-6 top-6 h-3 w-3 rounded-full bg-emerald-400/80 shadow-[0_0_18px_rgba(34,197,94,0.9)]" />
                                <div className="absolute right-6 top-6 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs text-white/75">
                                  LIVE • Neuro Engine
                                </div>
                                <div className="absolute left-6 bottom-6 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs text-white/70">
                                  Risk Shield: ON
                                </div>
                                <div className="absolute right-6 bottom-6 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs text-white/70">
                                  Execution Firewall: ON
                                </div>
                                <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:36px_36px]" />
                              </div>

                              {/* Video file: public/videos/neuro-working.mp4 */}
                              {videoOk ? (
                                <video
                                  className="h-[320px] w-full object-cover md:h-[420px]"
                                  src={videoSrc}
                                  poster="/ai/neuro-bg.jpg"
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                  preload="metadata"
                                  controls={controlsOn}
                                  onError={() => setVideoOk(false)}
                                />
                              ) : (
                                <div className="flex h-[320px] w-full items-center justify-center p-6 text-center md:h-[420px]">
                                  <div className="max-w-md rounded-2xl border border-white/10 bg-black/55 p-5 text-sm text-white/75 backdrop-blur">
                                    <div className="text-white/90 font-semibold">Video no disponible aún</div>
                                    <div className="mt-2 text-white/70">
                                      Coloca tu video en{" "}
                                      <b className="text-white/85">public/videos/neuro-working.mp4</b>
                                    </div>
                                    <div className="mt-4 flex flex-wrap justify-center gap-3">
                                      <FXButtonPro href="/neuro-chat" variant="secondary" size="sm">
                                        Ver demo en Neuro Chat
                                      </FXButtonPro>
                                      <FXButtonPro href="/download" variant="outline" size="sm">
                                        Descargar
                                      </FXButtonPro>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />
                            </div>

                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                              <div className="grid gap-3 md:grid-cols-2">
                                <MiniStat k="Modo" v="Novato / Experto" />
                                <MiniStat k="Enfoque" v="Riesgo primero" />
                                <MiniStat k="Ejecución" v="Firewall activo" />
                                <MiniStat k="Chat" v="Neuro Chat híbrido" />
                              </div>

                              <button
                                type="button"
                                onClick={() => setControlsOn((v) => !v)}
                                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white/80 hover:text-white hover:border-white/20 transition"
                              >
                                Controles: {controlsOn ? "ON" : "OFF"}
                              </button>
                            </div>

                            {/* MINI DEMO INTERACTIVA */}
                            <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/5 p-4">
                              <div className="mb-2 text-xs text-emerald-300">Simulación Neuro Engine</div>
                              <div className="text-sm text-white/80">
                                Estado Mercado: <span className="font-semibold text-emerald-400">Volatilidad Media</span>
                              </div>
                              <div className="text-sm text-white/80">
                                Edge Detectado: <span className="font-semibold text-emerald-400">Confirmado</span>
                              </div>
                              <div className="text-sm text-white/80">
                                Riesgo Actual: <span className="font-semibold text-yellow-400">Moderado</span>
                              </div>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-3">
                              <FXButtonPro href="/technology" variant="outline" size="sm">
                                Ver módulos
                              </FXButtonPro>
                              <FXButtonPro href="/market" variant="ghost" size="sm">
                                Ver Market Watch
                              </FXButtonPro>
                              <FXButtonPro href="/brokers" variant="secondary" size="sm">
                                Ver brokers
                              </FXButtonPro>
                            </div>

                            <p className="mt-4 text-xs text-white/55 leading-relaxed">
                              Video: <b>public/videos/neuro-working.mp4</b> (puedes reemplazarlo cuando quieras).
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Panel3D>
            </Container>
          </section>

          {/* TRUST STRIP (autoridad) */}
          <section className="pb-12">
            <Container>
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-white/50">
                <span>Capital Shield IA</span>
                <span>Firewall de Trading</span>
                <span>Neuro Chat Híbrido</span>
                <span>Arquitectura Multi-Broker</span>
                <span>Modo Ultra Seguro</span>
              </div>
            </Container>
          </section>

          {/* HIGHLIGHTS */}
          <section className="pb-10 md:pb-14">
            <Container>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-white">Lo que hace diferente a Neuro</h2>
                  <p className="mt-2 text-white/70 max-w-3xl">
                    Diseñado como producto premium: protección, claridad y ejecución bajo reglas. Sin humo.
                  </p>
                </div>
                <div className="hidden md:flex gap-3">
                  <FXButtonPro href="/pricing" variant="secondary" size="sm">
                    Ver planes
                  </FXButtonPro>
                  <FXButtonPro href="/download" variant="outline" size="sm">
                    Descargar
                  </FXButtonPro>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {highlights.map((x) => (
                  <FeatureCard key={x.title} title={x.title} desc={x.desc} />
                ))}
              </div>

              <div className="mt-6 flex md:hidden gap-3">
                <FXButtonPro href="/pricing" variant="secondary" size="sm">
                  Ver planes
                </FXButtonPro>
                <FXButtonPro href="/download" variant="outline" size="sm">
                  Descargar
                </FXButtonPro>
              </div>
            </Container>
          </section>

          {/* HOW IT WORKS */}
          <section className="pb-10 md:pb-14">
            <Container>
              <Panel3D title="Cómo empezar" subtitle="Rápido y sin errores">
                <div className="grid gap-4 md:grid-cols-3">
                  {steps.map((s) => (
                    <StepCard key={s.n} n={s.n} title={s.title} desc={s.desc} />
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <FXButtonPro href="/download" variant="primary" size="lg">
                    Descargar Neuro
                  </FXButtonPro>
                  <FXButtonPro href="/security" variant="outline" size="lg">
                    Leer seguridad
                  </FXButtonPro>
                  <FXButtonPro href="/neuro-chat" variant="secondary" size="lg">
                    Preguntar a Neuro Chat
                  </FXButtonPro>
                </div>
              </Panel3D>
            </Container>
          </section>

          {/* CTA STRIP */}
          <section className="pb-10 md:pb-14">
            <Container>
              <div className="relative rounded-3xl p-0.5 bg-linear-to-r from-emerald-500/35 via-sky-500/20 to-indigo-500/30">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/45 p-6 md:p-8 shadow-[0_30px_120px_rgba(0,0,0,0.70)]">
                  <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/12 blur-3xl" />
                  <div aria-hidden className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-sky-500/12 blur-3xl" />
                  <div aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />

                  <div className="relative grid gap-6 lg:grid-cols-12 lg:items-center">
                    <div className="lg:col-span-8">
                      <div className="text-2xl md:text-3xl font-semibold text-white">
                        ¿Listo para operar con <span className="text-emerald-400">reglas</span>?
                      </div>
                      <p className="mt-2 text-white/70 max-w-3xl">
                        Empieza en demo, configura límites y usa Neuro Chat para aprender decisiones claras.
                      </p>
                    </div>
                    <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
                      <FXButtonPro href="/download" variant="primary" size="lg">
                        Descargar
                      </FXButtonPro>
                      <FXButtonPro href="/pricing" variant="outline" size="lg">
                        Ver planes
                      </FXButtonPro>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>

          {/* FAQ */}
          <section className="pb-10 md:pb-14">
            <Container>
              <Panel3D title="FAQ" subtitle="Respuestas claras (sin humo)">
                <div className="grid gap-4 md:grid-cols-2">
                  {faqs.map((f) => (
                    <Faq key={f.q} q={f.q} a={f.a} />
                  ))}
                </div>

                <footer className="pt-10 text-xs text-white/55">© {new Date().getFullYear()} Neuro Trading — Home.</footer>
              </Panel3D>
            </Container>
          </section>
        </main>
      </div>
    </FXBackground>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
      <div className="text-xs uppercase tracking-wide text-white/50">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white/90">{value}</div>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="relative rounded-3xl p-0.5 bg-linear-to-r from-emerald-500/25 via-sky-500/15 to-indigo-500/20">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/45 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.70)] hover:-translate-y-1 hover:border-white/15 transition">
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />
        <div className="relative">
          <div className="text-base md:text-lg font-semibold text-white/90">{title}</div>
          <p className="mt-3 text-sm md:text-base text-white/75 leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function StepCard({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_14px_50px_rgba(0,0,0,0.45)]">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-500/10 text-sm font-semibold text-emerald-200">
          {n}
        </span>
        <div className="text-sm md:text-base font-semibold text-white/90">{title}</div>
      </div>
      <p className="mt-3 text-sm text-white/70 leading-relaxed">{desc}</p>
    </div>
  );
}

function MiniStat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_14px_50px_rgba(0,0,0,0.45)]">
      <div className="text-xs text-white/60">{k}</div>
      <div className="mt-1 text-sm text-white/85">{v}</div>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_14px_50px_rgba(0,0,0,0.45)]">
      <div className="text-sm md:text-base font-semibold text-white/90">{q}</div>
      <div className="mt-2 text-sm text-white/70 leading-relaxed">{a}</div>
    </div>
  );
}