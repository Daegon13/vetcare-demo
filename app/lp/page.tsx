"use client";

import * as React from "react";
import { BRAND } from "@/lib/data";
import { Container, LinkButton, Card, CardContent, Badge } from "@/components/ui";
import { trackEvent } from "@/lib/analytics";
import { appendUtmToUrl, buildWhatsappUrl, captureUtmFromUrl, getStoredUtm } from "@/lib/utm";

const INCLUDE_ITEMS = [
  "Agenda online con disponibilidad real.",
  "Triage de urgencias guiado con prioridad.",
  "Portal simple para vacunas e historial.",
  "Panel interno básico para seguimiento.",
  "Personalización rápida de marca y servicios."
];

const STEPS = [
  "Relevamos tu operación actual y canales de atención.",
  "Adaptamos agenda, urgencias y mensajes al tono de tu clínica.",
  "Publicamos y validamos el flujo con casos reales en pocos días."
];

const FAQS = [
  { q: "¿En cuánto tiempo puede estar online?", a: "En pocos días dejamos una versión lista para mostrar y empezar a captar consultas." },
  { q: "¿Se puede adaptar a mi veterinaria?", a: "Sí, personalizamos marca, servicios, horarios y CTAs para tu operación." },
  { q: "¿Incluye WhatsApp y formularios?", a: "Sí, dejamos CTAs conectados para que los leads lleguen con contexto." },
  { q: "¿Sirve para campañas en Instagram o TikTok?", a: "Sí, esta landing está pensada para tráfico pago y medición de conversiones." },
  { q: "¿La demo guarda datos reales?", a: "No, la demo usa datos mock en localStorage para simular uso real sin backend." }
];

export default function LandingPage() {
  const [whatsappUrl, setWhatsappUrl] = React.useState(BRAND.whatsappUrl);
  const [implementationUrl, setImplementationUrl] = React.useState(BRAND.implementationCtaUrl);

  React.useEffect(() => {
    captureUtmFromUrl(new URLSearchParams(window.location.search));
    const utm = getStoredUtm();
    setWhatsappUrl(buildWhatsappUrl(BRAND.whatsappUrl, utm, "Mi interés: implementación."));
    setImplementationUrl(appendUtmToUrl(BRAND.implementationCtaUrl, utm));
    trackEvent("landing_view", { location: "lp", ...(utm ?? {}) });
  }, []);

  function onWhatsappClick() {
    trackEvent("cta_whatsapp_click", { location: "lp", ...(getStoredUtm() ?? {}) });
  }

  function onImplementationClick() {
    trackEvent("cta_implementation_click", { location: "lp", ...(getStoredUtm() ?? {}) });
  }

  return (
    <div className="bg-gradient-to-b from-white to-warm-100 py-10 dark:from-graphite-950 dark:to-graphite-900 sm:py-14">
      <Container className="grid gap-8">
        <section className="grid gap-4 text-center">
          <Badge className="mx-auto w-fit">Landing para campañas</Badge>
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">Más turnos, menos fricción para tu veterinaria.</h1>
          <p className="mx-auto max-w-2xl text-sm text-black/65 dark:text-white/70 sm:text-lg">
            VetCare te da una experiencia clara para captar leads desde anuncios: agenda, urgencias y seguimiento en un flujo que convierte.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <LinkButton
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              onClick={onWhatsappClick}
              className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300"
            >
              Hablar por WhatsApp
            </LinkButton>
            <LinkButton href={implementationUrl} target="_blank" rel="noreferrer" onClick={onImplementationClick} variant="outline">
              Quiero esto para mi veterinaria
            </LinkButton>
          </div>
        </section>

        <section className="grid gap-4 rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-graphite-900 sm:p-6">
          <h2 className="text-xl font-extrabold">Qué incluye</h2>
          <ul className="grid gap-2 text-sm text-black/65 dark:text-white/70 sm:grid-cols-2">
            {INCLUDE_ITEMS.map(item => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </section>

        <section className="grid gap-4 rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-graphite-900 sm:p-6">
          <h2 className="text-xl font-extrabold">Implementación rápida (3 pasos)</h2>
          <ol className="grid gap-2 text-sm text-black/65 dark:text-white/70">
            {STEPS.map((step, idx) => (
              <li key={step}>{idx + 1}. {step}</li>
            ))}
          </ol>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-extrabold">Preguntas frecuentes</h2>
          <div className="grid gap-3">
            {FAQS.map(faq => (
              <Card key={faq.q}>
                <CardContent className="grid gap-2">
                  <div className="text-sm font-bold">{faq.q}</div>
                  <p className="text-sm text-black/65 dark:text-white/70">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
