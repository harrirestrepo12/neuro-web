import "./globals.css";
import type { Metadata } from "next";
import NeuroGlowBackground from "@/components/fx/NeuroGlowBackground";

export const metadata: Metadata = {
  title: "Neuro Trading",
  description: "Neuro Trading — IA + riesgo + ejecución con disciplina.",
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