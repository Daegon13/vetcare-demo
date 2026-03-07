import type { Metadata } from "next";
import { BRAND } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import GraciasClientPage from "./gracias-client-page";

export const metadata: Metadata = buildPageMetadata({
  title: `Gracias por tu consulta | ${BRAND.name}`,
  description: `Gracias por contactar a ${BRAND.name}. Te respondemos pronto para avanzar con la implementación.`,
  path: "/gracias"
});

export default function GraciasPage() {
  return <GraciasClientPage />;
}
