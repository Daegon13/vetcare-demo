"use client";

import * as React from "react";
import { Container, Badge, LinkButton } from "@/components/ui";
import { LeadCTA } from "@/components/LeadCTA";
import { GuidedDemoStrip } from "@/components/guided-demo-strip";
import { trackEvent } from "@/lib/analytics";
import { captureUtmFromUrl, getStoredUtm } from "@/lib/utm";
import { addLead } from "@/lib/leads";

const SOLUTIONS = [
  "Experiencia clara para clientes: reservas online simples para reducir llamados y ordenar la agenda.",
  "Centralización de consultas: triage guiado y contacto rápido desde un mismo recorrido.",
  "Flujo adaptable a cada veterinaria: servicios, mensajes y operación ajustados a tu forma de trabajo."
];

export default function LandingPage() {
  React.useEffect(() => {
    captureUtmFromUrl(new URLSearchParams(window.location.search));
    const utm = getStoredUtm();
    trackEvent("landing_view", { location: "lp", ...(utm ?? {}) });
  }, []);

  function onWhatsappClick() {
    const utm = getStoredUtm();
    addLead({
      sourcePage: window.location.pathname,
      channel: "whatsapp_click",
      utm: utm ?? undefined,
      interest: ["implementacion"],
      note: "LP hero CTA"
    });
    trackEvent("cta_whatsapp_click", { location: "lp", ...(utm ?? {}) });
    trackEvent("lead_saved", { channel: "whatsapp_click", location: "lp", ...(utm ?? {}) });
  }

  function onDemoClick() {
    const utm = getStoredUtm();
    trackEvent("lp_demo_cta_click", { location: "lp", ...(utm ?? {}) });
  }

  return (
    <div className="bg-gradient-to-b from-white to-warm-100 py-10 dark:from-graphite-950 dark:to-graphite-900 sm:py-14">
      <Container className="grid max-w-4xl gap-8 sm:gap-10">
        <section className="grid gap-4 text-center">
          <Badge className="mx-auto w-fit">Demo lista para campañas</Badge>
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            Convertí anuncios en turnos reales para tu veterinaria.
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-black/65 dark:text-white/70 sm:text-lg">
            Mostrá una propuesta profesional, humana y clara para convertir interés en conversaciones por WhatsApp con intención de reserva.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <LeadCTA
              interest="general"
              label="Hablar por WhatsApp"
              onClick={onWhatsappClick}
              className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300"
            />
            <LinkButton href="#demo-rapido" variant="outline" onClick={onDemoClick}>
Ver recorrido guiado en 3 pasos
            </LinkButton>
          </div>
        </section>

        <section
          className="grid gap-3 rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-graphite-900 sm:p-6"
          aria-label="Qué resuelve"
        >
          <h2 className="text-2xl font-extrabold">Qué resuelve</h2>
          <ul className="grid gap-2 text-sm text-black/70 dark:text-white/75 sm:text-base">
            {SOLUTIONS.map((item) => (
              <li key={item} className="rounded-xl bg-black/5 px-3 py-2 dark:bg-white/10">
                • {item}
              </li>
            ))}
          </ul>
          <p className="text-xs text-black/55 dark:text-white/65">
            Recorrido de referencia para visualizar la propuesta y definir una implementación a medida.
          </p>
        </section>

        <GuidedDemoStrip
          id="demo-rapido"
          description="Empezá por agenda, seguí con urgencias y cerrá el recorrido en Mi Mascota."
        />
      </Container>
    </div>
  );
}
