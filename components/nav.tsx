"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Container, LinkButton } from "./ui";
import { BRAND } from "@/lib/data";
import { resetDemo } from "@/lib/storage";
import { trackEvent } from "@/lib/analytics";
import { ThemeToggle } from "./theme-toggle";
import { getDemoToolsState, persistDemoToolsFlag } from "@/lib/demoMode";
import { buildWhatsappUrl, getStoredUtm } from "@/lib/utm";
import { addLead } from "@/lib/leads";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/agenda", label: "Agenda" },
  { href: "/urgencias", label: "Urgencias" },
  { href: "/mi-mascota", label: "Mi Mascota" },
  { href: "/equipo", label: "Equipo" },
  { href: "/ubicacion", label: "Ubicación" },
  { href: "/faq", label: "FAQ" }
];

export function Nav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const demoToolsState = getDemoToolsState(searchParams);
  const demoToolsEnabled = demoToolsState.enabled;
  const [whatsappUrl, setWhatsappUrl] = React.useState(BRAND.whatsappUrl);

  function withDemo(href: string) {
    if (!demoToolsEnabled) return href;
    // only internal app routes
    if (!href.startsWith("/")) return href;

    try {
      const url = new URL(href, window.location.origin);
      url.searchParams.set("demo", "1");
      return `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return href;
    }
  }

  React.useEffect(() => {
    const utm = getStoredUtm();
    setWhatsappUrl(buildWhatsappUrl(BRAND.whatsappUrl, utm, "Mi interés: implementación."));
  }, [searchParams]);

  React.useEffect(() => {
    // In "sales mode" (no demo tools), log once per browser.
    if (demoToolsEnabled) return;

    const storageKey = "vetcare:sales_mode_logged";
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        if (localStorage.getItem(storageKey) === "1") return;
        localStorage.setItem(storageKey, "1");
      }
    } catch {
      // ignore
    }

    trackEvent("sales_mode_enabled", { location: pathname || "unknown" });
  }, [demoToolsEnabled, pathname]);

  function onResetDemo() {
    resetDemo();

    // Keep demo tools active after reload.
    if (demoToolsEnabled) {
      persistDemoToolsFlag(true);
    }

    const nextUrl = new URL(window.location.href);
    if (demoToolsEnabled && demoToolsState.queryEnabled !== false) {
      nextUrl.searchParams.set("demo", "1");
    }

    // Client pages read storage on mount; full reload guarantees fresh state everywhere.
    window.location.assign(nextUrl.toString());
  }

  function onWhatsappClick() {
    const utm = getStoredUtm();
    addLead({
      sourcePage: pathname || window.location.pathname,
      channel: "whatsapp_click",
      utm: utm ?? undefined,
      interest: ["implementacion"],
      note: "Navbar CTA"
    });
    trackEvent("cta_whatsapp_click", { location: "navbar", ...(utm ?? {}) });
    trackEvent("lead_saved", { channel: "whatsapp_click", location: "navbar", ...(utm ?? {}) });
  }

  const navLinks = demoToolsEnabled ? [...links, { href: "/adminv1", label: "Panel de gestión" }] : links;
  const implementationRoutes = new Set(["/contacto", "/lp", "/gracias", "/adminv1", "/adminv1/marketing"]);
  const primaryCtaHref = implementationRoutes.has(pathname || "") ? withDemo("/contacto") : withDemo("/agenda");
  const primaryCtaLabel = implementationRoutes.has(pathname || "") ? "Solicitar asesoría" : "Reservar turno";

  return (
    <div className="sticky top-0 z-30 border-b border-black/5 bg-warm-100/85 text-graphite-900 backdrop-blur dark:border-white/10 dark:bg-graphite-950/85 dark:text-white">
      <Container className="flex h-16 flex-nowrap items-center justify-between gap-3 overflow-hidden">
        <Link href={withDemo("/")} className="flex shrink-0 items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-graphite-900 font-black text-white dark:bg-cyanSoft-400 dark:text-graphite-950">V</span>
          <div className="leading-tight">
            <div className="text-sm font-extrabold tracking-tight">{BRAND.name}</div>
            <div className="-mt-0.5 text-[11px] text-black/55 dark:text-white/65">{BRAND.tagline}</div>
          </div>
          {demoToolsEnabled ? (
            <span className="hidden rounded-full border border-cyanSoft-400/70 bg-cyanSoft-50 px-2 py-0.5 text-[10px] font-black tracking-wide text-graphite-900 md:inline-flex dark:bg-cyanSoft-400/20 dark:text-cyanSoft-100">
              RECORRIDO
            </span>
          ) : null}
        </Link>

        <nav className="hidden max-w-[calc(100vw-34rem)] flex-1 items-center gap-1 overflow-x-auto whitespace-nowrap lg:flex">
          {navLinks.map(l => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={withDemo(l.href)}
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

        <div className="flex shrink-0 flex-nowrap items-center gap-2 [&>*]:shrink-0">
          {demoToolsEnabled ? (
            <button
              type="button"
              onClick={onResetDemo}
              className="hidden whitespace-nowrap rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold hover:bg-black/5 md:inline-flex dark:border-white/15 dark:bg-graphite-900 dark:hover:bg-white/10"
            >
              Reiniciar datos
            </button>
          ) : null}

          <LinkButton href={primaryCtaHref} className="hidden whitespace-nowrap sm:inline-flex" variant="outline">
            {primaryCtaLabel}
          </LinkButton>

          {demoToolsEnabled ? <ThemeToggle /> : null}

          <LinkButton
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            onClick={onWhatsappClick}
            className="whitespace-nowrap bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300"
          >
            Hablar por WhatsApp
          </LinkButton>
        </div>
      </Container>

      <Container className="pb-3 lg:hidden">
        <div className="flex flex-wrap gap-2">
          {navLinks.map(l => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={withDemo(l.href)}
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
