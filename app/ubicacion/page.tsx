import type { Metadata } from "next";
import { BRAND } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/section";
import { CommercialImplementationCTA } from "@/components/commercial-implementation-cta";
import { Container, Card, CardContent, CardHeader, Badge, LinkButton } from "@/components/ui";

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
        title="Estamos cerca y con horarios claros"
        desc="Encontranos fácil y coordiná tu visita en minutos."
      />

      <div className="mt-8 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3 overflow-hidden">
          <CardHeader className="flex items-center justify-between gap-3">
            <div className="grid">
              <div className="text-sm font-extrabold">Dirección</div>
              <div className="text-sm text-black/60">{BRAND.address}</div>
            </div>
            <Badge tone="neutral">{BRAND.hours}</Badge>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="rounded-2xl border border-dashed border-black/15 bg-warm-50 p-6">
              <div className="text-sm font-extrabold">Mapa de referencia</div>
              <p className="text-sm text-black/60 mt-1">
                Usá el acceso directo para abrir la ubicación y llegar por la ruta más conveniente.
              </p>
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
              <LinkButton href="/agenda" className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300">Agendar</LinkButton>
              <CommercialImplementationCTA />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="text-sm font-extrabold">Info útil</div>
            <div className="text-sm text-black/60">para convertir</div>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="text-sm font-semibold">Estacionamiento</div>
              <div className="text-sm text-black/60">Zona con estacionamiento cercano.</div>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="text-sm font-semibold">Accesibilidad</div>
              <div className="text-sm text-black/60">Entrada a nivel de vereda, sin escalones.</div>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="text-sm font-semibold">Guardia</div>
              <div className="text-sm text-black/60">Si necesitás atención prioritaria, podés iniciar una evaluación rápida desde Urgencias.</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
