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
    name: "Dra. Valentina Ríos",
    role: "Clínica general y medicina preventiva",
    bio: "Acompaña controles, consultas generales y seguimientos clínicos con una mirada clara y cercana. Se toma el tiempo para explicar qué está pasando y cuál es el próximo paso recomendado para cada mascota."
  },
  {
    name: "Dr. Martín Silva",
    role: "Cirugía y traumatología",
    bio: "Coordina cirugías programadas, evaluaciones prequirúrgicas y recuperaciones postoperatorias con protocolos simples y seguimiento real para cada familia."
  },
  {
    name: "Camila Pereira",
    role: "Recepción y acompañamiento a tutores",
    bio: "Es quien ordena la agenda, confirma turnos y da seguimiento después de cada visita. Su prioridad es que cada tutor sepa a quién escribir y qué esperar en cada etapa."
  },
  {
    name: "Lucía Núñez",
    role: "Baño, corte higiénico y cuidado de piel",
    bio: "Trabaja con manejo amable, tiempos tranquilos y especial atención en mascotas sensibles. Busca que cada visita de estética sea cómoda, segura y sin estrés innecesario."
  }
];

export default function EquipoPage() {
  return (
    <Container className="py-10">
      <SectionHeading
        eyebrow="Equipo"
        title="Un equipo cercano, criterioso y fácil de contactar"
        desc="En VetCare combinamos atención cálida, criterio clínico y seguimiento ordenado para que cada tutor se sienta acompañado antes, durante y después de la consulta."
      />

      <div className="mt-6 max-w-3xl text-sm leading-6 text-black/65">
        Somos una veterinaria de cercanía: preferimos explicar con claridad, responder a tiempo y construir vínculos de confianza con cada familia.
        Cuando una mascota necesita control, cirugía, seguimiento o simplemente una segunda mirada, el objetivo es el mismo: que sepan que hay un equipo presente del otro lado.
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {TEAM.map((p) => (
          <Card key={p.name}>
            <CardContent className="grid gap-3">
              <div className="flex items-start justify-between gap-4">
                <div className="grid gap-1">
                  <div className="text-sm font-extrabold">{p.name}</div>
                  <div className="text-xs font-semibold uppercase tracking-[0.08em] text-black/45">{p.role}</div>
                </div>
                <Badge tone="neutral">Equipo VetCare</Badge>
              </div>
              <div className="text-sm text-black/65">{p.bio}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 rounded-3xl border border-black/10 bg-white/70 p-5 text-sm text-black/65 shadow-sm">
        Si querés conocernos en persona, podés reservar un turno online o escribirnos por WhatsApp. Priorizamos respuestas claras, tiempos razonables y un seguimiento que no dependa de perseguir a la veterinaria por varios canales.
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <LinkButton href="/agenda" className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300">Reservar turno</LinkButton>
        <LinkButton href="/faq" variant="outline">Ver preguntas frecuentes</LinkButton>
        <CommercialImplementationCTA location="equipo" />
      </div>
    </Container>
  );
}
