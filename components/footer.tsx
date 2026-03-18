import { BRAND } from "@/lib/data";
import { Container, LinkButton } from "./ui";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-black/5 bg-white">
      <Container className="grid gap-6 py-10 sm:grid-cols-2">
        <div className="grid gap-3">
          <div>
            <div className="text-sm font-extrabold">{BRAND.name}</div>
            <p className="mt-1 max-w-md text-sm text-black/60">
              Atención veterinaria más simple: agenda online, orientación inmediata y seguimiento claro para cada familia.
            </p>
          </div>
          <p className="max-w-md text-xs text-black/45">
            Presentación interactiva de la experiencia digital de VetCare.
          </p>
        </div>

        <div className="grid gap-3 sm:justify-items-end">
          <div className="grid gap-1 text-sm text-black/65 sm:text-right">
            <div className="font-semibold text-black/80">Contacto</div>
            <div>{BRAND.address}</div>
            <div>{BRAND.hours}</div>
            <div>{BRAND.phone}</div>
          </div>
          <div className="flex gap-2">
            <LinkButton href="/agenda" variant="outline">Reservar turno</LinkButton>
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
        © {new Date().getFullYear()} {BRAND.name}
      </div>
    </footer>
  );
}
