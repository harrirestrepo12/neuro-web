"use client";

import Link from "next/link";
import React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type FXButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type FXButtonSize = "sm" | "md" | "lg";

type BaseProps = {
  children: React.ReactNode;
  className?: string;
  variant?: FXButtonVariant;
  size?: FXButtonSize;
  glow?: boolean;
};

type LinkOnlyProps = { href: string; target?: React.HTMLAttributeAnchorTarget; rel?: string; disabled?: boolean };
type ButtonOnlyProps = {
  onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  disabled?: boolean;
};

export type FXButtonProProps =
  | (BaseProps &
      LinkOnlyProps & { onClick?: never; type?: never })
  | (BaseProps &
      ButtonOnlyProps & { href?: never; target?: never; rel?: never });

const base =
  "relative inline-flex items-center justify-center select-none whitespace-nowrap " +
  "rounded-2xl font-semibold transition will-change-transform " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 " +
  "disabled:opacity-50 disabled:pointer-events-none";

const sizes: Record<FXButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-base md:text-lg",
};

const variants: Record<FXButtonVariant, string> = {
  primary:
    "text-black bg-linear-to-b from-emerald-200 via-emerald-300 to-emerald-500",
  secondary:
    "text-white bg-linear-to-b from-sky-400/85 via-sky-500/70 to-indigo-600/70",
  outline:
    "text-white bg-white/5 border border-white/15 hover:bg-white/8 hover:border-white/25",
  ghost: "text-white/90 hover:bg-white/8",
};

function InnerFX({
  children,
  className,
  variant = "primary",
  size = "md",
  glow = true,
}: BaseProps) {
  const isSolid = variant === "primary" || variant === "secondary";

  return (
    <span
      className={cn(
        base,
        sizes[size],
        variants[variant],
        // 3D motion
        "hover:-translate-y-1 active:translate-y-0",
        className
      )}
    >
      {/* Glow layer */}
      {glow && isSolid && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute -inset-px rounded-2xl blur-md opacity-70",
            variant === "primary" ? "bg-emerald-400/35" : "bg-sky-400/25"
          )}
        />
      )}

      {/* 3D rim (top highlight + bottom shadow edge) */}
      {isSolid && (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/15"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-2 top-1 h-5 rounded-full bg-white/35 blur-md opacity-45"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-2 bottom-0.5 h-4 rounded-full bg-black/35 blur-md opacity-60"
          />
        </>
      )}

      {/* Shadow 3D */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-2xl",
          isSolid
            ? "shadow-[0_18px_55px_rgba(0,0,0,0.45)]"
            : "shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
        )}
      />

      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </span>
  );
}

function isLinkProps(p: FXButtonProProps): p is BaseProps & LinkOnlyProps {
  return typeof (p as { href?: unknown }).href === "string";
}

export default function FXButtonPro(props: FXButtonProProps) {
  if (isLinkProps(props)) {
    const { href, target, rel, children, ...rest } = props;
    return (
      <Link href={href} target={target} rel={rel} className="inline-flex">
        <InnerFX {...rest}>{children}</InnerFX>
      </Link>
    );
  }

  const { children, onClick, type, disabled, ...rest } = props;
  return (
    <button onClick={onClick} type={type} disabled={disabled} className="inline-flex">
      <InnerFX {...rest}>{children}</InnerFX>
    </button>
  );
}
