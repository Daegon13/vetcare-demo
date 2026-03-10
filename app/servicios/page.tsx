import Image from "next/image";
import { Container, Card, CardContent, Badge } from "@/components/ui";
import { LeadCTA } from "@/components/LeadCTA";
import { CommercialImplementationCTA } from "@/components/commercial-implementation-cta";
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
  { key: "grooming", label: "Grooming" },
  { key: "control", label: "Control" }
];

const SERVICE_ICON_BY_ID: Record<string, string> = {
  consulta: "consulta",
  control: "control",
  vacunacion: "vacunacion",
  desparasitacion: "desparasitacion",
  cirugia: "cirugia",
  // In our demo data, "estetica" is the closest match to "grooming".
  estetica: "grooming"
};

function iconSrc(key: string) {
  // Icons live in /public/brand/icons. Prefer .webp (smaller), keep names stable.
  return `/brand/icons/${key}.webp`;
}

export default function ServicesPage() {
  return (
    <div className="bg-gradient-to-b from-white to-warm-100 dark:from-graphite-950 dark:to-graphite-900">
      <Container className="py-10 sm:py-14 grid gap-10">
        <section className="grid gap-4">
          <Badge className="w-fit">SERVICIOS</Badge>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Atención clínica, preventiva y estética</h1>
          <p className="max-w-2xl text-sm sm:text-base text-black/65 dark:text-white/70">
            Elegí el tipo de atención, revisá tiempos estimados y reservá en minutos. Los valores publicados son de referencia y pueden variar según evaluación clínica.
          </p>
          <ul className="grid gap-1 text-sm text-black/65 dark:text-white/70">
            <li>• Turnos con duración real por servicio para evitar sobrecarga en recepción.</li>
            <li>• Confirmaciones y recordatorios por WhatsApp para bajar ausencias.</li>
            <li>• Historial de cada mascota para decisiones clínicas más rápidas.</li>
          </ul>
        </section>

        <section className="grid gap-4 rounded-2xl border border-black/5 bg-white/70 p-5 shadow-soft dark:border-white/10 dark:bg-graphite-900/70 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-extrabold tracking-wide">Servicios (vista rápida)</h2>
            <span className="text-xs text-black/50 dark:text-white/55">Iconos 1:1</span>
          </div>

          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {ICONS.map(icon => (
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
            Catálogo visual de prestaciones para facilitar la elección del servicio adecuado.
          </p>
        </section>

        <section className="grid gap-4">
          <h2 className="text-xl sm:text-2xl font-extrabold">Listado de servicios</h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(s => {
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
                        <div className="text-[11px] font-semibold text-black/50 dark:text-white/55">Agendar</div>
                        <div className="font-bold">{s.durationMin} min</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-black/50 dark:text-white/55">Buffer</div>
                        <div className="font-bold">{s.bufferMin} min</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-black/50 dark:text-white/55">$</div>
                        <div className="font-bold">{s.priceFrom}</div>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex flex-wrap justify-start gap-2">
            <LeadCTA interest="servicios" label="Consultar servicios por WhatsApp" className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300" />
            <CommercialImplementationCTA />
          </div>
        </section>
      </Container>
    </div>
  );
}
