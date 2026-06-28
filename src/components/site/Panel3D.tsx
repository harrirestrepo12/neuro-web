import React from "react";

export default function Panel3D({
  title,
  subtitle,
  right,
  children,
  className = "",
}: {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        "relative rounded-3xl overflow-hidden",
        "border border-white/10 bg-black/45",
        "shadow-[0_30px_120px_rgba(0,0,0,0.70)]",
        className,
      ].join(" ")}
    >
      {/* frame */}
      <div className="pointer-events-none absolute -inset-[2px] rounded-[28px] bg-white/10 blur-xl opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_400px_at_20%_0%,rgba(255,255,255,0.10),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_80%_20%,rgba(0,200,255,0.10),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />

      <div className="relative p-6 md:p-8">
        {(title || subtitle || right) && (
          <div className="mb-5 flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              {title && <div className="text-lg md:text-xl font-semibold text-white/90">{title}</div>}
              {subtitle && <div className="mt-1 text-sm md:text-base text-white/60">{subtitle}</div>}
            </div>
            {right ? <div className="shrink-0">{right}</div> : null}
          </div>
        )}

        <div>{children}</div>
      </div>
    </section>
  );
}