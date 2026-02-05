import Link from "next/link";
import { BRAND, SERVICES } from "@/lib/data";
import { Container, Card, CardContent, LinkButton, Badge } from "@/components/ui";
import { SectionHeading } from "@/components/section";

export default function HomePage() {
  return (
    <div>
      <div className="bg-gradient-to-b from-white to-warm-100">
        <Container className="py-10 sm:py-14 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="grid gap-5">
            <Badge className="w-fit" tone="neutral">Demo vendible · Turnos + Urgencias + Portal</Badge>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Veterinaria moderna para encontrar turno en minutos.
            </h1>
            <p className="text-sm sm:text-lg text-black/60 max-w-xl">
              Agenda con disponibilidad real, triage de urgencias y un portal simple para vacunas e historial. En modo demo, todo queda guardado localmente.
            </p>
            <div className="flex flex-wrap gap-2">
              <LinkButton href="/agenda" className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300">Reservar turno</LinkButton>
              <LinkButton href="/urgencias" variant="outline">Evaluar urgencia</LinkButton>
              <LinkButton href="/adminv1" variant="ghost">Ver panel admin</LinkButton>
            </div>
            <div className="text-xs text-black/50">
              Contacto: {BRAND.phone} · {BRAND.address} · {BRAND.hours}
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="p-6 bg-graphite-900 text-white">
              <div className="text-sm font-semibold text-white/70">Resumen rápido</div>
              <div className="mt-2 text-2xl font-black">“Me resolvieron el turno y la urgencia en un rato.”</div>
              <div className="mt-3 text-sm text-white/70">Experiencia tipo app, pero con vibra humana.</div>
            </div>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <div className="text-sm font-extrabold">Qué incluye</div>
                <ul className="text-sm text-black/65 grid gap-1">
                  <li>• Agenda con buffers y slots reales</li>
                  <li>• Triage con prioridad y recomendaciones</li>
                  <li>• “Mi Mascota” con vacunas + recordatorio WhatsApp</li>
                  <li>• Admin v1 con estados, campañas y reset</li>
                </ul>
              </div>
              <div className="grid gap-2">
                <div className="text-sm font-extrabold">Servicios populares</div>
                <div className="flex flex-wrap gap-2">
                  {SERVICES.slice(0, 4).map(s => (
                    <Link key={s.id} href={`/agenda?service=${s.id}`} className="rounded-full bg-black/5 px-3 py-1.5 text-xs font-semibold hover:bg-black/10">
                      {s.name}
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </Container>
      </div>

      <Container className="py-12">
        <SectionHeading
          eyebrow="Diferenciales"
          title="Una demo que se siente lista para vender"
          desc="Copy claro, flujo rápido, y lógica real de turnos. Ideal para cerrar un lead con una prueba concreta."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Turnos sin fricción", desc: "Elegís servicio, fecha y horario disponible. Confirmás. Listo." },
            { title: "Urgencias con criterio", desc: "Síntomas → prioridad → acción recomendada + CTA a WhatsApp." },
            { title: "Portal del cliente", desc: "Vacunas, próximos vencimientos e historial mock vía API." },
            { title: "Admin v1 útil", desc: "Ver/confirmar/cancelar, triage entrante, campañas y reset demo." },
            { title: "Modo demo persistente", desc: "Todo se guarda en localStorage para que se note “real”." },
            { title: "Deploy rápido", desc: "Next + Tailwind listo para Vercel sin configuración extra." }
          ].map((f, i) => (
            <Card key={i}>
              <CardContent className="grid gap-2">
                <div className="text-sm font-extrabold">{f.title}</div>
                <p className="text-sm text-black/60">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          <LinkButton href="/agenda" className="bg-graphite-900 text-white hover:bg-graphite-800">Ir a Agenda</LinkButton>
          <LinkButton href="/servicios" variant="outline">Ver servicios</LinkButton>
          <LinkButton href="/mi-mascota" variant="outline">Abrir Mi Mascota</LinkButton>
        </div>
      </Container>
    </div>
  );
}
