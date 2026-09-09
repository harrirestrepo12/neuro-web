import React from "react";
import Navbar from "@/components/site/Navbar";
import FXBackground from "@/components/site/FXBackground";
import Container from "@/components/layout/Container";
import FXButtonPro from "@/components/site/FXButtonPro";
import Panel3D from "@/components/site/Panel3D";
import { NEURO_REGISTER_URL } from "@/lib/neuroLinks";

const protectionBlocks = [
  {
    title: "Fondos en tu broker",
    desc: "Neuro no custodia fondos. El capital permanece siempre en tu broker regulado. Neuro solo envía órdenes bajo tus permisos.",
    tone: "emerald",
  },
  {
    title: "Capital Shield IA",
    desc: "Límites por operación, sesión y exposición global. Freeze automático ante riesgo extremo.",
    tone: "emerald",
  },
  {
    title: "Firewall de Trading",
    desc: "Detección de slippage anómalo, latencia elevada y spreads manipulados. Bloqueo automático si la ejecución se degrada.",
    tone: "amber",
  },
  {
    title: "Modo Ultra Seguro",
    desc: "Reglas conservadoras obligatorias en cuentas reales: reducción de velocidad y confirmación adicional.",
    tone: "amber",
  },
  {
    title: "Trazabilidad total",
    desc: "Cada decisión IA queda registrada en logs para auditoría interna y revisión del usuario.",
    tone: "sky",
  },
  {
    title: "Cifrado y autenticación",
    desc: "Comunicación cifrada (HTTPS/WSS), protección contra abuso y estructura preparada para 2FA.",
    tone: "sky",
  },
] as const;

const trustBullets = [
  "Neuro no custodia fondos. Tu capital permanece en tu broker.",
  "Neuro ejecuta solo bajo permisos y reglas configuradas.",
  "Riesgo controlado: límites, pausas, validaciones y trazabilidad.",
  "Transparencia: sin promesas irreales, sin “milagros”.",
];

const trustMatrix = [
  ["Custodia", "Fondos en broker. Neuro no recibe ni retiene capital."],
  ["Riesgo", "Capital Shield IA + límites dinámicos + pausas automáticas."],
  ["Ejecución", "Firewall contra degradación, latencia y condiciones anómalas."],
  ["Auditoría", "Logs y trazabilidad para revisión interna y del usuario."],
] as const;

const principles = [
  {
    title: "No custodia",
    desc: "Neuro no actúa como custodio de tu dinero. El capital sigue en la infraestructura del broker.",
  },
  {
    title: "Control real",
    desc: "Cada orden se ejecuta bajo reglas, límites y estados operativos definidos por diseño.",
  },
  {
    title: "Disciplina operativa",
    desc: "Neuro prioriza contexto, riesgo y ejecución antes que velocidad sin control.",
  },
] as const;

