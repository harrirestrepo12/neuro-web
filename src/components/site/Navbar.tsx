"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Market", href: "/market" },
  { label: "Neuro Chat", href: "/neuro-chat" },
  { label: "Tecnología", href: "/technology" },
  { label: "Seguridad", href: "/security" },
  { label: "Brokers", href: "/brokers" },
  { label: "Planes", href: "/pricing" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-300 text-sm font-black text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.35)]">
            N
          </span>
          <span>
            <span className="block text-sm font-black tracking-[0.25em] text-white">
              NEURO
            </span>
            <span className="block text-xs font-medium text-cyan-200">
              Trading Intelligence
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-cyan-300 text-slate-950"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/download"
            className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2.5 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300 hover:text-slate-950"
          >
            Abrir plataforma
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white lg:hidden"
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          {open ? "Cerrar" : "Menú"}
        </button>
      </nav>

      {open ? (
        <div className="fixed inset-x-0 top-20 z-40 border-b border-white/10 bg-slate-950/95 px-6 py-6 shadow-2xl backdrop-blur-xl lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-4 text-base font-semibold transition ${
                    active
                      ? "bg-cyan-300 text-slate-950"
                      : "bg-white/[0.04] text-slate-200 hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/download"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-2xl bg-cyan-300 px-4 py-4 text-center text-base font-black text-slate-950"
            >
              Descargar Neuro Trading
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
