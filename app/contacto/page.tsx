import type { Metadata } from "next";

import { Container, Card, CardContent, Badge } from "@/components/ui";
import { COMMERCIAL_IMPLEMENTATION_CTA } from "@/lib/commercialCta";
import { BRAND } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import { ContactoForm } from "./contacto-form";

export const metadata: Metadata = buildPageMetadata({
  title: `Implementación para veterinarias | ${BRAND.name}`,
  description: `Dejanos tus datos y coordinamos una asesoría para adaptar ${BRAND.name} a la atención de tu veterinaria.`,
  path: "/contacto"
});

export default function ContactoPage() {
  return (
    <Container className="py-10 sm:py-14 grid gap-8">
      <section className="grid gap-4">
        <Badge className="w-fit">IMPLEMENTACIÓN</Badge>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Solicitar asesoría para mi veterinaria</h1>
        <p className="max-w-3xl text-sm text-black/65 dark:text-white/70 sm:text-base">
          VetCare reúne agenda online, orientación inicial en urgencias, portal para tutores y un panel operativo para el equipo.
          Completá este formulario y te contactamos con una propuesta adaptada a tu ciudad, tus servicios y tu forma de trabajo.
        </p>
        <div className="grid gap-2 rounded-2xl border border-cyanSoft-200/70 bg-cyanSoft-50/70 p-4 text-sm text-graphite-900 dark:border-cyanSoft-400/20 dark:bg-cyanSoft-400/10 dark:text-white/85 sm:grid-cols-3">
          <div><span className="font-extrabold">Implementación guiada:</span> configuramos marca, servicios y canales de contacto.</div>
          <div><span className="font-extrabold">Salida rápida:</span> validamos agenda, urgencias y seguimiento con tu operación diaria.</div>
          <div><span className="font-extrabold">Contacto unificado:</span> desde acá coordinamos la propuesta, resolvemos dudas y te acompañamos en la puesta en marcha.</div>
        </div>
      </section>

      <Card>
        <CardContent>
          <ContactoForm />
        </CardContent>
      </Card>
    </Container>
  );
}
