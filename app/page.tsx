import Image from "next/image";

import { BRAND } from "@/lib/data";
import { isDemoToolsEnabled } from "@/lib/demoMode";
import { Container, Card, CardContent, LinkButton, Badge } from "@/components/ui";
import { SectionHeading } from "@/components/section";
import { HeroVisual } from "@/components/hero-visual";

const FEATURES: { title: string; desc: string; img?: string }[] = [
  {
    img: "/brand/feature-appointments.webp",
    title: "Turnos sin fricción",
    desc: "Elegís servicio, fecha y horario disponible. Confirmás. Listo."
  },
  {
    img: "/brand/feature-triage.webp",
    title: "Urgencias con criterio",
    desc: "Síntomas → prioridad → acción recomendada + CTA a WhatsApp."
  },
  {
    img: "/brand/feature-portal.webp",
    title: "Portal del cliente",
    desc: "Vacunas, próximos vencimientos e historial mock vía API."
  },
  {
    img: "/brand/feature-admin.webp",
    title: "Admin v1 útil",
    desc: "Ver/confirmar/cancelar, triage entrante, campañas y reset demo."
  },
  { title: "Modo demo persistente", desc: "Todo se guarda en localStorage para que se note “real”." },
  { title: "Deploy rápido", desc: "Next + Tailwind listo para Vercel sin configuración extra." }
];

type HomePageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function HomePage({ searchParams }: HomePageProps) {
  const params = new URLSearchParams();
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (typeof value === "string") params.set(key, value);
      if (Array.isArray(value) && value[0]) params.set(key, value[0]);
    }
  }
  const demoToolsEnabled = isDemoToolsEnabled(params);

  return (
    <div>
      <div className="bg-gradient-to-b from-white to-warm-100 dark:from-graphite-950 dark:to-graphite-900">
        <Container className="grid gap-10 py-10 sm:py-14 lg:grid-cols-2 lg:items-center">
          <div className="grid gap-5">
            <Badge className="w-fit" tone="neutral">
              Demo vendible · Turnos + Urgencias + Portal
            </Badge>
            <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
              Veterinaria moderna para encontrar turno en minutos.
            </h1>
            <p className="max-w-xl text-sm text-black/60 dark:text-white/70 sm:text-lg">
              Agenda con disponibilidad real, triage de urgencias y un portal simple para vacunas e historial. En modo demo, todo queda guardado localmente.
            </p>
            <div className="flex flex-wrap gap-2">
              <LinkButton href="/agenda" className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300">
                Reservar turno
              </LinkButton>
              <LinkButton href="/urgencias" variant="outline">
                Evaluar urgencia
              </LinkButton>
              <LinkButton href={BRAND.implementationCtaUrl} target="_blank" rel="noreferrer" variant="outline">
                {BRAND.implementationCtaLabel}
              </LinkButton>
              {demoToolsEnabled ? (
                <LinkButton href="/adminv1" variant="ghost">
                  Ver panel admin
                </LinkButton>
              ) : null}
            </div>
            <div className="text-xs text-black/50 dark:text-white/60">
              Contacto: {BRAND.phone} · {BRAND.address} · {BRAND.hours}
            </div>
          </div>

          <div className="grid gap-4">
            <Card className="overflow-hidden">
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src="/brand/hero.webp"
                  alt="Perro y gato en una escena de clínica veterinaria moderna"
                  fill
                  priority
                  sizes="(min-width: 1024px) 46vw, (min-width: 640px) 92vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="bg-graphite-900 p-6 text-white">
                <div className="text-sm font-semibold text-white/70">Resumen rápido</div>
                <div className="mt-2 text-2xl font-black">“Me resolvieron el turno y la urgencia en un rato.”</div>
                <div className="mt-3 text-sm text-white/70">Experiencia tipo app, pero con vibra humana.</div>
              </div>
            </Card>
          </div>
        </Container>
      </div>

      <Container className="py-8 sm:py-10">
        <SectionHeading
          eyebrow="Demo en acción"
          title="Así se ve en la práctica"
          desc="Vista rápida de agenda, urgencias y portal con datos de la demo."
        />
        <div className="mt-6">
          <HeroVisual />
        </div>
      </Container>

      <Container className="py-4 sm:py-6">
        <div className="grid gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-graphite-900 sm:grid-cols-2">
          <div>
            <div className="text-sm font-extrabold">Implementación rápida</div>
            <ul className="mt-2 grid gap-1 text-sm text-black/65 dark:text-white/70">
              <li>1. Personalizamos marca, servicios y canales de contacto.</li>
              <li>2. Ajustamos agenda/triage según tu operación actual.</li>
              <li>3. Publicamos y validamos el flujo con casos reales.</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-extrabold">Qué incluye</div>
            <ul className="mt-2 grid gap-1 text-sm text-black/65 dark:text-white/70">
              <li>• Sitio con agenda online y urgencias guiadas.</li>
              <li>• Portal para clientes con vacunas e historial básico.</li>
              <li>• Panel simple para seguimiento interno.</li>
            </ul>
          </div>
        </div>
      </Container>

      <Container className="py-12">
        <SectionHeading
          eyebrow="Diferenciales"
          title="Una demo que se siente lista para vender"
          desc="Copy claro, flujo rápido, y lógica real de turnos. Ideal para cerrar un lead con una prueba concreta."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="grid gap-3">
                {f.img ? (
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl ring-1 ring-black/10 dark:ring-white/10">
                    <Image
                      src={f.img}
                      alt={f.title}
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="text-sm font-extrabold">{f.title}</div>
                <p className="text-sm text-black/60 dark:text-white/70">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          <LinkButton href="/agenda" className="bg-graphite-900 text-white hover:bg-graphite-800">
            Ir a Agenda
          </LinkButton>
          <LinkButton href="/servicios" variant="outline">
            Ver servicios
          </LinkButton>
          <LinkButton href={BRAND.implementationCtaUrl} target="_blank" rel="noreferrer" variant="outline">
            {BRAND.implementationCtaLabel}
          </LinkButton>
          <LinkButton href="/mi-mascota" variant="outline">
            Abrir Mi Mascota
          </LinkButton>
        </div>
      </Container>
    </div>
  );
}
