import type { Metadata } from "next";
import { BRAND } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import { Container, Card, CardContent, Badge, LinkButton } from "@/components/ui";
import { SectionHeading } from "@/components/section";
import { CommercialImplementationCTA } from "@/components/commercial-implementation-cta";

export const metadata: Metadata = buildPageMetadata({
  title: `Preguntas frecuentes | ${BRAND.name}`,
  description: `Resolvé dudas sobre turnos, urgencias, portal y funcionamiento general de ${BRAND.name}.`,
  path: "/faq"
});

const FAQ = [
  {
    q: "¿Cuánto cuesta una consulta o control?",
    a: "Antes de reservar vas a ver un valor orientativo según el tipo de atención. Si durante la consulta hace falta sumar estudios, medicación o un procedimiento, te lo explicamos y lo confirmamos con vos antes de avanzar."
  },
  {
    q: "¿Atienden urgencias fuera de horario?",
    a: "Sí. Podés iniciar la evaluación de urgencia y escribirnos por WhatsApp para coordinar la guardia. Si hay dificultad respiratoria, sangrado activo, convulsiones o desmayo, la indicación es pedir atención inmediata."
  },
  {
    q: "¿Puedo cancelar o reprogramar un turno?",
    a: "Sí. Desde la confirmación podés mover o cancelar el turno en pocos pasos, sin llamadas ni idas y vueltas. Si necesitás ayuda, también podés escribirnos y lo resolvemos con vos."
  },
  {
    q: "¿Qué horarios manejan para turnos generales?",
    a: "La agenda muestra disponibilidad actualizada para consultas, controles y servicios frecuentes. Si no encontrás un horario que te sirva, escribinos por WhatsApp y buscamos la opción más cercana."
  },
  {
    q: "¿Cómo sé qué vacunas o controles le faltan a mi mascota?",
    a: "En el portal podés revisar historial, próximos vencimientos y recordatorios para mantener vacunas y controles al día sin depender de acordarte de memoria."
  },
  {
    q: "¿Qué cambia en la práctica al reservar por esta vía?",
    a: "Ganás claridad desde el inicio: reservás más rápido, recibís recordatorios y tenés un seguimiento más ordenado de controles, vacunas y próximas indicaciones en un solo lugar."
  }
];

export default function FAQPage() {
  return (
    <Container className="py-10">
      <SectionHeading
        eyebrow="FAQ"
        title="Respuestas claras para decidir rápido"
        desc="Reunimos las dudas más comunes sobre turnos, urgencias y seguimiento para que puedas resolverlas en minutos y avanzar con tranquilidad."
      />

      <div className="mt-8 grid gap-3">
        {FAQ.map((item) => (
          <Card key={item.q}>
            <CardContent>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <div className="text-sm font-extrabold">{item.q}</div>
                  <Badge tone="neutral" className="group-open:bg-cyanSoft-50 group-open:text-graphite-900">+</Badge>
                </summary>
                <p className="mt-3 text-sm text-black/65">{item.a}</p>
              </details>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 rounded-3xl border border-black/10 bg-white/70 p-5 text-sm text-black/65 shadow-sm">
        Si tu duda no aparece acá, podés reservar directo o escribirnos por WhatsApp. La idea es que encuentres respuesta rápido y sepas cuál es el mejor siguiente paso para tu mascota.
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <LinkButton href="/agenda" className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300">Reservar turno</LinkButton>
        <LinkButton href="/urgencias" variant="outline">Evaluar urgencia</LinkButton>
        <CommercialImplementationCTA location="faq" />
      </div>
    </Container>
  );
}
