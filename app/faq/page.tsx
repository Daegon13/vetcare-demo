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
    a: "Cada servicio muestra un precio estimado para que tengas referencia antes de reservar. El valor final puede variar según evaluación clínica y estudios necesarios."
  },
  {
    q: "¿Atienden urgencias fuera de horario?",
    a: "Sí, podés iniciar la evaluación de urgencia y contactar por WhatsApp para coordinar guardia. Si hay dificultad respiratoria, sangrado o desmayo, se prioriza atención inmediata."
  },
  {
    q: "¿Puedo cancelar o reprogramar un turno?",
    a: "Sí. Podés hacerlo con anticipación desde el canal de confirmación para liberar ese horario y elegir uno nuevo según disponibilidad."
  },
  {
    q: "¿Qué horarios manejan para turnos generales?",
    a: "La agenda muestra los horarios disponibles en tiempo real. Si no encontrás lugar hoy, podés dejar consulta por WhatsApp y te proponemos la opción más cercana."
  },
  {
    q: "¿Cómo sé qué vacunas o controles le faltan a mi mascota?",
    a: "En el portal vas a ver historial, próximos vencimientos y recordatorios para mantener el plan preventivo al día."
  },
  {
    q: "¿Cómo puedo evaluar si encaja con mi veterinaria?",
    a: `Podés recorrer agenda, urgencias y portal para conocer la experiencia completa y validar si se adapta a tu forma de trabajo.`
  }
];

export default function FAQPage() {
  return (
    <Container className="py-10">
      <SectionHeading
        eyebrow="FAQ"
        title="Preguntas frecuentes"
        desc="Respuestas claras para decidir con confianza el próximo paso."
      />

      <div className="mt-8 grid gap-3">
        {FAQ.map(item => (
          <Card key={item.q}>
            <CardContent>
              <details className="group">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                  <div className="text-sm font-extrabold">{item.q}</div>
                  <Badge tone="neutral" className="group-open:bg-cyanSoft-50 group-open:text-graphite-900">+</Badge>
                </summary>
                <p className="mt-3 text-sm text-black/65">{item.a}</p>
              </details>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        <LinkButton href="/agenda" className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300">Reservar turno</LinkButton>
        <LinkButton href="/urgencias" variant="outline">Evaluar urgencia</LinkButton>
        <CommercialImplementationCTA />
      </div>
    </Container>
  );
}
