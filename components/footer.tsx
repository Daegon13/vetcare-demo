import { BRAND } from "@/lib/data";
import { Container, LinkButton } from "./ui";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-black/5 bg-white">
      <Container className="grid gap-6 py-10 sm:grid-cols-2">
        <div className="grid gap-3">
          <div>
            <div className="text-sm font-extrabold">{BRAND.name}</div>
            <p className="mt-1 max-w-md text-sm text-black/60">{BRAND.tagline}</p>
          </div>
          <p className="max-w-md text-xs text-black/45">
            Contacto: {BRAND.phone} · {BRAND.address} · {BRAND.hours}
          </p>
        </div>

        <div className="grid gap-3 sm:justify-items-end">
          <div className="text-sm font-semibold text-black/80 sm:text-right">¿Querés coordinar una consulta o conocer la implementación? Te dejamos una opción clara para cada caso.</div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <LinkButton href="/agenda" variant="outline">Reservar turno</LinkButton>
            <LinkButton
              href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="bg-cyanSoft-400 text-graphite-950 hover:bg-cyanSoft-300"
            >
              Hablar por WhatsApp
            </LinkButton>
            <LinkButton href="/contacto" variant="outline">Solicitar asesoría</LinkButton>
          </div>
        </div>
      </Container>
      <div className="border-t border-black/5 py-4 text-center text-xs text-black/50">
        © {new Date().getFullYear()} {BRAND.name}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
