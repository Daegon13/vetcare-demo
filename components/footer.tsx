import { BRAND } from "@/lib/data";
import { Container, LinkButton } from "./ui";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-black/5 bg-white">
      <Container className="py-10 grid gap-6 sm:grid-cols-2">
        <div className="grid gap-2">
          <div className="text-sm font-extrabold">{BRAND.name}</div>
          <p className="text-sm text-black/60 max-w-md">
            Demo de sitio para veterinaria: agenda, triage, portal de mascota y admin. Todo funciona con datos locales (modo demo).
          </p>
        </div>
        <div className="grid gap-3 sm:justify-items-end">
          <div className="text-sm font-semibold">Contacto</div>
          <div className="text-sm text-black/65">{BRAND.address}</div>
          <div className="text-sm text-black/65">{BRAND.hours}</div>
          <div className="flex gap-2">
            <LinkButton href="/agenda" variant="outline">Agendar</LinkButton>
            <LinkButton
              href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300"
            >
              WhatsApp
            </LinkButton>
          </div>
        </div>
      </Container>
      <div className="border-t border-black/5 py-4 text-center text-xs text-black/50">
        VetCare Demo · Datos simulados para evaluación comercial · {new Date().getFullYear()}
      </div>
    </footer>
  );
}
