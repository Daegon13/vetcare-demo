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
    a: "Cada servicio muestra un precio orientativo antes de reservar. Si durante la consulta se necesita un estudio o tratamiento adicional, te explicamos todo antes de avanzar."
  },
  {
    q: "¿Atienden urgencias fuera de horario?",
    a: "Sí. Podés iniciar la evaluación de urgencia y escribir por WhatsApp para coordinar guardia. Casos con dificultad respiratoria, sangrado activo o desmayo se priorizan de inmediato."
  },
  {
    q: "¿Puedo cancelar o reprogramar un turno?",
    a: "Sí, en pocos pasos desde el mensaje de confirmación. Así liberás ese horario y podés elegir otro turno disponible sin llamadas ni demoras."
  },
  {
    q: "¿Qué horarios manejan para turnos generales?",
    a: "La agenda se actualiza en tiempo real con los horarios disponibles. Si necesitás una opción más cercana, podés escribir por WhatsApp y te ayudamos a resolverlo rápido."
  },
  {
    q: "¿Cómo sé qué vacunas o controles le faltan a mi mascota?",
    a: "En el portal tenés historial clínico, próximos vencimientos y recordatorios automáticos para mantener el plan preventivo al día."
  },
  {
    q: "¿Qué beneficios tiene implementar esta experiencia en mi veterinaria?",
    a: "Te permite responder más rápido, ordenar agenda y urgencias en un mismo flujo, reducir ausencias con recordatorios y dar mejor seguimiento a cada paciente."
  }
];

export default function FAQPage() {
  return (
    <Container className="py-10">
      <SectionHeading
        eyebrow="FAQ"
        title="Preguntas frecuentes"
        desc="Resolvemos las dudas más comunes para que puedas avanzar con claridad, rapidez y seguimiento desde el primer contacto."
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
