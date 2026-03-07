import type { Metadata } from "next";
import { BRAND } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `Urgencias veterinarias | ${BRAND.name}`,
  description: `Evaluá síntomas y prioridad de urgencia en ${BRAND.name} para actuar rápido con orientación clara.`,
  path: "/urgencias"
});

export default function UrgenciasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
