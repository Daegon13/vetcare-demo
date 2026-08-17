import type { Metadata } from "next";
import { BRAND } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import PedidosClientPage from "./pedidos-client-page";
import { Suspense } from "react";

export const metadata: Metadata = buildPageMetadata({ title: `Pedidos | ${BRAND.name}`, description: "Pedido rápido de productos cotidianos con retiro o entrega a coordinar.", path: "/pedidos" });
export default function PedidosPage() { return <Suspense fallback={<div className="mx-auto max-w-6xl p-10">Preparando pedido…</div>}><PedidosClientPage /></Suspense>; }
