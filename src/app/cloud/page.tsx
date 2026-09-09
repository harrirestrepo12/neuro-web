"use client";

import Image from "next/image";
import Navbar from "@/components/site/Navbar";
import FXBackground from "@/components/site/FXBackground";
import Container from "@/components/layout/Container";
import Panel3D from "@/components/site/Panel3D";
import PwaInstallButton from "@/components/site/PwaInstallButton";
import { NEURO_BRAND } from "@/lib/neuroBrand";
import {
  NEURO_APP_URL,
  NEURO_LOGIN_URL,
  NEURO_REGISTER_URL,
} from "@/lib/neuroLinks";

const cloudBenefits = [
  {
    title: "Sin descarga obligatoria",
    text: "Abre Neuro desde un navegador moderno y entra con tu cuenta. Las mejoras de la plataforma llegan sin reinstalar archivos.",
  },
  {
    title: "Una cuenta, varios dispositivos",
    text: "Usa el mismo acceso de Neuro en PC, tablet o móvil. La experiencia web se adapta al dispositivo.",
  },
  {
    title: "Acceso directo opcional",
    text: "Si lo prefieres, instala un acceso directo tipo app desde Chrome o Edge. No es requisito para usar Neuro.",
  },
  {
    title: "Conexión de trading protegida",
    text: "La operativa real sigue dependiendo de que tu conexión Broker/MT5 esté configurada, disponible y pase los controles de seguridad.",
  },
];

const futureApps = [
  {
    platform: "Windows",
    status: "Roadmap",
    text: "Una app nativa podrá complementar Neuro Cloud para flujos de escritorio, pero no será obligatoria para acceder a la plataforma.",
  },
  {
    platform: "Android",
    status: "Roadmap",
    text: "Experiencia móvil nativa prevista como complemento para alertas, seguimiento y acceso rápido.",
  },
  {
    platform: "iOS",
    status: "Roadmap",
    text: "Experiencia nativa para iPhone y iPad prevista como opción adicional, no como requisito de uso.",
  },
];

export default function CloudPage() {
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
                    Neuro <span className="text-emerald-400">Cloud</span>
                  </>
                }
                subtitle="Acceso online desde navegador · Sin descarga obligatoria · PWA opcional"
                right={
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={NEURO_REGISTER_URL}
                      className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-white"
                    >
                      Probar gratis 30 días
                    </a>
                    <a
                      href={NEURO_LOGIN_URL}
                      className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-black text-cyan-100 transition hover:bg-cyan-300 hover:text-slate-950"
                    >
                      Iniciar sesión
                    </a>
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
                          NEURO CLOUD · ACCESO ONLINE
                        </div>
                        <h1 className="mt-2 text-3xl font-black text-white md:text-5xl">
                          Neuro ahora vive en la nube.
                        </h1>
                      </div>
                    </div>

                    <p className="mt-6 max-w-4xl text-sm leading-7 text-white/72 md:text-base">
                      Neuro se usa online desde <strong className="text-white">app.neurotrading.app</strong>.
                      Crea tu cuenta, inicia sesión y accede al Dashboard, Trading, Neuro Chat,
                      planes y conexiones sin instalar la plataforma completa en cada dispositivo.
                    </p>

                    <div className="mt-6 rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm leading-6 text-emerald-50">
                      La instalación tipo PWA es solo un acceso directo opcional. Neuro Cloud sigue funcionando desde el navegador.
                    </div>

                    <div className="mt-4 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-50">
                      Neuro no custodia fondos. Tus fondos permanecen en tu broker. La operativa real requiere que Broker/MT5,
                      datos y protecciones estén disponibles; operar implica riesgo y no hay resultados garantizados.
                    </div>
                  </div>

                  <div className="lg:col-span-4">
                    <div className="rounded-[2rem] border border-white/10 bg-black/35 p-6">
                      <div className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
                        Disponible ahora
                      </div>
                      <div className="mt-3 text-2xl font-black text-white">Neuro Cloud</div>
                      <p className="mt-3 text-sm leading-6 text-white/65">
                        Acceso web centralizado, actualizaciones automáticas y la misma identidad Neuro desde tus dispositivos.
                      </p>
                      <div className="mt-5 grid gap-3">
                        <a
                          href={NEURO_APP_URL}
                          className="rounded-full bg-emerald-300 px-5 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-white"
                        >
                          Abrir Neuro
                        </a>
                        <PwaInstallButton label="Instalar acceso directo (opcional)" />
                      </div>
                    </div>
                  </div>
                </div>
              </Panel3D>
            </Container>
          </section>

          <section className="pb-12 md:pb-16">
            <Container>
              <div className="mb-6">
                <h2 className="text-2xl font-black text-white md:text-3xl">Cómo acceder a Neuro</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/65">
                  El camino principal es Cloud. Las instalaciones locales quedan como complementos opcionales.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {cloudBenefits.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-[2rem] border border-white/10 bg-black/30 p-6 shadow-2xl backdrop-blur-xl"
                  >
                    <h3 className="text-xl font-black text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/68">{item.text}</p>
                  </article>
                ))}
              </div>
            </Container>
          </section>

          <section className="pb-12 md:pb-16">
            <Container>
              <div className="grid gap-5 rounded-[2rem] border border-white/10 bg-black/30 p-6 md:grid-cols-3">
                <div>
                  <div className="text-sm font-black text-cyan-200">1. Crear cuenta</div>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    Regístrate con tus datos básicos. No necesitas conectar el broker durante el registro.
                  </p>
                </div>
                <div>
                  <div className="text-sm font-black text-cyan-200">2. Activar prueba</div>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    Dentro de Neuro puedes activar tu prueba de 30 días y revisar los planes antes de pagar.
                  </p>
                </div>
                <div>
                  <div className="text-sm font-black text-cyan-200">3. Conectar cuando estés listo</div>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    Configura Broker/MT5 cuando quieras usar datos de tu cuenta y funciones de trading compatibles.
                  </p>
                </div>
              </div>
            </Container>
          </section>

          <section className="pb-16">
            <Container>
              <div className="rounded-[2rem] border border-white/10 bg-black/30 p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">
                      Accesos complementarios
                    </div>
                    <h2 className="mt-2 text-2xl font-black text-white md:text-3xl">
                      Apps nativas: opcionales, no requisito
                    </h2>
                  </div>
                  <p className="max-w-xl text-sm leading-6 text-white/60">
                    Windows, Android e iOS permanecen en el roadmap como experiencias complementarias. Neuro Cloud es el acceso principal.
                  </p>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {futureApps.map((item) => (
                    <article key={item.platform} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                      <div className="flex items-center justify-between gap-3">
                        <strong className="text-white">{item.platform}</strong>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-black text-white/55">
                          {item.status}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-white/60">{item.text}</p>
                    </article>
                  ))}
                </div>
              </div>
            </Container>
          </section>
        </main>
      </div>
    </FXBackground>
  );
}
