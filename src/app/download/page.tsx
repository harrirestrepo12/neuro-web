"use client";

import React from "react";
import Navbar from "@/components/site/Navbar";
import FXBackground from "@/components/site/FXBackground";
import Container from "@/components/layout/Container";
import FXButtonPro from "@/components/site/FXButtonPro";
import Panel3D from "@/components/site/Panel3D";

type Platform = "Windows" | "Android" | "iOS" | "Web";
type Status = "Live" | "Próximamente";

type DownloadItem = {
  key: string;
  platform: Platform;
  status: Status;
  title: string;
  desc: string;
  chips: string[];
  primaryCta: { label: string; href: string; variant: "primary" | "secondary" | "outline" | "ghost"; disabled?: boolean };
  secondaryCta?: { label: string; href: string; variant: "primary" | "secondary" | "outline" | "ghost"; disabled?: boolean };
};

const DOWNLOADS: DownloadItem[] = [
  {
    key: "windows",
    platform: "Windows",
    status: "Próximamente",
    title: "Neuro Trading Desktop",
    desc: "Experiencia completa en PC. Ideal para paneles grandes, control y seguimiento en tiempo real.",
    chips: ["Windows 10/11", "Mejor rendimiento", "Panel completo"],
    primaryCta: { label: "Descargar (próximamente)", href: "#", variant: "primary", disabled: true },
    secondaryCta: { label: "Ver planes", href: "/pricing", variant: "outline" },
  },
  {
    key: "android",
    platform: "Android",
    status: "Próximamente",
    title: "Neuro Trading Mobile (Android)",
    desc: "Control desde el celular: monitoreo, alertas, modo novato y acceso rápido.",
    chips: ["Android", "Alertas", "Modo Novato"],
    primaryCta: { label: "Play Store (próximamente)", href: "#", variant: "primary", disabled: true },
    secondaryCta: { label: "Preguntar a Neuro Chat", href: "/neuro-chat", variant: "outline" },
  },
  {
    key: "ios",
    platform: "iOS",
    status: "Próximamente",
    title: "Neuro Trading Mobile (iOS)",
    desc: "Acceso móvil con experiencia premium. Publicación por fases.",
    chips: ["iPhone/iPad", "Fase de publicación", "Notificaciones"],
    primaryCta: { label: "App Store (próximamente)", href: "#", variant: "primary", disabled: true },
    secondaryCta: { label: "Ver seguridad", href: "/security", variant: "outline" },
  },
  {
    key: "web",
    platform: "Web",
    status: "Live",
    title: "Neuro Web (este portal)",
    desc: "Información, planes, seguridad, tecnología y acceso a Neuro Chat.",
    chips: ["Web", "Neuro Chat", "Actualizaciones"],
    primaryCta: { label: "Abrir Neuro Chat", href: "/neuro-chat", variant: "secondary" },
    secondaryCta: { label: "Ver tecnología", href: "/technology", variant: "outline" },
  },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const STATUS_STYLE: Record<Status, string> = {
  Live: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
  Próximamente: "border-white/15 bg-black/20 text-white/70",
};

const PLATFORM_STYLE: Record<Platform, string> = {
  Windows: "border-sky-400/25 bg-sky-500/10 text-sky-200",
  Android: "border-emerald-400/25 bg-emerald-500/10 text-emerald-200",
  iOS: "border-white/15 bg-black/20 text-white/70",
  Web: "border-amber-400/25 bg-amber-500/10 text-amber-200",
};

export default function DownloadPage() {
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
                    Descargar <span className="text-emerald-400">Neuro Trading</span>
                  </>
                }
                subtitle="Instalación por fases • Transparencia • Control de riesgo"
                right={
                  <div className="flex flex-wrap gap-3">
                    <FXButtonPro href="/pricing" variant="primary" size="sm">
                      Ver planes
                    </FXButtonPro>
                    <FXButtonPro href="/security" variant="outline" size="sm">
                      Ver seguridad
                    </FXButtonPro>
                  </div>
                }
              >
                <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
                  <div className="lg:col-span-8">
                    <p className="text-white/75 text-sm md:text-base leading-relaxed max-w-3xl">
                      Neuro está diseñado para operar con <b className="text-white/90">disciplina</b> y{" "}
                      <b className="text-white/90">control</b>. Aquí encontrarás las descargas por plataforma y una guía rápida.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <FXButtonPro href="/neuro-chat" variant="secondary" size="lg">
                        Preguntar a Neuro Chat
                      </FXButtonPro>
                      <FXButtonPro href="/technology" variant="outline" size="lg">
                        Ver tecnología
                      </FXButtonPro>
                      <FXButtonPro href="/brokers" variant="ghost" size="lg">
                        Ver brokers
                      </FXButtonPro>
                    </div>

                    <p className="mt-4 text-xs md:text-sm text-white/55 max-w-3xl">
                      Neuro no custodia fondos. Tus fondos permanecen en tu broker. Operar implica riesgo.
                    </p>
                  </div>

                  <div className="lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
                      <div className="text-sm text-white/70">Recomendación</div>
                      <div className="mt-2 text-sm text-white/80 leading-relaxed">
                        Si estás empezando: instala Neuro y usa <b className="text-white/90">Demo</b> primero. Luego pasa a real
                        con límites estrictos.
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <FXButtonPro href="/pricing" variant="outline" size="sm">
                          Elegir plan
                        </FXButtonPro>
                        <FXButtonPro href="/security" variant="ghost" size="sm">
                          Leer seguridad
                        </FXButtonPro>
                      </div>
                    </div>
                  </div>
                </div>
              </Panel3D>
            </Container>
          </section>

          {/* DOWNLOAD CARDS */}
          <section className="pb-10 md:pb-14">
            <Container>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-white">Descargas</h2>
                  <p className="mt-2 text-white/70 max-w-3xl">
                    Publicación por fases. Si un instalador aún no está “Live”, puedes avanzar usando Neuro Web + Neuro Chat y
                    preparar tu entorno.
                  </p>
                </div>

                <div className="hidden md:flex gap-3">
                  <FXButtonPro href="/neuro-chat" variant="outline" size="sm">
                    Soporte rápido
                  </FXButtonPro>
                  <FXButtonPro href="/pricing" variant="secondary" size="sm">
                    Ver planes
                  </FXButtonPro>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                {DOWNLOADS.map((d) => (
                  <DownloadCard key={d.key} item={d} />
                ))}
              </div>

              <div className="mt-6 flex md:hidden gap-3">
                <FXButtonPro href="/neuro-chat" variant="outline" size="sm">
                  Soporte rápido
                </FXButtonPro>
                <FXButtonPro href="/pricing" variant="secondary" size="sm">
                  Ver planes
                </FXButtonPro>
              </div>
            </Container>
          </section>

          {/* QUICK START */}
          <section className="pb-10 md:pb-14">
            <Container>
              <Panel3D title="Guía rápida" subtitle="3 pasos para empezar sin errores">
                <div className="grid gap-4 md:grid-cols-3">
                  <StepCard
                    n="1"
                    title="Instala / Accede"
                    desc="Usa la versión disponible. Si tu plataforma está en fases, usa Neuro Web + Neuro Chat mientras se habilita el instalador."
                    chips={["Web", "Desktop", "Mobile"]}
                  />
                  <StepCard
                    n="2"
                    title="Empieza en Demo"
                    desc="Activa demo con saldo inicial y configura límites. Aprende el flujo antes de pasar a real."
                    chips={["Demo", "Modo Novato", "Límites"]}
                  />
                  <StepCard
                    n="3"
                    title="Conecta por fases"
                    desc="Cuando esté listo: broker/MT5 por bridge y luego conexiones más directas cuando aplique (API/FIX)."
                    chips={["MT5 Bridge", "Gateway", "Auditoría"]}
                  />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <MiniInfo
                    title="Requisitos recomendados (PC)"
                    lines={[
                      "Windows 10/11 • 8GB RAM mínimo (16GB recomendado)",
                      "Conexión estable a internet",
                      "Espacio libre 1–2GB (según build)",
                    ]}
                  />
                  <MiniInfo
                    title="Buenas prácticas"
                    lines={[
                      "No operes real sin límites activos",
                      "Evita operar durante noticias de alto impacto si eres novato",
                      "Usa logs: revisa decisiones, no improvises",
                    ]}
                  />
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <FXButtonPro href="/neuro-chat" variant="primary" size="lg">
                    Preguntar soporte
                  </FXButtonPro>
                  <FXButtonPro href="/security" variant="outline" size="lg">
                    Ver seguridad
                  </FXButtonPro>
                  <FXButtonPro href="/technology" variant="ghost" size="lg">
                    Ver tecnología
                  </FXButtonPro>
                </div>
              </Panel3D>
            </Container>
          </section>

          {/* WHAT YOU GET */}
          <section className="pb-10 md:pb-14">
            <Container>
              <Panel3D title="Qué incluye Neuro" subtitle="Lo que obtienes al instalar / usar la plataforma">
                <div className="grid gap-4 md:grid-cols-3">
                  <FeatureCard
                    title="Control de riesgo"
                    desc="Capital Shield + límites por operación/sesión + pausas automáticas ante riesgo."
                  />
                  <FeatureCard
                    title="Protección de ejecución"
                    desc="Firewall detecta degradación (latencia/slippage/spread) y bloquea órdenes peligrosas."
                  />
                  <FeatureCard
                    title="Transparencia"
                    desc="Trazabilidad y logs: Neuro se construye para auditoría y decisiones claras."
                  />
                  <FeatureCard
                    title="Neuro Chat"
                    desc="Asistente híbrido para guiarte y explicarte riesgo y reglas sin prometer ganancias."
                  />
                  <FeatureCard
                    title="Market Watch"
                    desc="Panel de mercado y señales/alertas por fases (cuando esté conectado el feed real)."
                  />
                  <FeatureCard
                    title="Arquitectura por fases"
                    desc="MT5 Bridge → Gateway Multi-Broker → API/FIX (cuando el broker lo permita)."
                  />
                </div>
              </Panel3D>
            </Container>
          </section>

          {/* FAQ */}
          <section className="pb-10 md:pb-14">
            <Container>
              <Panel3D title="FAQ de instalación" subtitle="Errores típicos y solución">
                <div className="grid gap-4 md:grid-cols-2">
                  <Faq
                    q="Le doy a Descargar y dice “próximamente”"
                    a="Está en fase de publicación. Mientras tanto usa Neuro Web + Neuro Chat, revisa planes y deja listo tu entorno (demo, límites, lectura de seguridad)."
                  />
                  <Faq
                    q="¿Neuro necesita MT5?"
                    a="Por fases. Al inicio se puede usar bridge MT5 (MT5 oculto al usuario). Luego se habilitan rutas más directas (API/FIX) si el broker lo permite."
                  />
                  <Faq
                    q="¿Por qué recomiendan demo primero?"
                    a="Porque la prioridad es disciplina y control. En demo validas reglas, límites y consistencia antes de usar dinero real."
                  />
                  <Faq
                    q="¿Neuro garantiza resultados?"
                    a="No. Neuro no promete ganancias garantizadas. Es una herramienta de control/automatización bajo reglas; el trading implica riesgo."
                  />
                </div>

                <footer className="pt-10 text-xs text-white/55">
                  © {new Date().getFullYear()} Neuro Trading — Download.
                </footer>
              </Panel3D>
            </Container>
          </section>
        </main>
      </div>
    </FXBackground>
  );
}

