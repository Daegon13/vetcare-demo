import Link from "next/link";
import { SERVICES } from "@/lib/data";
import { Container, Card, CardContent, Badge, LinkButton } from "@/components/ui";
import { SectionHeading } from "@/components/section";
import Image from "next/image";

export default function ServiciosPage() {
  return (
    <Container className="py-10">
      <SectionHeading
        eyebrow="Servicios"
        title="Atención clínica, preventiva y estética"
        desc="Precios orientativos para demo. La agenda calcula duración y buffer por tipo de servicio."
      />
<div className="mt-6 rounded-2xl border border-black/5 bg-white p-4 shadow-soft dark:border-white/10 dark:bg-graphite-900">
  <div className="text-sm font-extrabold">Servicios (vista rápida)</div>
  <div className="mt-3 relative aspect-[4/1] w-full overflow-hidden rounded-2xl ring-1 ring-black/10 dark:ring-white/10">
    <Image
      src="/brand/services-icons.webp"
      alt="Íconos de servicios veterinarios"
      fill
      loading="lazy"
      sizes="(min-width: 1024px) 60vw, 95vw"
      className="object-cover"
    />
  </div>
</div>


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