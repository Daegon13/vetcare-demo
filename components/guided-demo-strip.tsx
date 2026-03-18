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
    label: "Turno",
    description: "Reservá una consulta en pocos pasos, desde el servicio hasta la confirmación por tu canal de contacto.",
    ctaLabel: "Reservar turno",
    href: "/agenda"
  },
  {
    label: "Urgencias",
    description: "Completá la orientación inicial para priorizar síntomas y saber cómo actuar antes de llegar.",
    ctaLabel: "Evaluar urgencia",
    href: "/urgencias"
  },
  {
    label: "Mi Mascota",
    description: "Consultá vacunas, próximos controles e historial para seguir el plan de salud de tu mascota.",
    ctaLabel: "Ver Mi Mascota",
    href: "/mi-mascota"
  }
];

type GuidedDemoStripProps = {
  className?: string;
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  steps?: DemoStep[];
};

export function GuidedDemoStrip({
  className,
  id,
  eyebrow = "RECORRIDO DESTACADO",
  title = "Conocé cómo te acompaña VetCare",
  description = "Recorré los momentos clave de la atención para resolver turnos, urgencias y seguimiento desde un mismo lugar.",
  steps = DEFAULT_DEMO_STEPS
}: GuidedDemoStripProps) {
  return (
    <section
      id={id}
      aria-label={title}
      className={cn(
        "rounded-2xl border border-black/5 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-graphite-900 sm:p-6",
        className
      )}
    >
      <div className="mb-4 grid gap-1">
        <p className="text-xs font-semibold tracking-wide text-cyanSoft-500">{eyebrow}</p>
        <h2 className="text-2xl font-black tracking-tight">{title}</h2>
        <p className="text-sm text-black/60 dark:text-white/70">{description}</p>
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
