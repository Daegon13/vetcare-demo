import type { Metadata } from "next";
import { SectionHeading } from "@/components/section";
import { LeadCTA } from "@/components/LeadCTA";
import { Container, Card, CardContent, CardHeader, Badge, LinkButton } from "@/components/ui";
import { BRAND } from "@/lib/data";
import { CommercialImplementationCTA } from "@/components/commercial-implementation-cta";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `Ubicación y contacto | ${BRAND.name}`,
  description: `Encontrá la ubicación de ${BRAND.name}, horarios de atención y vías de contacto para turnos y consultas.`,
  path: "/ubicacion"
});

export default function UbicacionPage() {
  const mapsQuery = encodeURIComponent(BRAND.address);

  return (
    <Container className="py-10">
      <SectionHeading
        eyebrow="Ubicación"
        title="Cómo llegar y cuándo venir"
        desc="Estamos en una zona de fácil acceso, con atención clínica general y soporte prioritario para urgencias."
      />

      <div className="mt-8 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3 overflow-hidden border-black/10">
          <CardHeader className="grid gap-3 border-b border-black/10 bg-white/70">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="neutral">Atención en consultorio</Badge>
              <Badge tone="neutral">Acceso simple desde avenidas principales</Badge>
            </div>
            <div>
              <div className="text-sm font-extrabold">{BRAND.name}</div>
              <div className="text-sm text-black/65">{BRAND.address}</div>
            </div>
          </CardHeader>

          <CardContent className="grid gap-4 p-4 sm:p-6">
            <div className="rounded-2xl border border-black/10 bg-gradient-to-br from-cyanSoft-50 via-white to-warm-50 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Punto de referencia</p>
                  <h3 className="mt-1 text-lg font-black tracking-tight">Corredor comercial con acceso rápido</h3>
                  <p className="mt-2 text-sm text-black/65">
                    A pocos minutos de avenidas principales y paradas de transporte. Ideal para visitas programadas y atención el mismo día.
                  </p>
                </div>
                <div className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-black/70">
                  Llegada estimada<br />
                  10 a 15 min desde zonas céntricas
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl border border-black/10 bg-white p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-black/45">Horario de atención</div>
                  <div className="mt-1 text-sm font-semibold">{BRAND.hours}</div>
                </div>
                <div className="rounded-xl border border-black/10 bg-white p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-black/45">Canal rápido</div>
                  <div className="mt-1 text-sm font-semibold">WhatsApp y agenda online</div>
                </div>
              </div>
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
              <CommercialImplementationCTA location="ubicacion" />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="text-sm font-extrabold">Información para tu visita</div>
            <div className="text-sm text-black/60">Todo lo necesario para llegar y ser atendido sin demoras.</div>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="text-sm font-semibold">Estacionamiento</div>
              <div className="text-sm text-black/60">Cocheras privadas y espacios de estacionamiento medido a menos de una cuadra.</div>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="text-sm font-semibold">Accesibilidad</div>
              <div className="text-sm text-black/60">Ingreso a nivel de vereda, puerta amplia y sala de espera cómoda para tutores y mascotas.</div>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="text-sm font-semibold">Atención de urgencias</div>
              <div className="text-sm text-black/60">Si tu mascota necesita prioridad, escribinos por WhatsApp para coordinar ingreso y prepararnos antes de tu llegada.</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
