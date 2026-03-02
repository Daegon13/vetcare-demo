"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Container, LinkButton } from "./ui";
import { BRAND } from "@/lib/data";
import { resetDemo } from "@/lib/storage";

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
    window.location.reload();
  }

  return (
    <div className="sticky top-0 z-30 border-b border-black/5 bg-warm-100/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-9 w-9 rounded-xl bg-graphite-900 text-white grid place-items-center font-black">V</span>
          <div className="leading-tight">
            <div className="text-sm font-extrabold tracking-tight">{BRAND.name}</div>
            <div className="text-[11px] text-black/55 -mt-0.5">{BRAND.tagline}</div>
          </div>
          <span className="hidden md:inline-flex rounded-full border border-cyanSoft-400/70 bg-cyanSoft-50 px-2 py-0.5 text-[10px] font-black tracking-wide text-graphite-900">
            DEMO
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map(l => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-semibold transition",
                  active ? "bg-black/5" : "hover:bg-black/5"
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
            className="hidden md:inline-flex rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold hover:bg-black/5"
          >
            Reset demo
          </button>
          <LinkButton
            href="/agenda"
            className="hidden sm:inline-flex"
            variant="outline"
          >
            Reservar turno
          </LinkButton>
          <LinkButton
            href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300"
          >
            WhatsApp
          </LinkButton>
        </div>
      </Container>

      <Container className="lg:hidden pb-3">
        <div className="flex flex-wrap gap-2">
          {links.map(l => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href} className={cn("rounded-xl px-3 py-2 text-xs font-semibold", active ? "bg-black/5" : "bg-white/70 hover:bg-black/5")}>
                {l.label}
              </Link>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
