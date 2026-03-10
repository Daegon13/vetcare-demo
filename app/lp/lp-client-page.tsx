"use client";

import * as React from "react";
import { BRAND } from "@/lib/data";
import { Container, Badge, LinkButton } from "@/components/ui";
import { LeadCTA } from "@/components/LeadCTA";
import { trackEvent } from "@/lib/analytics";
import { captureUtmFromUrl, getStoredUtm } from "@/lib/utm";
import { addLead } from "@/lib/leads";
import { GuidedDemoStrip } from "@/components/guided-demo-strip";

const SOLUTIONS = [
  "Turnos: reservas online claras para reducir llamados y captar consultas 24/7.",
  "Urgencias: evaluación guiada para priorizar casos y orientar al tutor en segundos.",
  "Portal con seguimiento: historial y estado de la mascota en un solo lugar para fidelizar clientes."
];

const IMPLEMENTATION_BLOCKS = [
  {
    title: "Para quién es",
    text: "Clínicas y veterinarias que quieren convertir más consultas sin sumar carga operativa al equipo."
  },
  {
    title: "Qué incluye",
    text: "Una experiencia comercial completa con agenda online, urgencias guiadas y portal con seguimiento para tutores."
  },
  {
    title: "Cómo se entrega",
    text: "La adaptamos a la marca y operación de tu veterinaria y la dejamos lista para usar en campañas y WhatsApp."
  }
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
          <Badge className="mx-auto w-fit">Landing para campañas</Badge>
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            Más pacientes desde anuncios, al momento para tu veterinaria.
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-black/65 dark:text-white/70 sm:text-lg">
            Activá agenda online, urgencias guiadas y seguimiento digital con una implementación simple y enfocada en conversión.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <LeadCTA
              interest="general"
              label="Hablar por WhatsApp"
              onClick={onWhatsappClick}
              className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300"
            />
            <LinkButton href="#demo" variant="outline" onClick={onDemoClick}>
              Ver demo guiada
            </LinkButton>
          </div>
        </section>

        <GuidedDemoStrip
          id="demo"
          eyebrow="RECORRIDO DEMO"
          title="Probá la demo en 3 pasos"
          description="Hacé clic en cada paso y validá la experiencia completa en menos de 2 minutos."
        />

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
        </section>

        <section
          className="grid gap-4 rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-graphite-900 sm:p-6"
          aria-label="Implementación"
        >
          <h2 className="text-2xl font-extrabold">Implementación</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {IMPLEMENTATION_BLOCKS.map((block) => (
              <article key={block.title} className="rounded-xl bg-black/5 p-4 dark:bg-white/10">
                <h3 className="text-base font-bold sm:text-lg">{block.title}</h3>
                <p className="mt-2 text-sm text-black/70 dark:text-white/75 sm:text-base">{block.text}</p>
              </article>
            ))}
          </div>
          <p className="text-sm font-semibold text-black/75 dark:text-white/80 sm:text-base">
            Adaptable a la marca y operación de tu veterinaria.
          </p>
          <div>
            <LeadCTA
              interest="general"
              label="WhatsApp / Quiero esto para mi veterinaria"
              onClick={onWhatsappClick}
              className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300"
            />
          </div>
        </section>
      </Container>
    </div>
  );
}
