import { BRAND } from "@/lib/data";
import { Container, Card, CardContent, CardHeader, Badge, LinkButton } from "@/components/ui";
import { SectionHeading } from "@/components/section";

export default function UbicacionPage() {
  const mapsQuery = encodeURIComponent(BRAND.address);
  return (
    <Container className="py-10">
      <SectionHeading
        eyebrow="Ubicación"
        title="Estamos cerca y con horarios claros"
        desc="En producción: mapa embebido, click-to-call y navegación."
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
              <div className="text-sm font-extrabold">Mapa (placeholder)</div>
              <p className="text-sm text-black/60 mt-1">
                En demo lo dejamos liviano. En un deploy real se integra Google Maps / Mapbox o un iframe.
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
              <div className="text-sm text-black/60">Texto de demo: zona con estacionamiento cercano.</div>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="text-sm font-semibold">Accesibilidad</div>
              <div className="text-sm text-black/60">Entrada a nivel de vereda, sin escalones.</div>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="text-sm font-semibold">Guardia</div>
              <div className="text-sm text-black/60">Usar /urgencias para triage y contacto rápido.</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
