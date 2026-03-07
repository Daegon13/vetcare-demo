"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BRAND } from "@/lib/data";
import { Container, LinkButton, Card, CardContent, Badge } from "@/components/ui";
import { trackEvent } from "@/lib/analytics";
import { createLeadId, recordLeadEvent } from "@/lib/leadTracking";
import { buildLeadWhatsappUrl, buildWhatsappUrl, captureUtmFromUrl, getStoredUtm, type LeadInterest } from "@/lib/utm";

type PlanOption = {
  title: string;
  bullets: string[];
};

const PLANS: PlanOption[] = [
  {
    title: "Presencia + WhatsApp",
    bullets: [
      "Landing optimizada para campañas.",
      "CTA directo a WhatsApp con contexto.",
      "Captura de UTM para atribución básica.",
      "Mensaje comercial prellenado por plan."
    ]
  },
  {
    title: "Agenda + Urgencias + Portal",
    bullets: [
      "Turnos online con disponibilidad real.",
      "Triage de urgencias con prioridad guiada.",
      "Portal para vacunas e historial básico.",
      "Flujo completo para mejorar conversión."
    ]
  },
  {
    title: "+ Admin / Automatizaciones",
    bullets: [
      "Panel admin para seguimiento operativo.",
      "Estados de atención y campañas internas.",
      "Base para automatizar recordatorios.",
      "Escalable a procesos más avanzados."
    ]
  }
];

const INTEREST_OPTIONS: Array<{ value: LeadInterest; label: string }> = [
  { value: "turnos", label: "Turnos" },
  { value: "urgencias", label: "Urgencias" },
  { value: "portal", label: "Portal" },
  { value: "admin", label: "Admin" }
];

export default function LandingPage() {
  const router = useRouter();
  const formRef = React.useRef<HTMLFormElement | null>(null);
  const [selectedPlan, setSelectedPlan] = React.useState(PLANS[0].title);
  const [nombre, setNombre] = React.useState("");
  const [clinica, setClinica] = React.useState("");
  const [ciudad, setCiudad] = React.useState("");
  const [whatsapp, setWhatsapp] = React.useState("");
  const [interes, setInteres] = React.useState<LeadInterest[]>(["turnos"]);
  const [whatsappUrl, setWhatsappUrl] = React.useState(BRAND.whatsappUrl);

  React.useEffect(() => {
    captureUtmFromUrl(new URLSearchParams(window.location.search));
    const utm = getStoredUtm();
    setWhatsappUrl(buildWhatsappUrl(BRAND.whatsappUrl, utm, "Mi interés: implementación."));
    trackEvent("landing_view", { location: "lp", ...(utm ?? {}) });
  }, []);

  function onWhatsappClick() {
    trackEvent("cta_whatsapp_click", { location: "lp", ...(getStoredUtm() ?? {}) });
  }

  function onChoosePlan(plan: string) {
    setSelectedPlan(plan);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function onToggleInterest(value: LeadInterest) {
    setInteres((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const utm = getStoredUtm();
    const leadId = createLeadId();
    const leadPayload = {
      leadId,
      nombre,
      clinica,
      ciudad,
      whatsapp,
      plan: selectedPlan,
      interes
    };

    trackEvent("lead_submit", { leadId, plan: selectedPlan, ...(utm ?? {}) });
    recordLeadEvent(leadId, "whatsapp_click");
    localStorage.setItem("vetcare:lead", JSON.stringify(leadPayload));

    const leadWhatsappUrl = buildLeadWhatsappUrl(BRAND.whatsappUrl, utm, leadPayload);
    router.push("/gracias");
    window.open(leadWhatsappUrl, "_blank", "noopener,noreferrer");
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
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-xl font-extrabold">Planes</h2>
          <div className="grid gap-3 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <Card key={plan.title} className="flex h-full flex-col">
                <CardContent className="grid h-full gap-3">
                  <div className="text-lg font-extrabold">{plan.title}</div>
                  <ul className="grid gap-1 text-sm text-black/65 dark:text-white/70">
                    {plan.bullets.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => onChoosePlan(plan.title)}
                    className="mt-auto rounded-xl bg-graphite-900 px-4 py-2 text-sm font-bold text-white hover:bg-graphite-800 dark:bg-cyanSoft-400 dark:text-graphite-950 dark:hover:bg-cyanSoft-300"
                  >
                    Quiero este plan
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-4 rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-graphite-900 sm:p-6">
          <h2 className="text-xl font-extrabold">Precalificación rápida</h2>
          <form ref={formRef} className="grid gap-3" onSubmit={onSubmit}>
            <div className="grid gap-1">
              <label htmlFor="plan" className="text-sm font-semibold">Plan</label>
              <select
                id="plan"
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-graphite-950"
              >
                {PLANS.map((plan) => (
                  <option key={plan.title} value={plan.title}>{plan.title}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input required value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-graphite-950" />
              <input required value={clinica} onChange={(e) => setClinica(e.target.value)} placeholder="Clínica" className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-graphite-950" />
              <input required value={ciudad} onChange={(e) => setCiudad(e.target.value)} placeholder="Ciudad" className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-graphite-950" />
              <input required value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="WhatsApp" className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-graphite-950" />
            </div>

            <fieldset className="grid gap-2">
              <legend className="text-sm font-semibold">Interés</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {INTEREST_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={interes.includes(option.value)}
                      onChange={() => onToggleInterest(option.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              type="submit"
              className="w-fit rounded-xl bg-cyanSoft-400 px-4 py-2 text-sm font-extrabold text-graphite-950 hover:bg-cyanSoft-300"
            >
              Enviar y abrir WhatsApp
            </button>
          </form>
        </section>
      </Container>
    </div>
  );
}