function DownloadCard({ item }: { item: DownloadItem }) {
  return (
    <div className="relative rounded-3xl p-0.5 bg-linear-to-r from-emerald-500/25 via-sky-500/15 to-indigo-500/20">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/45 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.70)] hover:-translate-y-1 hover:border-white/15 transition">
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />

        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-lg md:text-xl font-semibold text-white/90">{item.title}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className={cx("rounded-full border px-3 py-1 text-xs", PLATFORM_STYLE[item.platform])}>
                  {item.platform}
                </span>
                <span className={cx("rounded-full border px-3 py-1 text-xs", STATUS_STYLE[item.status])}>
                  {item.status}
                </span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm md:text-base text-white/75 leading-relaxed">{item.desc}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {item.chips.map((c) => (
              <span key={c} className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-white/70">
                {c}
              </span>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <FXButtonPro
              href={item.primaryCta.href}
              variant={item.primaryCta.variant}
              size="md"
              disabled={item.primaryCta.disabled}
            >
              {item.primaryCta.label}
            </FXButtonPro>

            {item.secondaryCta ? (
              <FXButtonPro
                href={item.secondaryCta.href}
                variant={item.secondaryCta.variant}
                size="md"
                disabled={item.secondaryCta.disabled}
              >
                {item.secondaryCta.label}
              </FXButtonPro>
            ) : null}
          </div>

          <p className="mt-4 text-xs text-white/55">
            Tip: si estás empezando, usa Demo + límites. Si necesitas ayuda, abre Neuro Chat.
          </p>
        </div>
      </div>
    </div>
  );
}

function StepCard({ n, title, desc, chips }: { n: string; title: string; desc: string; chips: string[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_14px_50px_rgba(0,0,0,0.45)]">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-500/10 text-sm font-semibold text-emerald-200">
          {n}
        </span>
        <div className="text-sm md:text-base font-semibold text-white/90">{title}</div>
      </div>
      <p className="mt-3 text-sm text-white/70 leading-relaxed">{desc}</p>
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

function MiniInfo({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/35 p-6 shadow-[0_14px_50px_rgba(0,0,0,0.45)]">
      <div className="text-sm md:text-base font-semibold text-white/90">{title}</div>
      <ul className="mt-3 space-y-2 text-sm text-white/75">
        {lines.map((x) => (
          <li key={x} className="flex gap-2">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-400/80" />
            <span>{x}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_14px_50px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 hover:border-white/15 transition">
      <div className="text-sm md:text-base font-semibold text-white/90">{title}</div>
      <p className="mt-2 text-sm text-white/70 leading-relaxed">{desc}</p>
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