import Image from "next/image";
import { Container, Card, CardContent, Badge, LinkButton } from "@/components/ui";
import { LeadCTA } from "@/components/LeadCTA";
import { BRAND, SERVICES } from "@/lib/data";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `Servicios veterinarios | ${BRAND.name}`,
  description: `Explorá los servicios de ${BRAND.name}: consulta, vacunación, cirugía, internación y más con foco preventivo.`,
  path: "/servicios"
});

const ICONS: Array<{ key: string; label: string }> = [
  { key: "consulta", label: "Consulta" },
  { key: "vacunacion", label: "Vacunación" },
  { key: "desparasitacion", label: "Desparasitación" },
  { key: "laboratorio", label: "Laboratorio" },
  { key: "cirugia", label: "Cirugía" },
  { key: "internacion", label: "Internación" },
  { key: "grooming", label: "Estética" },
  { key: "control", label: "Control" }
];

const SERVICE_ICON_BY_ID: Record<string, string> = {
  consulta: "consulta",
  control: "control",
  vacunacion: "vacunacion",
  desparasitacion: "desparasitacion",
  cirugia: "cirugia",
  estetica: "grooming"
};

function iconSrc(key: string) {
  return `/brand/icons/${key}.webp`;
}

export default function ServicesPage() {
  return (
    <div className="bg-gradient-to-b from-white to-warm-100 dark:from-graphite-950 dark:to-graphite-900">
      <Container className="grid gap-10 py-10 sm:py-14">
        <section className="grid gap-4">
          <Badge className="w-fit">SERVICIOS</Badge>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Cuidado veterinario completo para cada etapa de tu mascota</h1>
          <p className="max-w-2xl text-sm text-black/65 dark:text-white/70 sm:text-base">
            En {BRAND.name} combinamos atención clínica, seguimiento preventivo y acompañamiento cercano para que resuelvas en un solo lugar lo que tu mascota necesita, con profesionales dedicados y tiempos pensados para atenderla con calma.
          </p>
          <ul className="grid gap-1 text-sm text-black/65 dark:text-white/70">
            <li>• Consultas organizadas para reducir esperas y darte una experiencia más cómoda.</li>
            <li>• Recordatorios y seguimiento para sostener controles, vacunas y tratamientos.</li>
            <li>• Recomendaciones claras para que tomes decisiones con confianza en cada visita.</li>
          </ul>
        </section>

        <section className="grid gap-4 rounded-2xl border border-black/5 bg-white/70 p-5 shadow-soft dark:border-white/10 dark:bg-graphite-900/70 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-extrabold tracking-wide">Servicios destacados</h2>
            <span className="text-xs text-black/50 dark:text-white/55">Todo en un solo lugar</span>
          </div>

          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {ICONS.map((icon) => (
              <div
                key={icon.key}
                className="grid place-items-center gap-1 rounded-2xl border border-black/5 bg-white/80 p-2 dark:border-white/10 dark:bg-graphite-950/30"
              >
                <Image
                  src={iconSrc(icon.key)}
                  alt={icon.label}
                  width={96}
                  height={96}
                  className="h-14 w-14 sm:h-16 sm:w-16"
                />
                <div className="text-[11px] font-semibold text-black/60 dark:text-white/70">{icon.label}</div>
              </div>
            ))}
          </div>

          <p className="text-xs text-black/55 dark:text-white/60">
            Identificá rápidamente el tipo de atención que buscás y elegí la opción más conveniente para tu mascota.
          </p>
        </section>

        <section className="grid gap-4">
          <div className="grid gap-2">
            <h2 className="text-xl font-extrabold sm:text-2xl">Listado de servicios</h2>
            <p className="max-w-2xl text-sm text-black/60 dark:text-white/65">
              Te mostramos tiempos estimados y valores de referencia para ayudarte a comparar opciones y reservar con mayor tranquilidad.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => {
              const iconKey = SERVICE_ICON_BY_ID[s.id] ?? "consulta";
              return (
                <Card key={s.id}>
                  <CardContent className="grid gap-4">
                    <div className="flex items-start gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl border border-black/5 bg-white dark:border-white/10 dark:bg-graphite-950/40">
                        <Image src={iconSrc(iconKey)} alt={s.name} width={56} height={56} className="h-10 w-10" />
                      </div>
                      <div className="grid gap-1">
                        <div className="text-sm font-extrabold">{s.name}</div>
                        <p className="text-sm text-black/65 dark:text-white/70">{s.desc}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <div className="text-[11px] font-semibold text-black/50 dark:text-white/55">Tiempo estimado</div>
                        <div className="font-bold">{s.durationMin} min</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-black/50 dark:text-white/55">Preparación</div>
                        <div className="font-bold">{s.bufferMin} min</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-black/50 dark:text-white/55">Desde</div>
                        <div className="font-bold">{s.priceFrom}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <p className="text-xs text-black/55 dark:text-white/60">
            Los valores son orientativos y pueden ajustarse según la evaluación profesional, estudios complementarios o necesidades particulares de cada mascota.
          </p>
        </section>

        <section className="grid gap-4 rounded-2xl border border-black/5 bg-white/75 p-5 shadow-soft dark:border-white/10 dark:bg-graphite-900/70 sm:p-6">
          <div className="grid gap-2">
            <h2 className="text-xl font-extrabold sm:text-2xl">¿Listo para coordinar la atención?</h2>
            <p className="max-w-2xl text-sm text-black/65 dark:text-white/70">
              Reservá tu turno online o escribinos por WhatsApp y te ayudamos a elegir el servicio más adecuado para tu mascota.
            </p>
          </div>

          <div className="flex flex-wrap justify-start gap-2">
            <LinkButton href="/agenda" className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300">
              Reservar turno
            </LinkButton>
            <LeadCTA interest="servicios" label="Consultar por WhatsApp" variant="outline" />
          </div>
        </section>
      </Container>
    </div>
  );
}
