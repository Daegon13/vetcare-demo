import type { Metadata } from "next";
import { BRAND } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import UrgenciasClientPage from "./urgencias-client-page";

export const metadata: Metadata = buildPageMetadata({
  title: `Urgencias veterinarias | ${BRAND.name}`,
  description: `Evaluá síntomas y prioridad de urgencia en ${BRAND.name} para actuar rápido con orientación clara.`,
  path: "/urgencias"
});

export default function UrgenciasPage() {
  return <UrgenciasClientPage />;
}
