import type { Metadata } from "next";
import { BRAND } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `Link builder de marketing | ${BRAND.name}`,
  description: `Creá enlaces con UTM para campañas desde el panel demo de ${BRAND.name}.`,
  path: "/adminv1/marketing"
});

export default function AdminMarketingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
