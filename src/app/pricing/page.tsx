"use client";

import React, { useMemo, useState } from "react";
import Navbar from "@/components/site/Navbar";
import FXBackground from "@/components/site/FXBackground";
import Container from "@/components/layout/Container";
import FXButtonPro from "@/components/site/FXButtonPro";
import Panel3D from "@/components/site/Panel3D";

type Billing = "mensual" | "anual";

type PlanKey = "starter" | "pro" | "elite";

type Plan = {
  key: PlanKey;
  name: string;
  badge?: string;
  tagline: string;
  priceMonthly: number; // USD
  priceAnnual: number; // USD (2 meses gratis: mensual * 10)
  accent: "emerald" | "sky" | "amber";
  ctaVariant: "primary" | "secondary" | "outline";
  includes: string[];
  highlights: string[];
  footnote?: string;
};

const PLANS: Plan[] = [
  {
    key: "starter",
    name: "Starter",
    badge: "Para empezar",
    tagline: "Disciplina + control básico. Ideal para demo y primeros pasos.",
    priceMonthly: 29,
    priceAnnual: 290,
    accent: "sky",
    ctaVariant: "outline",
    includes: [
      "Cuenta Demo $100 recargable (modo simulación)",
      "Modo Novato + guía clara",
      "Capital Shield (límites básicos)",
      "Firewall de Trading (protección de ejecución básica)",
      "Neuro Chat (uso razonable / fair use)",
      "Panel de historial + métricas esenciales",
    ],
    highlights: [
      "Perfecto para aprender sin ruido",
      "Límites por operación y sesión",
      "Sin promesas falsas",
    ],
    footnote: "Recomendado si estás empezando.",
  },
  {
    key: "pro",
    name: "Pro",
    badge: "Más popular",
    tagline: "Automatización inteligente con control fuerte de riesgo.",
    priceMonthly: 79,
    priceAnnual: 790,
    accent: "emerald",
    ctaVariant: "primary",
    includes: [
      "Demo + Real (según conexión disponible)",
      "Capital Shield avanzado (Risk-On/Risk-Off)",
      "Adaptive Optimizer (SL/TP y filtros con límites)",
      "Meta-Estrategias (selección por régimen)",
      "Market Radar 360° (alertas globales)",
      "Neuro Chat completo (fair use ampliado)",
      "Logs y trazabilidad mejorada",
    ],
    highlights: [
      "Mejor balance rendimiento/seguridad",
      "Optimización sin sobre-ajuste",
      "Protección activa ante riesgo extremo",
    ],
    footnote: "El plan recomendado para la mayoría.",
  },
  {
    key: "elite",
    name: "Elite",
    badge: "Institucional",
    tagline: "Máximo control, auditoría, y capacidades avanzadas por fases.",
    priceMonthly: 199,
    priceAnnual: 1990,
    accent: "amber",
    ctaVariant: "secondary",
    includes: [
      "Todo en Pro",
      "Multi-Broker Engine (fase avanzada)",
      "AI News Reaction (ventanas de alto impacto)",
      "Controles extra (modo Ultra Seguro real)",
      "Prioridad de features y soporte",
      "Reportes de riesgo y performance avanzados",
      "Neuro Market (beneficios/tiers por fases)",
    ],
    highlights: [
      "Pensado para uso intensivo",
      "Auditoría + control superior",
      "Roadmap premium por fases",
    ],
    footnote: "Para usuarios que quieren lo más completo.",
  },
];

