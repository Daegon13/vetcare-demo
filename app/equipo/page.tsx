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
    bio: "Clínica general y medicina interna. Le dedica tiempo a cada consulta y explica diagnósticos y opciones de tratamiento sin vueltas."
  },
  {
    name: "Dr. Martín Silva",
    role: "Cirugía",
    bio: "Cirugías programadas y urgencias. Trabaja con protocolos claros y seguimiento postoperatorio para que cada recuperación sea segura."
  },
  {
    name: "Camila Ríos",
    role: "Asistente",
    bio: "Es el primer contacto con cada familia: coordina turnos, recordatorios y el seguimiento después de cada visita."
  },
  {
    name: "Santiago Costa",
    role: "Peluquería / estética",
    bio: "Baño y corte higiénico con manejo amable, ideal para mascotas sensibles o nerviosas que necesitan ir de a poco."
  }
];

export default function EquipoPage() {
  return (
    <Container className="py-10">
      <SectionHeading
        eyebrow="Equipo"
        title="Conocé al equipo que te acompaña en cada etapa"
        desc="Somos un equipo chico y presente: atención cálida, criterio clínico y seguimiento real para que no te quedes con dudas."
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
        <CommercialImplementationCTA location="equipo" />
      </div>
    </Container>
  );
}
