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
  {
    name: "Dra. Valentina Pereira",
    role: "Clínica general",
    bio: "Clínica general y medicina interna. Prioriza la prevención y explica cada diagnóstico con lenguaje claro."
  },
  {
    name: "Dr. Martín Silva",
    role: "Cirugía",
    bio: "Cirugías programadas y urgencias con protocolos definidos. Seguimiento postoperatorio para acompañar cada recuperación."
  },
  {
    name: "Camila Ríos",
    role: "Asistente",
    bio: "Coordina turnos, recordatorios e indicaciones post-consulta para que cada familia sepa cómo seguir en casa."
  },
  {
    name: "Santiago Costa",
    role: "Peluquería / estética",
    bio: "Baño, corte higiénico y cuidado de piel sensible con manejo amable, especialmente en mascotas nerviosas."
  }
];

export default function EquipoPage() {
  return (
    <Container className="py-10">
      <SectionHeading
        eyebrow="Equipo"
        title="Un equipo que conoce a cada mascota por su nombre"
        desc="Combinamos criterio clínico, comunicación cercana y seguimiento para que cada consulta termine con un plan claro."
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