const COMPARE_ROWS: Array<{ label: string; starter: boolean | string; pro: boolean | string; elite: boolean | string }> = [
  { label: "Demo $100 recargable", starter: true, pro: true, elite: true },
  { label: "Cuenta real (según conexión disponible)", starter: "Limitado", pro: true, elite: true },
  { label: "Capital Shield (control de riesgo)", starter: "Básico", pro: "Avanzado", elite: "Avanzado+" },
  { label: "Firewall de Trading (ejecución)", starter: "Básico", pro: "Fuerte", elite: "Fuerte+" },
  { label: "Adaptive Optimizer (SL/TP y filtros)", starter: false, pro: true, elite: true },
  { label: "Meta-Estrategias (por régimen)", starter: false, pro: true, elite: true },
  { label: "AI News Reaction (alto impacto)", starter: false, pro: false, elite: true },
  { label: "Market Radar 360°", starter: "Básico", pro: true, elite: true },
  { label: "Multi-Broker Engine (por fases)", starter: false, pro: "Por fases", elite: "Avanzado" },
  { label: "Neuro Chat", starter: "Fair use", pro: "Fair use+", elite: "Premium" },
  { label: "Logs / Trazabilidad", starter: true, pro: "Mejorado", elite: "Avanzado" },
  { label: "Soporte", starter: "Standard", pro: "Prioritario", elite: "Premium" },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function money(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default function PricingPage() {
  const [billing, setBilling] = useState<Billing>("mensual");

  const plansView = useMemo(() => {
    return PLANS.map((p) => {
      const price = billing === "mensual" ? p.priceMonthly : p.priceAnnual;
      const cadence = billing === "mensual" ? "/mes" : "/año";
      const perMonthAnnual = Math.round(p.priceAnnual / 12);
      const savingsPct =
        billing === "anual" ? Math.round((1 - p.priceAnnual / (p.priceMonthly * 12)) * 100) : 0;

      return { ...p, price, cadence, perMonthAnnual, savingsPct };
    });
  }, [billing]);

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
                    Planes de <span className="text-emerald-400">Neuro</span>
                  </>
                }
                subtitle="Transparencia • Control de riesgo • Sin promesas irreales"
                right={
                  <div className="flex flex-wrap gap-3">
                    <FXButtonPro href="/download" variant="primary" size="sm">
                      Descargar
                    </FXButtonPro>
                    <FXButtonPro href="/neuro-chat" variant="outline" size="sm">
                      Preguntar a Neuro Chat
                    </FXButtonPro>
                  </div>
                }
              >
                <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
                  <div className="lg:col-span-8">
                    <p className="text-white/75 text-sm md:text-base leading-relaxed max-w-3xl">
                      Neuro está diseñado para <b className="text-white/90">disciplina</b> y <b className="text-white/90">control</b>.
                      No vendemos “milagros”: vendemos herramientas para operar con reglas, límites y trazabilidad.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <FXButtonPro href="/security" variant="secondary" size="lg">
                        Ver seguridad
                      </FXButtonPro>
                      <FXButtonPro href="/technology" variant="outline" size="lg">
                        Ver tecnología
                      </FXButtonPro>
                    </div>

                    <p className="mt-4 text-xs md:text-sm text-white/55 max-w-3xl">
                      Neuro no custodia fondos. Tus fondos permanecen en tu broker. Operar implica riesgo.
                    </p>
                  </div>

                  <div className="lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
                      <div className="text-sm text-white/70">Facturación</div>
                      <div className="mt-3 inline-flex rounded-2xl border border-white/10 bg-black/35 p-1">
                        <button
                          type="button"
                          onClick={() => setBilling("mensual")}
                          className={cx(
                            "px-4 py-2 text-sm rounded-xl transition",
                            billing === "mensual"
                              ? "bg-emerald-500/90 text-black font-semibold"
                              : "text-white/80 hover:text-white"
                          )}
                        >
                          Mensual
                        </button>
                        <button
                          type="button"
                          onClick={() => setBilling("anual")}
                          className={cx(
                            "px-4 py-2 text-sm rounded-xl transition",
                            billing === "anual"
                              ? "bg-emerald-500/90 text-black font-semibold"
                              : "text-white/80 hover:text-white"
                          )}
                        >
                          Anual{" "}
                          <span className="ml-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-200">
                            2 meses gratis
                          </span>
                        </button>
                      </div>

                      {billing === "anual" ? (
                        <div className="mt-3 text-xs text-white/60">
                          Pagas 10 meses y usas 12. Mejor para quedarte y progresar.
                        </div>
                      ) : (
                        <div className="mt-3 text-xs text-white/60">Puedes cambiar o cancelar cuando quieras.</div>
                      )}
                    </div>
                  </div>
                </div>
              </Panel3D>
            </Container>
          </section>

          {/* CARDS */}
          <section className="pb-10 md:pb-14">
            <Container>
              <div className="grid gap-4 lg:grid-cols-3">
                {plansView.map((p) => (
                  <PlanCard key={p.key} plan={p} billing={billing} />
                ))}
              </div>

              {/* TRUST STRIP */}
              <div className="mt-8 grid gap-3 md:grid-cols-3">
                {[
                  ["Sin custodia", "Tu dinero siempre queda en el broker."],
                  ["Control de riesgo", "Límites, pausas y protecciones reales."],
                  ["Transparencia", "Neuro no promete ganancias garantizadas."],
                ].map(([t, d]) => (
                  <div
                    key={t}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_14px_50px_rgba(0,0,0,0.45)]"
                  >
                    <div className="text-sm font-semibold text-white/90">{t}</div>
                    <div className="mt-2 text-sm text-white/70">{d}</div>
                  </div>
                ))}
              </div>
            </Container>
          </section>

          {/* COMPARATIVA */}
          <section className="pb-10 md:pb-14">
            <Container>
              <Panel3D title="Comparativa" subtitle="Qué incluye cada plan">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] border-separate border-spacing-0">
                    <thead>
                      <tr>
                        <th className="text-left text-xs text-white/60 font-medium py-3">Característica</th>
                        <th className="text-left text-xs text-white/60 font-medium py-3">Starter</th>
                        <th className="text-left text-xs text-white/60 font-medium py-3">Pro</th>
                        <th className="text-left text-xs text-white/60 font-medium py-3">Elite</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARE_ROWS.map((r) => (
                        <tr key={r.label} className="border-t border-white/10">
                          <td className="py-4 text-sm text-white/80">{r.label}</td>
                          <td className="py-4 text-sm">{Cell(r.starter)}</td>
                          <td className="py-4 text-sm">{Cell(r.pro)}</td>
                          <td className="py-4 text-sm">{Cell(r.elite)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <FXButtonPro href="/download" variant="primary" size="lg">
                    Descargar Neuro
                  </FXButtonPro>
                  <FXButtonPro href="/neuro-chat" variant="outline" size="lg">
                    Preguntar a Neuro Chat
                  </FXButtonPro>
                </div>
              </Panel3D>
            </Container>
          </section>

          {/* FAQ */}
          <section className="pb-10 md:pb-14">
            <Container>
              <Panel3D title="Preguntas frecuentes" subtitle="Respuestas claras (sin humo)">
                <div className="grid gap-4 md:grid-cols-2">
                  <Faq
                    q="¿Neuro garantiza ganancias?"
                    a="No. El trading implica riesgo. Neuro es una plataforma de control, automatización y disciplina bajo reglas. La decisión final siempre es tuya."
                  />
                  <Faq
                    q="¿Neuro custodia mi dinero?"
                    a="No. Tus fondos se mantienen en tu broker. Neuro solo envía órdenes bajo tus permisos y límites configurados."
                  />
                  <Faq
                    q="¿Puedo usarlo como novato?"
                    a="Sí. Starter está diseñado para aprender con modo Novato, demo y reglas claras. Recomendación: empieza en demo y escala progresivamente."
                  />
                  <Faq
                    q="¿Qué significa 'por fases' en brokers?"
                    a="Al inicio, la conexión puede ser por MT5 Bridge (MT5 oculto). Luego se habilitan rutas más directas cuando el broker lo permite (API/FIX)."
                  />
                  <Faq
                    q="¿Cómo funciona Neuro Chat?"
                    a="Es un chat híbrido para guiarte y explicarte riesgo/decisiones. No promete resultados; prioriza seguridad y claridad."
                  />
                  <Faq
                    q="¿Anual tiene descuento?"
                    a="Sí. Anual equivale a 2 meses gratis (pagas 10 y usas 12)."
                  />
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/35 p-5 text-sm text-white/70">
                  Consejo Neuro: si tu objetivo es quedarte y mejorar, el plan anual es el más eficiente. Si estás probando, empieza mensual.
                </div>

                <footer className="pt-10 text-xs text-white/55">
                  © {new Date().getFullYear()} Neuro Trading — Pricing.
                </footer>
              </Panel3D>
            </Container>
          </section>
        </main>
      </div>
    </FXBackground>
  );
}

function PlanCard({
  plan,
  billing,
}: {
  plan: Plan & { price: number; cadence: string; perMonthAnnual: number; savingsPct: number };
  billing: Billing;
}) {
  const accentRing =
    plan.accent === "emerald"
      ? "ring-emerald-300/10"
      : plan.accent === "sky"
      ? "ring-sky-300/10"
      : "ring-amber-300/10";

  const topGlow =
    plan.accent === "emerald"
      ? "bg-emerald-500/10"
      : plan.accent === "sky"
      ? "bg-sky-500/10"
      : "bg-amber-500/10";

  const borderGrad =
    plan.accent === "emerald"
      ? "from-emerald-500/35 via-sky-500/20 to-indigo-500/30"
      : plan.accent === "sky"
      ? "from-sky-500/35 via-indigo-500/20 to-emerald-500/25"
      : "from-amber-500/35 via-emerald-500/15 to-indigo-500/25";

  return (
    <div className={cx("relative rounded-3xl p-0.5 bg-linear-to-r", borderGrad)}>
      <div className={cx("relative overflow-hidden rounded-3xl border border-white/10 bg-black/45 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.70)]", accentRing, "ring-1")}>
        <div aria-hidden className={cx("pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl", topGlow)} />
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />

        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-lg md:text-xl font-semibold text-white/90">{plan.name}</div>
              <div className="mt-1 text-sm text-white/65">{plan.tagline}</div>
            </div>

            {plan.badge ? (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                {plan.badge}
              </span>
            ) : null}
          </div>

          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <div className="text-4xl font-semibold text-white">
                {money(plan.price)}
                <span className="ml-2 text-base font-medium text-white/55">{plan.cadence}</span>
              </div>

              {billing === "anual" ? (
                <div className="mt-1 text-xs text-white/60">
                  ≈ {money(plan.perMonthAnnual)}/mes • ahorro {plan.savingsPct}% vs mensual
                </div>
              ) : (
                <div className="mt-1 text-xs text-white/60">Cancela cuando quieras</div>
              )}
            </div>

            <div className="shrink-0">
              <FXButtonPro href="/download" variant={plan.ctaVariant} size="md">
                Empezar
              </FXButtonPro>
            </div>
          </div>

          <div className="mt-5">
            <div className="text-xs text-white/60">Incluye</div>
            <ul className="mt-3 space-y-2 text-sm text-white/75">
              {plan.includes.map((x) => (
                <li key={x} className="flex gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-400/80" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/35 p-4">
            <div className="text-xs text-white/60">Lo mejor de este plan</div>
            <ul className="mt-2 space-y-1 text-sm text-white/75">
              {plan.highlights.map((x) => (
                <li key={x} className="text-white/70">
                  • {x}
                </li>
              ))}
            </ul>
            {plan.footnote ? <div className="mt-3 text-xs text-white/55">{plan.footnote}</div> : null}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <FXButtonPro href="/neuro-chat" variant="outline" size="sm">
              Preguntar
            </FXButtonPro>
            <FXButtonPro href="/security" variant="ghost" size="sm">
              Ver seguridad
            </FXButtonPro>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cell(v: boolean | string) {
  if (typeof v === "boolean") {
    return (
      <span className={cx("inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
        v ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-200" : "border-white/10 bg-black/25 text-white/55"
      )}>
        {v ? "Incluido" : "—"}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-white/70">
      {v}
    </span>
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