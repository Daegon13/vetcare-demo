import { LinkButton } from "@/components/ui";

type GuidedDemoStripProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description: string;
};

const DEMO_STEPS = [
  { label: "Paso 1", title: "Agenda online", href: "/agenda" },
  { label: "Paso 2", title: "Urgencias guiadas", href: "/urgencias" },
  { label: "Paso 3", title: "Portal y seguimiento", href: "/mi-mascota" }
];

export function GuidedDemoStrip({ id, eyebrow, title, description }: GuidedDemoStripProps) {
  return (
    <section id={id} className="grid gap-4 rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-graphite-900 sm:p-6" aria-label="Recorrido demo">
      {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/45 dark:text-white/55">{eyebrow}</p> : null}
      <h2 className="text-2xl font-extrabold">{title}</h2>
      <p className="text-sm text-black/70 dark:text-white/75 sm:text-base">{description}</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {DEMO_STEPS.map((step) => (
          <article key={step.title} className="rounded-xl bg-black/5 p-3 dark:bg-white/10">
            <p className="text-xs font-bold uppercase tracking-wide text-black/55 dark:text-white/60">{step.label}</p>
            <p className="mt-1 text-sm font-semibold sm:text-base">{step.title}</p>
            <LinkButton href={step.href} variant="outline" className="mt-3 w-full justify-center">
              Ver paso
            </LinkButton>
          </article>
        ))}
      </div>
    </section>
  );
}
