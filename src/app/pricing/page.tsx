"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/site/Navbar";
import { NEURO_REGISTER_URL } from "@/lib/neuroLinks";

type Billing = "mensual" | "anual";

type Plan = {
  name: string;
  badge: string;
  description: string;
  monthly: number;
  annual: number;
  featured?: boolean;
  includes: string[];
  bestFor: string;
};

const plans: Plan[] = [
  {
    name: "Starter",
    badge: "Accesible",
    description: "Para empezar con demo, educación, Neuro Chat y control básico de riesgo.",
    monthly: 19,
    annual: 190,
    bestFor: "Novatos, cuentas demo y traders que quieren aprender con disciplina.",
    includes: [
      "30 días gratis",
      "Neuro Chat educativo",
      "Modo Novato",
      "Demo y aprendizaje guiado",
      "Control básico de riesgo",
      "Historial y métricas esenciales",
      "Sin promesas de ganancias",
    ],
  },
  {
    name: "Pro",
    badge: "Recomendado",
    description: "Para traders activos que quieren MT5, IA operativa y protección avanzada.",
    monthly: 39,
    annual: 390,
    featured: true,
    bestFor: "Traders activos que quieren operar con más contexto, trazabilidad y control.",
    includes: [
      "30 días gratis",
      "Todo en Starter",
      "Neuro Chat completo",
      "Conexión MT5 por fases",
      "Capital Shield avanzado",
      "Firewall de Trading",
      "Market Radar 360",
      "IA operativa para contexto de mercado",
    ],
  },
  {
    name: "Elite",
    badge: "Avanzado",
    description: "Para uso intensivo, automatización avanzada, reportes y prioridad.",
    monthly: 79,
    annual: 790,
    bestFor: "Usuarios intensivos, operadores avanzados y equipos pequeños.",
    includes: [
      "30 días gratis",
      "Todo en Pro",
      "Reportes avanzados",
      "Soporte prioritario",
      "Multi-broker por fases",
      "AI News Reaction",
      "Modo Ultra Seguro",
      "Roadmap premium por fases",
    ],
  },
];

