import Link from "next/link";
import { SERVICES } from "@/lib/data";
import { Container, Card, CardContent, Badge, LinkButton } from "@/components/ui";
import { SectionHeading } from "@/components/section";

export default function ServiciosPage() {
  return (
    <Container className="py-10">
      <SectionHeading
        eyebrow="Servicios"
        title="Atención clínica, preventiva y estética"
        desc="Precios orientativos para demo. La agenda calcula duración y buffer por tipo de servicio."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {SERVICES.map(s => (
          <Card key={s.id}>
            <CardContent className="grid gap-2">
              <div className="flex items-start justify-between gap-4">
                <div className="grid gap-1">
                  <div className="text-sm font-extrabold">{s.name}</div>
                  <div className="text-sm text-black/60">{s.desc}</div>
                </div>
                <Badge tone="neutral">{s.priceFrom}</Badge>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Link href={`/agenda?service=${s.id}`} className="rounded-xl bg-black/5 px-3 py-2 text-xs font-semibold hover:bg-black/10">
                  Agendar {s.durationMin} min
                </Link>
                <div className="rounded-xl bg-black/5 px-3 py-2 text-xs font-semibold">
                  Buffer {s.bufferMin} min
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <LinkButton href="/agenda" className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300">Reservar turno</LinkButton>
        <LinkButton href="/urgencias" variant="outline">Si es urgencia, evaluar</LinkButton>
      </div>
    </Container>
  );
}
