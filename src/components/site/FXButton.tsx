import Link from "next/link";

type FXButtonProps = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
};

function join(...v: Array<string | undefined | false | null>) {
  return v.filter(Boolean).join(" ");
}

export default function FXButton({
  href,
  onClick,
  children,
  variant = "primary",
  className,
}: FXButtonProps) {
  const base =
    "relative inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold " +
    "transition will-change-transform select-none " +
    "active:translate-y-[1px] active:scale-[0.99]";

  const primary =
    "text-black bg-emerald-500/90 hover:bg-emerald-400 " +
    "shadow-[0_18px_40px_rgba(34,197,94,0.22)]";

  const ghost =
    "text-white/90 bg-white/5 hover:bg-white/8 border border-white/15 hover:border-white/25 " +
    "shadow-[0_18px_40px_rgba(0,0,0,0.35)]";

  const fx =
    "before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:content-[''] " +
    "before:bg-[linear-gradient(135deg,rgba(34,197,94,.55),rgba(59,130,246,.25),rgba(255,255,255,.10))] " +
    "before:opacity-70 hover:before:opacity-100 " +
    "before:[mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] before:[mask-composite:xor] " +
    "after:absolute after:inset-0 after:rounded-2xl after:content-[''] " +
    "after:shadow-[0_0_0_1px_rgba(255,255,255,.08),0_0_30px_rgba(34,197,94,.12)] after:pointer-events-none";

  const cls = join(base, fx, variant === "primary" ? primary : ghost, className);

  if (href) {
    return (
      <Link href={href} className={cls}>
        <span className="relative z-10 drop-shadow-[0_1px_0_rgba(0,0,0,.35)]">
          {children}
        </span>
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cls}>
      <span className="relative z-10 drop-shadow-[0_1px_0_rgba(0,0,0,.35)]">
        {children}
      </span>
    </button>
  );
}