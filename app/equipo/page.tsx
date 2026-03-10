import type { Metadata } from "next";
import { BRAND } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import { Container, Card, CardContent, Badge, LinkButton } from "@/components/ui";
import { SectionHeading } from "@/components/section";
import { CommercialImplementationCTA } from "@/components/commercial-implementation-cta";

export const metadata: Metadata = buildPageMetadata({
  title: `Equipo veterinario | ${BRAND.name}`,
  description: `Conocé al equipo de ${BRAND.name}: profesionales en clínica, cirugía y atención integral para mascotas.`,
  path: "/equipo"
});

const TEAM = [
  { name: "Dra. Valentina Pereira", role: "Clínica general", bio: "Enfoque preventivo + medicina interna. Le gusta explicar todo con calma." },
  { name: "Dr. Martín Silva", role: "Cirugía", bio: "Cirugías programadas y urgencias. Protocolos claros y seguimiento." },
  { name: "Camila Ríos", role: "Asistente", bio: "Recepción, recordatorios y cuidado post-consulta. La que ordena el caos." },
  { name: "Santiago Costa", role: "Peluquería / estética", bio: "Baño, corte higiénico, piel sensible y manejo amable." }
];

export default function EquipoPage() {
  return (
    <Container className="py-10">
      <SectionHeading
        eyebrow="Equipo"
        title="Personas reales, trato humano"
        desc="Texto de demo para transmitir confianza y profesionalismo."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {TEAM.map(p => (
          <Card key={p.name}>
            <CardContent className="grid gap-2">
              <div className="flex items-start justify-between gap-4">
                <div className="grid gap-1">
                  <div className="text-sm font-extrabold">{p.name}</div>
                  <div className="text-sm text-black/60">{p.bio}</div>
                </div>
                <Badge tone="neutral">{p.role}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <LinkButton href="/agenda" className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300">Agendar</LinkButton>
        <LinkButton href="/faq" variant="outline">Preguntas frecuentes</LinkButton>
        <CommercialImplementationCTA />
      </div>
    </Container>
  );
}
