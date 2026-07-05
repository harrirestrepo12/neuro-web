import "./globals.css";
import type { Metadata } from "next";
import NeuroGlowBackground from "@/components/fx/NeuroGlowBackground";

export const metadata: Metadata = {
  metadataBase: new URL("https://neurotrading.app"),
  title: "Neuro Trading | Plataforma inteligente de trading",
  description: "Neuro Trading - IA, control de riesgo, análisis y ejecución con disciplina.",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/brand/neuro-trading-icon.svg",
  },
  openGraph: {
    title: "Neuro Trading",
    description: "Plataforma inteligente de trading, análisis, riesgo y automatización.",
    url: "https://neurotrading.app",
    siteName: "Neuro Trading",
    images: ["/brand/neuro-trading-logo.svg"],
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <NeuroGlowBackground intensity="normal">{children}</NeuroGlowBackground>
      </body>
    </html>
  );
}