const comparison = [
  ["30 días gratis", "Incluido", "Incluido", "Incluido"],
  ["Neuro Chat", "Educativo", "Completo", "Premium"],
  ["Modo Novato", "Incluido", "Incluido", "Incluido"],
  ["MT5", "Demo / básico", "Completo por fases", "Avanzado por fases"],
  ["Capital Shield", "Básico", "Avanzado", "Avanzado+"],
  ["Firewall de Trading", "Básico", "Fuerte", "Fuerte+"],
  ["Market Radar 360", "Básico", "Incluido", "Incluido"],
  ["AI News Reaction", "No incluido", "Limitado", "Incluido"],
  ["Reportes", "Esenciales", "Mejorados", "Avanzados"],
  ["Soporte", "Estándar", "Prioritario", "Premium"],
];

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PricingPage() {
  const [billing, setBilling] = useState<Billing>("mensual");

  const viewedPlans = useMemo(() => {
    return plans.map((plan) => {
      const price = billing === "mensual" ? plan.monthly : plan.annual;
      const cadence = billing === "mensual" ? "/mes" : "/año";
      const monthlyEquivalent = Math.round(plan.annual / 12);
      return { ...plan, price, cadence, monthlyEquivalent };
    });
  }, [billing]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] text-white">
      <Navbar />

      <section className="relative px-6 pt-32 pb-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_32%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_28%),linear-gradient(180deg,#020617_0%,#07111f_48%,#020617_100%)]" />

        <div className="mx-auto max-w-7xl text-center">
          <div className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-5 py-2 text-sm font-semibold text-emerald-100">
            Prueba de 30 días disponible en todos los planes
          </div>

          <h1 className="mx-auto mt-6 max-w-5xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            Precios accesibles para operar con{" "}
            <span className="bg-gradient-to-r from-cyan-200 via-white to-emerald-200 bg-clip-text text-transparent">
              IA, riesgo y disciplina.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Neuro está diseñado para traders novatos, activos y avanzados. Sin
            promesas irreales: pagas por tecnología, control, claridad y una
            experiencia más profesional.
          </p>

          <div className="mt-8 inline-flex rounded-2xl border border-white/10 bg-white/[0.05] p-1.5">
            <button
              type="button"
              onClick={() => setBilling("mensual")}
              className={`rounded-xl px-6 py-3 text-sm font-bold transition ${
                billing === "mensual"
                  ? "bg-cyan-300 text-slate-950"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              Mensual
            </button>
            <button
              type="button"
              onClick={() => setBilling("anual")}
              className={`rounded-xl px-6 py-3 text-sm font-bold transition ${
                billing === "anual"
                  ? "bg-cyan-300 text-slate-950"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              Anual
            </button>
          </div>

          <p className="mt-4 text-sm text-slate-400">
            Plan anual: pagas 10 meses y usas 12.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {viewedPlans.map((plan) => (
            <article
              key={plan.name}
              className={`relative rounded-[2rem] border p-7 backdrop-blur ${
                plan.featured
                  ? "border-cyan-300/40 bg-cyan-300/[0.08] shadow-[0_0_70px_rgba(34,211,238,0.18)]"
                  : "border-white/10 bg-white/[0.045]"
              }`}
            >
              {plan.featured ? (
                <div className="absolute -top-4 left-7 rounded-full bg-cyan-300 px-4 py-1.5 text-xs font-black text-slate-950">
                  Más recomendado
                </div>
              ) : null}

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-cyan-200">{plan.badge}</p>
                  <h2 className="mt-2 text-3xl font-semibold">{plan.name}</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                  30 días gratis
                </span>
              </div>

              <p className="mt-4 min-h-[72px] text-sm leading-7 text-slate-400">
                {plan.description}
              </p>

              <div className="mt-6">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-semibold">{money(plan.price)}</span>
                  <span className="pb-2 text-slate-400">{plan.cadence}</span>
                </div>

                {billing === "anual" ? (
                  <p className="mt-2 text-sm text-emerald-200">
                    Equivale a aprox. {money(plan.monthlyEquivalent)}/mes.
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-slate-400">Cancela cuando quieras.</p>
                )}
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Ideal para
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{plan.bestFor}</p>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.includes.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-slate-300">
                    <span className="mt-2 h-2 w-2 rounded-full bg-emerald-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 grid gap-3">
                <a
                  href={NEURO_REGISTER_URL}
                  className={`rounded-2xl px-5 py-4 text-center text-sm font-black transition ${
                    plan.featured
                      ? "bg-cyan-300 text-slate-950 hover:bg-cyan-200"
                      : "border border-white/10 bg-white/[0.05] text-white hover:bg-white/10"
                  }`}
                >
                  Crear cuenta para probar 30 días
                </a>
                <Link
                  href="/neuro-chat"
                  className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-5 py-4 text-center text-sm font-bold text-cyan-100 hover:bg-cyan-300/15"
                >
                  Preguntar a Neuro Chat
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">
                Comparativa
              </p>
              <h2 className="mt-3 text-3xl font-semibold">Qué incluye cada plan</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-400">
              Los tres planes incluyen prueba gratis. La diferencia está en capacidad,
              automatización, reportes y nivel de soporte.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[760px] border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="border-b border-white/10 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Función
                  </th>
                  <th className="border-b border-white/10 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Starter
                  </th>
                  <th className="border-b border-white/10 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                    Pro
                  </th>
                  <th className="border-b border-white/10 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Elite
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map(([feature, starter, pro, elite]) => (
                  <tr key={feature}>
                    <td className="border-b border-white/10 py-4 text-sm font-semibold text-white">
                      {feature}
                    </td>
                    <td className="border-b border-white/10 py-4 text-sm text-slate-300">
                      {starter}
                    </td>
                    <td className="border-b border-white/10 py-4 text-sm text-cyan-100">
                      {pro}
                    </td>
                    <td className="border-b border-white/10 py-4 text-sm text-slate-300">
                      {elite}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-7">
          <h2 className="text-2xl font-semibold">Importante</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-emerald-50">
            Neuro Trading no garantiza ganancias ni custodia tu dinero. Tus fondos
            permanecen en tu broker. Neuro ayuda con análisis, control de riesgo,
            ejecución guiada, trazabilidad y disciplina operativa.
          </p>
        </div>
      </section>
    </main>
  );
}
