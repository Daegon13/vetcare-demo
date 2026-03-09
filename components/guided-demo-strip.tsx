import { LinkButton } from "@/components/ui";
import { cn } from "@/lib/utils";

export type DemoStep = {
  label: string;
  description: string;
  ctaLabel: string;
  href: string;
};

const DEFAULT_DEMO_STEPS: DemoStep[] = [
  {
    label: "Reservá un turno",
    description: "Simulá la experiencia de un tutor en menos de un minuto, desde el servicio hasta la confirmación.",
    ctaLabel: "Ir a Agenda",
    href: "/agenda"
  },
  {
    label: "Evaluá una urgencia",
    description: "Probá el triage guiado para ver cómo prioriza síntomas y sugiere el siguiente paso.",
    ctaLabel: "Ir a Urgencias",
    href: "/urgencias"
  },
  {
    label: "Mirá el portal de Mi Mascota",
    description: "Revisá vacunas, vencimientos e historial para mostrar continuidad de atención al tutor.",
    ctaLabel: "Abrir Mi Mascota",
    href: "/mi-mascota"
  }
];

type GuidedDemoStripProps = {
  className?: string;
  id?: string;
  eyebrow?: string;
  title?: string;
  steps?: DemoStep[];
};

export function GuidedDemoStrip({
  className,
  id,
  eyebrow = "DEMO GUIADA",
  title = "Probá la demo en 3 pasos",
  steps = DEFAULT_DEMO_STEPS
}: GuidedDemoStripProps) {
  return (
    <section
      id={id}
      className={cn(
        "rounded-2xl border border-black/5 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-graphite-900 sm:p-6",
        className
      )}
    >
      <div className="mb-4 grid gap-1">
        <p className="text-xs font-semibold tracking-wide text-cyanSoft-500">{eyebrow}</p>
        <h2 className="text-2xl font-black tracking-tight">{title}</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {steps.map((step, index) => (
          <article key={step.label} className="grid gap-3 rounded-xl bg-black/5 p-4 dark:bg-white/10">
            <p className="text-xs font-bold text-black/60 dark:text-white/60">PASO {index + 1}</p>
            <h3 className="text-base font-extrabold leading-tight">{step.label}</h3>
            <p className="text-sm text-black/65 dark:text-white/70">{step.description}</p>
            <LinkButton href={step.href} variant="outline" size="sm" className="w-fit">
              {step.ctaLabel}
            </LinkButton>
          </article>
        ))}
      </div>
    </section>
  );
}
