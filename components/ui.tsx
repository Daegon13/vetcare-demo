import * as React from "react";
import { cn } from "@/lib/utils";

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-2xl bg-white shadow-soft ring-1 ring-black/5 dark:bg-graphite-900 dark:ring-white/10", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("border-b border-black/5 p-5 sm:p-6 dark:border-white/10", className)} {...props} />;
}
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 sm:p-6", className)} {...props} />;
}

export function Badge({ className, tone = "neutral", ...props }: React.HTMLAttributes<HTMLSpanElement> & { tone?: "neutral" | "good" | "warn" | "bad" }) {
  const tones: Record<string, string> = {
    neutral: "bg-black/5 text-graphite-900 dark:bg-white/10 dark:text-white",
    good: "bg-emerald-100 text-emerald-800",
    warn: "bg-amber-100 text-amber-900",
    bad: "bg-rose-100 text-rose-800"
  };
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", tones[tone], className)} {...props} />;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "outline"; size?: "sm" | "md" }) {
  const variants = {
    primary: "bg-graphite-900 text-white hover:bg-graphite-800",
    ghost: "bg-transparent hover:bg-black/5 dark:hover:bg-white/10",
    outline: "bg-white border border-black/10 hover:bg-black/5 dark:bg-graphite-900 dark:border-white/15 dark:hover:bg-white/10"
  };
  const sizes = { sm: "h-9 px-3 text-sm", md: "h-11 px-4 text-sm" };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold transition shadow-sm disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

export function LinkButton({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: "primary" | "ghost" | "outline"; size?: "sm" | "md" }) {
  const variants = {
    primary: "bg-graphite-900 text-white hover:bg-graphite-800",
    ghost: "bg-transparent hover:bg-black/5 dark:hover:bg-white/10",
    outline: "bg-white border border-black/10 hover:bg-black/5 dark:bg-graphite-900 dark:border-white/15 dark:hover:bg-white/10"
  };
  const sizes = { sm: "h-9 px-3 text-sm", md: "h-11 px-4 text-sm" };
  return (
    <a
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold transition shadow-sm",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <div className="flex items-end justify-between gap-3">
        <span className="text-sm font-semibold">{label}</span>
        {hint ? <span className="text-xs text-black/50 dark:text-white/55">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm shadow-sm dark:border-white/15 dark:bg-graphite-900",
        "placeholder:text-black/35 focus:border-cyanSoft-400/70 focus:ring-2 focus:ring-cyanSoft-200 dark:placeholder:text-white/35",
        props.className
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm shadow-sm dark:border-white/15 dark:bg-graphite-900",
        "focus:border-cyanSoft-400/70 focus:ring-2 focus:ring-cyanSoft-200",
        props.className
      )}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-[96px] w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm dark:border-white/15 dark:bg-graphite-900",
        "placeholder:text-black/35 focus:border-cyanSoft-400/70 focus:ring-2 focus:ring-cyanSoft-200 dark:placeholder:text-white/35",
        props.className
      )}
    />
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="rounded-lg bg-black/5 px-2 py-1 text-xs font-semibold dark:bg-white/10">{children}</kbd>;
}
