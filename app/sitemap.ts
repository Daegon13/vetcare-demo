import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const routes = ["", "/servicios", "/agenda", "/urgencias", "/mi-mascota", "/equipo", "/ubicacion", "/faq", "/lp", "/gracias"];

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/lp" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/lp" ? 0.9 : 0.7
  }));
}
