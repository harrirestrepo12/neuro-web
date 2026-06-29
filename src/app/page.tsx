"use client";

import Link from "next/link";
import Navbar from "@/components/site/Navbar";

const pillars = [
  {
    title: "Riesgo primero",
    text: "Neuro Trading prioriza protección de capital, límites operativos y pausas inteligentes antes que cualquier entrada al mercado.",
  },
  {
    title: "IA operativa",
    text: "Análisis de estructura, momentum, volatilidad, spread, contexto de mercado y señales técnicas en una sola experiencia.",
  },
  {
    title: "Conexión MT5",
    text: "Diseñado para trabajar con MetaTrader 5, cuentas demo o reales, siempre con confirmaciones, trazabilidad y controles.",
  },
];

const metrics = [
  { value: "24/7", label: "monitoreo y soporte operativo" },
  { value: "20+", label: "motores de inteligencia integrados" },
  { value: "MT5", label: "puente preparado para trading real" },
];

const sections = [
  "Trading manual asistido",
  "Trading automático controlado",
  "Neuro Chat educativo y operativo",
  "Paneles de mercado y riesgo",
  "Planes, pagos y acceso premium",
  "Seguridad, roles y auditoría",
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] text-white">
      <Navbar />

      <section className="relative px-6 pt-32 pb-20 sm:pt-36 lg:pb-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.24),transparent_34%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.22),transparent_30%),linear-gradient(180deg,#020617_0%,#06111f_48%,#020617_100%)]" />
        <div className="absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 shadow-[0_0_40px_rgba(34,211,238,0.12)]">
              Plataforma de trading con IA, riesgo y disciplina operativa
            </div>

            <h1 className="max-w-5xl text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              La plataforma que transforma{" "}
              <span className="bg-gradient-to-r from-cyan-200 via-white to-violet-200 bg-clip-text text-transparent">
                el caos del mercado
              </span>{" "}
              en decisiones claras con IA, riesgo y MT5.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
              Neuro Trading une análisis técnico, control de riesgo, ejecución
              protegida y Neuro Chat en una sola plataforma para operar con más
              disciplina, contexto y trazabilidad.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/download"
                className="rounded-2xl bg-cyan-300 px-6 py-4 text-center text-sm font-bold text-slate-950 shadow-[0_0_45px_rgba(34,211,238,0.35)] transition hover:-translate-y-0.5 hover:bg-cyan-200"
              >
                Descargar plataforma
              </Link>
              <Link
                href="/neuro-chat"
                className="rounded-2xl border border-white/15 bg-white/8 px-6 py-4 text-center text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-white/12"
              >
                Probar Neuro Chat
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {metrics.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur"
                >
                  <div className="text-2xl font-bold text-cyan-200">{item.value}</div>
                  <div className="mt-2 text-sm leading-5 text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[1.5rem] border border-cyan-300/20 bg-slate-950/80 p-5">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Neuro Market Core</p>
                    <h2 className="text-xl font-semibold text-white">EURUSD operativo</h2>
                  </div>
                  <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                    Control activo
                  </span>
                </div>

                <div className="grid gap-3">
                  {[
                    ["Sesgo", "HOLD / Esperar confirmación"],
                    ["Riesgo", "Spread, volatilidad y exposición"],
                    ["Motor", "IA + reglas + contexto MT5"],
                    ["Salida", "SL, TP y cierre protegido"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
                    >
                      <span className="text-sm text-slate-400">{label}</span>
                      <span className="text-right text-sm font-semibold text-slate-100">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
                  <p className="text-sm leading-6 text-cyan-50">
                    Neuro no reemplaza tu criterio: lo fortalece con estructura,
                    disciplina, control de riesgo y lectura técnica del mercado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-3">
            {pillars.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/[0.045] p-7 backdrop-blur transition hover:-translate-y-1 hover:border-cyan-300/30"
              >
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-400">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
                Ecosistema Neuro
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                Una web preparada para explicar, vender y conectar la plataforma.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-400">
                Neuro Web presenta el producto de forma clara: tecnología,
                seguridad, brokers, mercado, precios, descarga y asistencia con
                Neuro Chat.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {sections.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-4 text-sm font-medium text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

