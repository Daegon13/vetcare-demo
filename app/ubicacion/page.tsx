import type { Metadata } from "next";
import { Clock3, Compass, MapPin, CarFront, ShieldPlus, PhoneCall, Accessibility, Route } from "lucide-react";
import { SectionHeading } from "@/components/section";
import { LeadCTA } from "@/components/LeadCTA";
import { Container, Card, CardContent, CardHeader, Badge, LinkButton } from "@/components/ui";
import { BRAND } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `Ubicación y contacto | ${BRAND.name}`,
  description: `Encontrá la ubicación de ${BRAND.name}, horarios de atención y vías de contacto para turnos y consultas.`,
  path: "/ubicacion"
});

const visitHighlights = [
  {
    icon: Clock3,
    title: "Horarios de atención",
    description: BRAND.hours,
    detail: "Consultas con agenda previa y acompañamiento para casos prioritarios."
  },
  {
    icon: Compass,
    title: "Referencia de zona",
    description: "Sobre Av. Italia, en un tramo comercial de fácil acceso.",
    detail: "Cerca de servicios, paradas de ómnibus y vías rápidas para llegar desde distintos barrios."
  },
  {
    icon: CarFront,
    title: "Estacionamiento",
    description: "Hay cocheras privadas y lugares de estacionamiento medido en la misma cuadra.",
    detail: "Si venís con transportadora o perro grande, suele haber espacios cómodos en horarios de media mañana y primera hora de la tarde."
  },
  {
    icon: Accessibility,
    title: "Accesibilidad",
    description: "Ingreso a nivel de vereda, puerta amplia y circulación cómoda dentro del consultorio.",
    detail: "La sala de espera permite entrar con correa, coche o transportadora sin maniobras incómodas."
  }
];

const urgencySteps = [
  "Si notás dificultad para respirar, sangrado persistente, convulsiones o dolor intenso, escribinos o llamanos antes de salir.",
  "Indicá especie, peso aproximado, síntoma principal y hace cuánto empezó para preparar el ingreso.",
  "Si ya estás en camino, avisános por WhatsApp para esperarte y reducir tiempos de recepción."
];

export default function UbicacionPage() {
  const mapsQuery = encodeURIComponent(BRAND.address);
  const mapsEmbed = `https://www.google.com/maps?q=${mapsQuery}&z=16&output=embed`;

  return (
    <Container className="py-10">
      <SectionHeading
        eyebrow="Ubicación"
        title="Una sede cómoda para consultas, controles y atención prioritaria"
        desc="Te esperamos en una ubicación de acceso simple, con información clara para organizar la visita y llegar con tranquilidad junto a tu mascota."
      />

      <div className="mt-8 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="overflow-hidden border border-black/10 bg-gradient-to-br from-white via-white to-cyanSoft-50/60">
          <CardHeader className="border-b border-black/10 bg-white/80">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="good">Sede de atención</Badge>
              <Badge tone="neutral">Acceso ágil desde avenidas principales</Badge>
              <Badge tone="neutral">Agenda y WhatsApp activos</Badge>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/45">{BRAND.name}</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-graphite-950">Cómo llegar y qué esperar en tu visita</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-black/65">
                  Nuestra sede está pensada para resolver consultas clínicas, controles y seguimientos con una experiencia ordenada desde el primer contacto.
                  Es una zona conocida, práctica para llegar y con opciones cercanas para estacionar o descender con tu mascota.
                </p>
              </div>

              <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-soft">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-cyanSoft-100 p-3 text-cyanSoft-700">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/45">Dirección</p>
                    <p className="mt-1 text-base font-bold text-graphite-950">{BRAND.address}</p>
                    <p className="mt-2 text-sm leading-6 text-black/65">
                      Zona comercial consolidada, con movimiento diurno, veredas amplias y buena conectividad para llegar en auto, taxi o transporte público.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="grid gap-5 p-4 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2">
              {visitHighlights.map(({ icon: Icon, title, description, detail }) => (
                <div key={title} className="rounded-3xl border border-black/10 bg-white p-4 shadow-soft">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-warm-50 p-3 text-graphite-900 ring-1 ring-black/5">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-graphite-950">{title}</div>
                      <div className="mt-1 text-sm font-medium text-black/75">{description}</div>
                      <p className="mt-2 text-sm leading-6 text-black/60">{detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <LinkButton
                href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                target="_blank"
                rel="noreferrer"
                variant="outline"
              >
                Abrir en Google Maps
              </LinkButton>
              <LinkButton href="/agenda" className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300">
                Agendar turno
              </LinkButton>
              <LeadCTA interest="general" label="Consultar por WhatsApp" variant="outline" />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="overflow-hidden border border-black/10">
            <div className="relative h-[260px] w-full overflow-hidden border-b border-black/10 bg-gradient-to-br from-cyanSoft-100 via-white to-warm-50">
              <iframe
                title={`Mapa de ${BRAND.name}`}
                src={mapsEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full"
              />
              <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-2xl border border-white/70 bg-white/88 p-3 shadow-soft backdrop-blur">
                <div className="flex items-center gap-2 text-sm font-bold text-graphite-950">
                  <Route className="h-4 w-4" />
                  Llegada simple para consultas programadas y visitas el mismo día
                </div>
                <p className="mt-1 text-sm text-black/65">
                  Una ubicación práctica para entrar, estacionar cerca y resolver la atención sin vueltas.
                </p>
              </div>
            </div>

            <CardContent className="grid gap-3">
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-cyanSoft-100 p-3 text-cyanSoft-700">
                    <PhoneCall className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-graphite-950">Contacto directo</div>
                    <div className="mt-1 text-sm text-black/70">{BRAND.phone}</div>
                    <p className="mt-2 text-sm leading-6 text-black/60">
                      Para confirmar horarios, avisar que estás en camino o coordinar una atención prioritaria.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-black/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-rose-50 p-3 text-rose-700">
                  <ShieldPlus className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-extrabold">Si se trata de una urgencia</div>
                  <div className="text-sm text-black/60">Actuar con unos datos básicos nos ayuda a recibirte mejor y más rápido.</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3">
              {urgencySteps.map((step, index) => (
                <div key={step} className="flex gap-3 rounded-2xl border border-black/10 bg-white p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-graphite-950 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-black/70">{step}</p>
                </div>
              ))}
              <LeadCTA interest="urgencias" label="Avisar una urgencia por WhatsApp" className="w-full bg-graphite-950 text-white hover:bg-graphite-800" />
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
