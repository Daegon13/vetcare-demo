"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Container, LinkButton } from "./ui";
import { BRAND } from "@/lib/data";
import { resetDemo } from "@/lib/storage";
import { trackEvent } from "@/lib/analytics";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/agenda", label: "Agenda" },
  { href: "/urgencias", label: "Urgencias" },
  { href: "/mi-mascota", label: "Mi Mascota" },
  { href: "/equipo", label: "Equipo" },
  { href: "/ubicacion", label: "Ubicación" },
  { href: "/faq", label: "FAQ" },
  { href: "/adminv1", label: "Admin v1" }
];

export function Nav() {
  const pathname = usePathname();

  function onResetDemo() {
    resetDemo();
    // Client pages read storage on mount; full reload guarantees fresh state everywhere.
    window.location.reload();
  }

  function onWhatsappClick() {
    trackEvent("cta_whatsapp_click", { location: "navbar" });
  }

  return (
    <div className="sticky top-0 z-30 border-b border-black/5 bg-warm-100/85 text-graphite-900 backdrop-blur dark:border-white/10 dark:bg-graphite-950/90 dark:text-white">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-graphite-900 font-black text-white dark:bg-cyanSoft-400 dark:text-graphite-950">V</span>
          <div className="leading-tight">
            <div className="text-sm font-extrabold tracking-tight">{BRAND.name}</div>
            <div className="-mt-0.5 text-[11px] text-black/55 dark:text-white/65">{BRAND.tagline}</div>
          </div>
          <span className="hidden rounded-full border border-cyanSoft-400/70 bg-cyanSoft-50 px-2 py-0.5 text-[10px] font-black tracking-wide text-graphite-900 md:inline-flex dark:bg-cyanSoft-400/20 dark:text-cyanSoft-100">
            DEMO
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map(l => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-semibold transition",
                  active ? "bg-black/5 dark:bg-white/15" : "hover:bg-black/5 dark:hover:bg-white/10"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetDemo}
            className="hidden rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold hover:bg-black/5 md:inline-flex dark:border-white/15 dark:bg-graphite-900 dark:hover:bg-white/10"
          >
            Reset demo
          </button>
          <LinkButton href="/agenda" className="hidden sm:inline-flex" variant="outline">
            Reservar turno
          </LinkButton>
          <ThemeToggle />
          <LinkButton
            href={BRAND.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            onClick={onWhatsappClick}
            className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300"
          >
            Hablar por WhatsApp
          </LinkButton>
        </div>
      </Container>

      <Container className="pb-3 lg:hidden">
        <div className="flex flex-wrap gap-2">
          {links.map(l => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-xs font-semibold",
                  active ? "bg-black/5 dark:bg-white/15" : "bg-white/70 hover:bg-black/5 dark:bg-graphite-900 dark:hover:bg-white/10"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
