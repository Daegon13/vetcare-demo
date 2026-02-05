import { Container, Card, CardContent, Badge, LinkButton } from "@/components/ui";
import { SectionHeading } from "@/components/section";

const FAQ = [
  {
    q: "¿Cómo funciona la agenda?",
    a: "Elegís servicio, fecha y un horario disponible. La disponibilidad se calcula con duración + buffer. En producción se conecta a Google Calendar y al sistema interno."
  },
  {
    q: "¿El triage reemplaza al veterinario?",
    a: "No. Es una guía rápida para priorizar. Si hay signos graves (respiración, sangrado, desmayo), es urgencia."
  },
  {
    q: "¿Cómo recuerdan vacunas?",
    a: "En demo se genera un mensaje para WhatsApp. En producción se programan recordatorios automáticos según vencimientos."
  },
  {
    q: "¿Qué hace el panel Admin?",
    a: "Permite confirmar/cancelar turnos, ver triage entrante, editar mascota demo y simular campañas."
  },
  {
    q: "¿Se puede integrar pagos?",
    a: "Sí. Checkout para reservas, señas, planes preventivos y facturación."
  }
];

export default function FAQPage() {
  return (
    <Container className="py-10">
      <SectionHeading
        eyebrow="FAQ"
        title="Preguntas frecuentes"
        desc="Texto pensado para bajar fricción y cerrar la reserva."
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
      </div>
    </Container>
  );
}
