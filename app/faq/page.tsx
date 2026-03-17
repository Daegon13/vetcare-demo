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
    a: "Antes de reservar vas a ver un valor orientativo por servicio. Si durante la consulta hace falta sumar estudios o tratamiento, te lo explicamos y confirmamos con vos antes de avanzar."
  },
  {
    q: "¿Atienden urgencias fuera de horario?",
    a: "Sí. Podés iniciar la evaluación de urgencia y escribir por WhatsApp para coordinar guardia. Si hay dificultad respiratoria, sangrado activo o desmayo, se prioriza atención inmediata."
  },
  {
    q: "¿Puedo cancelar o reprogramar un turno?",
    a: "Sí, desde el mensaje de confirmación en pocos pasos. Podés cancelar o mover el turno sin llamadas y elegir otro horario disponible al momento."
  },
  {
    q: "¿Qué horarios manejan para turnos generales?",
    a: "La agenda se actualiza en tiempo real. Si no encontrás lugar en el horario que necesitás, escribinos por WhatsApp y te ayudamos a encontrar la opción más cercana."
  },
  {
    q: "¿Cómo sé qué vacunas o controles le faltan a mi mascota?",
    a: "En el portal podés ver historial clínico, próximos vencimientos y recordatorios automáticos para mantener vacunas y controles al día."
  },
  {
    q: "¿Qué cambia en la práctica al reservar por esta vía?",
    a: "Todo se vuelve más simple: reservas más rápido, recibís recordatorios para no olvidarte y podés hacer seguimiento de controles y vacunas en un solo lugar."
  }
];

export default function FAQPage() {
  return (
    <Container className="py-10">
      <SectionHeading
        eyebrow="FAQ"
        title="Preguntas frecuentes"
        desc="Estas son las dudas que más recibimos en el día a día: respuestas claras para reservar rápido y hacer seguimiento sin fricción."
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
