"use client";

import React from "react";
import Image from "next/image";
import Navbar from "@/components/site/Navbar";
import FXBackground from "@/components/site/FXBackground";
import Container from "@/components/layout/Container";
import Panel3D from "@/components/site/Panel3D";
import PwaInstallButton from "@/components/site/PwaInstallButton";
import { NEURO_BRAND } from "@/lib/neuroBrand";

const APP_URL = "https://app.neurotrading.app/app";

type DownloadStatus = "Disponible" | "Próximamente";

type DownloadOption = {
  platform: string;
  status: DownloadStatus;
  title: string;
  description: string;
  details: string[];
  primary?: {
    label: string;
    href: string;
  };
};

const downloads: DownloadOption[] = [
  {
    platform: "Web / PWA",
    status: "Disponible",
    title: "Neuro Trading Web App",
    description:
      "Acceso inmediato desde navegador. También puede instalarse como aplicación web progresiva en Chrome o Edge.",
    details: ["Disponible ahora", "Instalable", "Actualización automática", "Ideal para beta privada"],
    primary: {
      label: "Abrir plataforma",
      href: APP_URL,
    },
  },
  {
    platform: "Windows",
    status: "Próximamente",
    title: "Neuro Trading Desktop para Windows",
    description:
      "Instalador dedicado para PC, pensado para usuarios que operan con MT5, pantallas grandes y flujo profesional.",
    details: ["Windows 10/11", "Modo escritorio", "Instalador dedicado", "Primera app nativa recomendada"],
  },
  {
    platform: "Android",
    status: "Próximamente",
    title: "Neuro Trading Mobile para Android",
    description:
      "Aplicación móvil para seguimiento, alertas, revisión de cuentas y acceso rápido a Neuro Chat.",
    details: ["APK / Play Store", "Alertas", "Modo móvil", "Publicación por fases"],
  },
  {
    platform: "iOS",
    status: "Próximamente",
    title: "Neuro Trading Mobile para iPhone",
    description:
      "Experiencia móvil premium para usuarios de iPhone y iPad, sujeta a revisión y publicación por App Store.",
    details: ["iPhone / iPad", "App Store", "Notificaciones", "Fase posterior"],
  },
];

const statusClass: Record<DownloadStatus, string> = {
  Disponible: "border-emerald-300/35 bg-emerald-400/10 text-emerald-100",
  Próximamente: "border-white/15 bg-white/[0.04] text-white/65",
};

function DownloadCard({ item }: { item: DownloadOption }) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-black/30 p-6 shadow-2xl backdrop-blur-xl transition hover:border-cyan-300/35 hover:bg-white/[0.05]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
          {item.platform}
        </span>
        <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${statusClass[item.status]}`}>
          {item.status}
        </span>
      </div>

      <h2 className="mt-5 text-2xl font-black text-white">{item.title}</h2>
      <p className="mt-3 text-sm leading-7 text-white/70">{item.description}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {item.details.map((detail) => (
          <span
            key={detail}
            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white/70"
          >
            {detail}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {item.primary ? (
          <a
            href={item.primary.href}
            className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-white"
          >
            {item.primary.label}
          </a>
        ) : (
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold text-white/45">
            En preparación
          </span>
        )}

        {item.platform === "Web / PWA" ? (
          <PwaInstallButton label="Instalar portal web" />
        ) : null}
      </div>
    </article>
  );
}

export default function DownloadPage() {
  return (
    <FXBackground imageSrc="/ai/neuro-bg.jpg" className="min-h-screen" imageOpacity={0.34}>
      <div className="min-h-screen">
        <Navbar />

        <main className="pt-20">
          <section className="py-8 md:py-12">
            <Container>
              <Panel3D
                title={
                  <>
                    Descargar <span className="text-emerald-400">Neuro Trading</span>
                  </>
                }
                subtitle="Web App disponible • Windows, Android e iOS por fases • Plataforma con identidad empresarial"
                right={
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={APP_URL}
                      className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-white"
                    >
                      Abrir plataforma
                    </a>
                    <PwaInstallButton label="Instalar Neuro Web" />
                  </div>
                }
              >
                <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                  <div className="lg:col-span-8">
                    <div className="flex items-center gap-4">
                      <Image
                        src={NEURO_BRAND.assets.icon}
                        alt={NEURO_BRAND.name}
                        width={64}
                        height={64}
                        unoptimized
                        className="h-16 w-16 rounded-3xl shadow-[0_0_40px_rgba(34,211,238,0.32)]"
                      />
                      <div>
                        <div className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">
                          Neuro Trading Download Center
                        </div>
                        <h1 className="mt-2 text-3xl font-black text-white md:text-5xl">
                          Una plataforma. Todas las formas de acceso.
                        </h1>
                      </div>
                    </div>

                    <p className="mt-6 max-w-4xl text-sm leading-7 text-white/72 md:text-base">
                      Empezamos con la versión web instalable porque permite lanzar rápido, validar usuarios y operar una beta
                      privada sin esperar tiendas de aplicaciones. Luego publicamos Windows Desktop, Android e iOS por fases.
                    </p>

                    <div className="mt-6 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-50">
                      Neuro no custodia fondos. Tus fondos permanecen en tu broker. Operar implica riesgo y los resultados no
                      están garantizados.
                    </div>
                  </div>

                  <div className="lg:col-span-4">
                    <div className="rounded-[2rem] border border-white/10 bg-black/35 p-6">
                      <div className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
                        Disponible ahora
                      </div>
                      <div className="mt-3 text-2xl font-black text-white">Web App / PWA</div>
                      <p className="mt-3 text-sm leading-6 text-white/65">
                        Abre la plataforma, inicia sesión y usa la opción de instalación del navegador para tener Neuro como app.
                      </p>
                      <a
                        href={APP_URL}
                        className="mt-5 inline-flex rounded-full bg-emerald-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-white"
                      >
                        Abrir plataforma
                      </a>
                    </div>
                  </div>
                </div>
              </Panel3D>
            </Container>
          </section>

          <section className="pb-12 md:pb-16">
            <Container>
              <div className="mb-6">
                <h2 className="text-2xl font-black text-white md:text-3xl">Opciones de descarga</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/65">
                  Mostramos todas las plataformas desde ahora, pero solo habilitamos descarga real cuando cada versión esté
                  validada para producción.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {downloads.map((item) => (
                  <DownloadCard key={item.platform} item={item} />
                ))}
              </div>
            </Container>
          </section>

          <section className="pb-16">
            <Container>
              <div className="grid gap-5 rounded-[2rem] border border-white/10 bg-black/30 p-6 md:grid-cols-3">
                <div>
                  <div className="text-sm font-black text-cyan-200">1. Abrir</div>
                  <p className="mt-2 text-sm leading-6 text-white/65">Entra a la plataforma desde el botón Abrir plataforma.</p>
                </div>
                <div>
                  <div className="text-sm font-black text-cyan-200">2. Instalar</div>
                  <p className="mt-2 text-sm leading-6 text-white/65">En Chrome o Edge usa Instalar aplicación o Agregar a pantalla de inicio.</p>
                </div>
                <div>
                  <div className="text-sm font-black text-cyan-200">3. Operar con control</div>
                  <p className="mt-2 text-sm leading-6 text-white/65">Empieza en demo, revisa seguridad y pasa a real solo con límites estrictos.</p>
                </div>
              </div>
            </Container>
          </section>
        </main>
      </div>
    </FXBackground>
  );
}
