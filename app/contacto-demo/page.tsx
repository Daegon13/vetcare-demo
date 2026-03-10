import type { Metadata } from "next";

import { Container, Card, CardContent, Badge } from "@/components/ui";
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
      </section>

      <Card>
        <CardContent>
          <ContactoDemoForm />
        </CardContent>
      </Card>
    </Container>
  );
}
