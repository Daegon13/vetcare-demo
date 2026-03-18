import type { Metadata } from "next";

import { Container, Card, CardContent, Badge } from "@/components/ui";
import { COMMERCIAL_IMPLEMENTATION_CTA } from "@/lib/commercialCta";
import { BRAND } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import { ContactoDemoForm } from "./contacto-demo-form";

export const metadata: Metadata = buildPageMetadata({
  title: `Implementación para veterinarias | ${BRAND.name}`,
  description: `Dejanos tus datos y te mostramos cómo implementar ${BRAND.name} en tu veterinaria.`,
  path: "/contacto-demo"
});

export default function ContactoDemoPage() {
  return (
    <Container className="py-10 sm:py-14 grid gap-8">
      <section className="grid gap-4">
        <Badge className="w-fit">IMPLEMENTACIÓN</Badge>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Quiero esto para mi veterinaria</h1>
        <p className="max-w-3xl text-sm text-black/65 dark:text-white/70 sm:text-base">
          VetCare incluye agenda online, triage de urgencias, portal para tutores y panel operativo para el equipo.
          Completá este formulario y te contactamos con una propuesta adaptada a tu ciudad y forma de trabajo.
        </p>
        <div className="grid gap-2 rounded-2xl border border-cyanSoft-200/70 bg-cyanSoft-50/70 p-4 text-sm text-graphite-900 dark:border-cyanSoft-400/20 dark:bg-cyanSoft-400/10 dark:text-white/85 sm:grid-cols-3">
          <div><span className="font-extrabold">Implementación guiada:</span> configuramos marca, servicios y flujos.</div>
          <div><span className="font-extrabold">Salida rápida:</span> validamos agenda, urgencias y seguimiento con tu operación real.</div>
          <div><span className="font-extrabold">CTA único:</span> {COMMERCIAL_IMPLEMENTATION_CTA.label} siempre lleva a esta ruta activa.</div>
        </div>
      </section>

      <Card>
        <CardContent>
          <ContactoDemoForm />
        </CardContent>
      </Card>
    </Container>
  );
}
