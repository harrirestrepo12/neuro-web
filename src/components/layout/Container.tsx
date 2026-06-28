import React from "react";
import { cn } from "@/lib/cn";

export default function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        // ✅ más ancho tipo web normal (puedes subir a 1700 si quieres)
        "mx-auto w-full max-w-[1600px] px-5 sm:px-6 lg:px-10",
        className
      )}
    >
      {children}
    </div>
  );
}