export default function SecurityPage() {
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
                    Seguridad y Control en <span className="text-emerald-400">Neuro</span>
                  </>
                }
                subtitle="Seguridad • Riesgo • Ejecución • Auditoría"
                right={
                  <div className="flex flex-wrap gap-3">
                    <FXButtonPro href="/brokers" variant="outline" size="sm">
                      Ver brokers
                    </FXButtonPro>
                    <FXButtonPro href="/technology" variant="secondary" size="sm">
                      Ver tecnología
                    </FXButtonPro>
                  </div>
                }
              >
                <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                  <div className="lg:col-span-7">
                    <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-sm text-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.85)]" />
                      Diseño institucional • control de riesgo • transparencia operativa
                    </p>

                    <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl xl:text-7xl">
                      Seguridad primero, <span className="text-emerald-400">ganancia después</span>
                    </h1>

                    <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/80 md:text-xl">
                      Neuro fue diseñado como plataforma de{" "}
                      <b className="text-white/92">control, protección y disciplina operativa</b>. No vende fantasías:
                      reduce fricción, impone límites y prioriza estabilidad antes de ejecutar.
                    </p>

                    <ul className="mt-6 space-y-3 text-sm text-white/75 md:text-base">
                      {trustBullets.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-400/90" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7 flex flex-wrap gap-3">
                      <FXButtonPro href="/pricing" variant="primary" size="lg">
                        Ver planes
                      </FXButtonPro>
                      <FXButtonPro href={NEURO_REGISTER_URL} variant="outline" size="lg">
                        Probar Neuro 30 días
                      </FXButtonPro>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                      <Pill text="No custodio" tone="emerald" />
                      <Pill text="Risk-aware" tone="amber" />
                      <Pill text="Auditable" tone="sky" />
                      <Pill text="Execution control" tone="white" />
                    </div>

                    <p className="mt-4 max-w-3xl text-xs text-white/55 md:text-sm">
                      Neuro no custodia fondos. Tus fondos permanecen en tu broker. Neuro solo envía órdenes bajo tus
                      permisos, límites y reglas activas.
                    </p>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,12,18,0.94)_0%,rgba(7,10,16,0.88)_100%)] p-6 shadow-[0_28px_100px_rgba(0,0,0,0.60)] backdrop-blur-xl md:p-7">
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(52,211,153,0.12),transparent_30%),radial-gradient(circle_at_82%_0%,rgba(56,189,248,0.10),transparent_28%)]"
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-[1px] rounded-[29px] border border-white/5"
                      />

                      <div className="relative">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                            <div className="text-sm text-white/88">Neuro Security Status</div>
                          </div>
                          <div className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-200">
                            OK
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3">
                          {trustMatrix.map(([label, value]) => (
                            <div
                              key={label}
                              className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_14px_50px_rgba(0,0,0,0.38)] transition hover:-translate-y-0.5 hover:border-white/15"
                            >
                              <div className="text-xs text-white/56">{label}</div>
                              <div className="mt-1 text-sm text-white/86 md:text-base">{value}</div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3">
                          <div className="text-xs font-medium uppercase tracking-[0.14em] text-emerald-200/90">
                            Principio de operación
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-emerald-100/90">
                            Si el mercado se vuelve inseguro, Neuro prioriza{" "}
                            <b className="text-emerald-100">proteger capital y ejecución</b> antes que forzar actividad.
                          </p>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3">
                          <FXButtonPro href="/technology" variant="secondary" size="sm">
                            Ver stack
                          </FXButtonPro>
                          <FXButtonPro href="/neuro-chat" variant="outline" size="sm">
                            Preguntar a Neuro Chat
                          </FXButtonPro>
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
              <Panel3D title="Principio fundamental" subtitle="Custodia, control y responsabilidad operativa">
                <div className="grid gap-6 md:grid-cols-12 md:items-start">
                  <div className="md:col-span-7">
                    <p className="text-base leading-relaxed text-white/80 md:text-xl">
                      Neuro <b className="text-white/92">no recibe, no custodia y no controla</b> tu dinero. Tus fondos
                      permanecen en tu broker. Neuro únicamente envía órdenes bajo tus reglas, límites y permisos.
                    </p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {principles.map((item) => (
                        <MiniCard key={item.title} title={item.title}>
                          {item.desc}
                        </MiniCard>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-5">
                    <div className="rounded-[28px] border border-emerald-400/25 bg-emerald-500/10 p-6 shadow-[0_18px_70px_rgba(16,185,129,0.10)]">
                      <div className="text-sm font-semibold text-emerald-200 md:text-base">Regla de oro</div>
                      <p className="mt-3 text-sm leading-relaxed text-emerald-100/90 md:text-base">
                        Si el mercado está peligroso, Neuro prioriza <b>proteger</b> antes que “forzar” operaciones.
                      </p>

                      <div className="mt-5 grid gap-3">
                        <FlowStep label="Mercado" active />
                        <FlowStep label="Validación de riesgo" active />
                        <FlowStep label="Ejecución" />
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3">
                        <FXButtonPro href="/market" variant="outline" size="sm">
                          Ver mercado
                        </FXButtonPro>
                        <FXButtonPro href="/pricing" variant="secondary" size="sm">
                          Ver planes
                        </FXButtonPro>
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
                  <h2 className="text-2xl font-semibold text-white md:text-3xl">Capas de protección</h2>
                  <p className="mt-2 max-w-3xl text-white/70">
                    Seguridad técnica + seguridad operativa. El objetivo es reducir errores, controlar exposición y
                    bloquear ejecuciones peligrosas.
                  </p>
                </div>

                <div className="hidden gap-3 md:flex">
                  <FXButtonPro href="/technology" variant="outline" size="sm">
                    Ver tecnología
                  </FXButtonPro>
                  <FXButtonPro href="/brokers" variant="ghost" size="sm">
                    Ver brokers
                  </FXButtonPro>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {protectionBlocks.map((block) => (
                  <Card3D
                    key={block.title}
                    title={block.title}
                    desc={block.desc}
                    tone={block.tone}
                  />
                ))}
              </div>

              <div className="mt-6 flex gap-3 md:hidden">
                <FXButtonPro href="/technology" variant="outline" size="sm">
                  Ver tecnología
                </FXButtonPro>
                <FXButtonPro href="/brokers" variant="secondary" size="sm">
                  Ver brokers
                </FXButtonPro>
              </div>
            </Container>
          </section>

          <section className="pb-10 md:pb-14">
            <Container>
              <Panel3D title="Aviso de riesgo" subtitle="Transparencia, responsabilidad y contexto real">
                <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
                  <div className="lg:col-span-8">
                    <p className="max-w-4xl text-sm leading-relaxed text-white/80 md:text-base">
                      El trading implica riesgo de pérdida de capital. Neuro es una herramienta de control,
                      automatización y validación operativa bajo reglas; no garantiza resultados. Tú controlas la
                      decisión final.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <FXButtonPro href="/pricing" variant="primary" size="lg">
                        Ver planes
                      </FXButtonPro>
                      <FXButtonPro href={NEURO_REGISTER_URL} variant="outline" size="lg">
                        Probar Neuro 30 días
                      </FXButtonPro>
                    </div>
                  </div>

                  <div className="lg:col-span-4">
                    <div className="rounded-[24px] border border-white/10 bg-black/25 p-5">
                      <div className="text-xs uppercase tracking-[0.16em] text-white/46">Resumen</div>
                      <div className="mt-3 space-y-3 text-sm text-white/72">
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                          Neuro no custodia capital.
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                          Neuro ejecuta bajo reglas.
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                          Neuro prioriza protección y contexto.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <footer className="pt-10 text-xs text-white/55">© {year} Neuro Trading — Security.</footer>
              </Panel3D>
            </Container>
          </section>
        </main>
      </div>
    </FXBackground>
  );
}

function Card3D({
  title,
  desc,
  tone,
}: {
  title: string;
  desc: string;
  tone: "emerald" | "amber" | "sky";
}) {
  const glow =
    tone === "emerald"
      ? "from-emerald-500/25 via-emerald-400/10 to-sky-500/15"
      : tone === "amber"
        ? "from-amber-500/25 via-amber-400/10 to-rose-500/15"
        : "from-sky-500/25 via-sky-400/10 to-indigo-500/15";

  return (
    <div className={`relative rounded-[28px] p-[1px] bg-gradient-to-r ${glow}`}>
      <div className="relative overflow-hidden rounded-[27px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,12,18,0.94)_0%,rgba(7,10,16,0.88)_100%)] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.62)] transition hover:-translate-y-1 hover:border-white/15">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,transparent_45%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[1px] rounded-[26px] border border-white/5"
        />

        <div className="relative">
          <div className="text-base font-semibold text-white/92 md:text-lg">{title}</div>
          <p className="mt-3 text-sm leading-relaxed text-white/74 md:text-base">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function MiniCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/5 p-5 shadow-[0_14px_50px_rgba(0,0,0,0.34)]">
      <div className="text-sm font-semibold text-white/90">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-white/70">{children}</div>
    </div>
  );
}

function Pill({
  text,
  tone,
}: {
  text: string;
  tone: "emerald" | "amber" | "sky" | "white";
}) {
  const cls =
    tone === "emerald"
      ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-200"
      : tone === "amber"
        ? "border-amber-400/25 bg-amber-500/10 text-amber-200"
        : tone === "sky"
          ? "border-sky-400/25 bg-sky-500/10 text-sky-200"
          : "border-white/10 bg-white/5 text-white/70";

  return <span className={`rounded-full border px-3 py-1 text-[11px] ${cls}`}>{text}</span>;
}

function FlowStep({
  label,
  active,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border px-3 py-3 text-center text-xs font-medium",
        active
          ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-200"
          : "border-white/10 bg-white/5 text-white/45",
      ].join(" ")}
    >
      {label}
    </div>
  );
}