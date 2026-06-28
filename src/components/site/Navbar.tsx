"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Container from "@/components/layout/Container";
import FXButtonPro from "@/components/site/FXButtonPro";

type NavItem = { label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { label: "Market", href: "/market" },
  { label: "Neuro Chat", href: "/neuro-chat" },
  { label: "Tecnología", href: "/technology" },
  { label: "Seguridad", href: "/security" },
  { label: "Brokers", href: "/brokers" },
  { label: "Planes", href: "/pricing" },
];

function uniqueByHref(items: NavItem[]) {
  const seen = new Set<string>();
  return items.filter((it) => {
    if (seen.has(it.href)) return false;
    seen.add(it.href);
    return true;
  });
}

function isActivePath(pathname: string, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const pathname = usePathname() || "/";
  const items = useMemo(() => uniqueByHref(NAV_ITEMS), []);
  const [open, setOpen] = useState(false);

  // Bloquea scroll cuando drawer abierto (esto sí es “external system”, está bien)
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC para cerrar
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
      <Container>
        <div className="flex h-20 md:h-22 items-center justify-between gap-6">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="leading-none">
              <div className="text-[14px] md:text-base font-semibold tracking-[0.22em] text-white/60 group-hover:text-white transition">
                NEURO
              </div>
              <div className="text-xl md:text-2xl font-bold tracking-tight">
                <span className="text-white group-hover:text-emerald-300 transition">TRADING</span>{" "}
                <span className="text-emerald-400">•</span>
              </div>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-10 text-base xl:text-lg font-medium">
            {items.map((it) => {
              const active = isActivePath(pathname, it.href);
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "relative transition duration-300 group",
                    active ? "text-white" : "text-white/70 hover:text-white"
                  )}
                >
                  <span className="relative z-10">{it.label}</span>

                  {/* underline glow */}
                  <span
                    aria-hidden
                    className={cx(
                      "absolute -bottom-2 left-0 h-0.5 rounded-full transition-all duration-300 shadow-[0_0_14px_rgba(34,197,94,0.85)]",
                      active ? "w-full bg-emerald-400" : "w-0 bg-emerald-400 group-hover:w-full"
                    )}
                  />

                  {/* soft active glow */}
                  {active && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -inset-x-2 -inset-y-2 rounded-2xl bg-emerald-500/10 blur-md"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ACTIONS + MOBILE BUTTON */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <FXButtonPro href="/pricing" variant="secondary" size="md">
                Ver planes
              </FXButtonPro>
            </div>

            <FXButtonPro href="/download" variant="primary" size="md">
              Descargar
            </FXButtonPro>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="lg:hidden inline-flex items-center justify-center rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white/85 hover:text-white hover:border-white/20 transition"
              aria-label="Abrir menú"
              aria-expanded={open}
              aria-controls="neuro-mobile-drawer"
            >
              <span className="relative block h-4 w-6">
                <span className="absolute left-0 top-0 h-0.5 w-6 rounded-full bg-white/80" />
                <span className="absolute left-0 top-1.75 h-0.5 w-6 rounded-full bg-white/70" />
                <span className="absolute left-0 top-3.5 h-0.5 w-6 rounded-full bg-white/60" />
              </span>
            </button>
          </div>
        </div>
      </Container>

      {/* MOBILE DRAWER */}
      <div
        className={cx(
          "lg:hidden fixed inset-0 z-60 transition",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <button
          type="button"
          onClick={close}
          className={cx(
            "absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity",
            open ? "opacity-100" : "opacity-0"
          )}
          aria-label="Cerrar menú"
          tabIndex={open ? 0 : -1}
        />

        {/* Panel */}
        <div
          id="neuro-mobile-drawer"
          className={cx(
            "absolute right-0 top-0 h-full w-[86vw] max-w-105border-l border-white/10 bg-black/80 backdrop-blur-xl shadow-[0_30px_140px_rgba(0,0,0,0.85)] transition-transform duration-300",
            open ? "translate-x-0" : "translate-x-full"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Menú principal"
        >
          {/* Decorative glow */}
          <div aria-hidden className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full bg-emerald-500/12 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="relative flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div className="text-sm text-white/70">Menú</div>
              <button
                type="button"
                onClick={close}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:text-white hover:border-white/20 transition"
              >
                Cerrar
              </button>
            </div>

            {/* Links */}
            <div className="px-6 py-6">
              <div className="grid gap-2">
                {items.map((it) => {
                  const active = isActivePath(pathname, it.href);
                  return (
                    <Link
                      key={it.href}
                      href={it.href}
                      aria-current={active ? "page" : undefined}
                      onClick={close} // ✅ Cierra sin effect (adiós eslint warning)
                      className={cx(
                        "relative overflow-hidden rounded-2xl border px-5 py-4 text-base transition",
                        active
                          ? "border-emerald-400/25 bg-emerald-500/10 text-white shadow-[0_0_40px_rgba(34,197,94,0.12)]"
                          : "border-white/10 bg-white/5 text-white/80 hover:text-white hover:border-white/20"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{it.label}</span>
                        <span className={cx("text-xs", active ? "text-emerald-300" : "text-white/45")}>
                          {active ? "ACTIVO" : "IR"}
                        </span>
                      </div>

                      {/* underline glow inside card */}
                      <span
                        aria-hidden
                        className={cx(
                          "absolute bottom-0 left-0 h-0.5 bg-emerald-400 shadow-[0_0_18px_rgba(34,197,94,0.85)] transition-all",
                          active ? "w-full opacity-100" : "w-0 opacity-0"
                        )}
                      />
                    </Link>
                  );
                })}
              </div>

              {/* Mobile actions */}
              <div className="mt-6 grid gap-3">
                <FXButtonPro href="/pricing" variant="secondary" size="lg">
                  Ver planes
                </FXButtonPro>
                <FXButtonPro href="/download" variant="primary" size="lg">
                  Descargar Neuro
                </FXButtonPro>
              </div>

              <p className="mt-6 text-xs text-white/55 leading-relaxed">
                Neuro no custodia fondos. Operar implica riesgo. Prioriza reglas y control.
              </p>
            </div>

            {/* Footer */}
            <div className="mt-auto border-t border-white/10 px-6 py-5 text-xs text-white/50">
              © {new Date().getFullYear()} Neuro Trading
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}