"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type PwaInstallButtonProps = {
  className?: string;
  label?: string;
};

export default function PwaInstallButton({
  className = "",
  label = "Instalar acceso directo",
}: PwaInstallButtonProps) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    }

    function handleAppInstalled() {
      setInstalled(true);
      setInstallPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function handleInstall() {
    if (installed) return;

    if (!installPrompt) {
      alert(
        "La instalación es opcional. Si el botón no aparece, abre el menú de Chrome o Edge y elige Instalar aplicación. En celular, usa Agregar a pantalla de inicio."
      );
      return;
    }

    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  }

  return (
    <button
      type="button"
      onClick={handleInstall}
      className={`rounded-full border border-emerald-300/35 bg-emerald-300/10 px-5 py-3 text-sm font-black text-emerald-100 transition hover:bg-emerald-300 hover:text-slate-950 ${className}`}
    >
      {installed ? "Acceso directo instalado" : label}
    </button>
  );
}
