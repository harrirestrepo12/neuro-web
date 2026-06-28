"use client";

import React, { useState } from "react";
import FXButtonPro from "@/components/site/FXButtonPro";
import { postJSON } from "@/lib/api";
import { cn } from "@/lib/cn";

type JoinWaitlistResponse = { ok: boolean; error?: string };

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "err" | "loading">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");

    try {
      const out = await postJSON<JoinWaitlistResponse>("/waitlist/join", {
        email,
        name,
      });

      if (out.ok) {
        setStatus("ok");
        setMsg("Listo. Te avisaremos cuando Neuro esté disponible.");
        setEmail("");
        setName("");
      } else {
        setStatus("err");
        setMsg(out.error || "No se pudo registrar. Intenta otra vez.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error inesperado";
      setStatus("err");
      setMsg(message);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3 md:grid-cols-3 md:items-end">
      <div className="md:col-span-1">
        <label className="text-sm text-white/70">Nombre</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-white outline-none focus:ring-2 focus:ring-emerald-400/40"
          placeholder="Tu nombre"
        />
      </div>

      <div className="md:col-span-1">
        <label className="text-sm text-white/70">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
          className="mt-1 h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-white outline-none focus:ring-2 focus:ring-emerald-400/40"
          placeholder="tu@email.com"
        />
      </div>

      <div className="md:col-span-1">
        <FXButtonPro
          size="lg"
          variant="primary"
          className="w-full"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Enviando..." : "Unirme a la waitlist"}
        </FXButtonPro>
      </div>

      {msg && (
        <p
          className={cn(
            "md:col-span-3 text-sm",
            status === "ok" ? "text-emerald-300" : "text-red-300"
          )}
        >
          {msg}
        </p>
      )}
    </form>
  );
}