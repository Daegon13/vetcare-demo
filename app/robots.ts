import type { MetadataRoute } from "next";
import { getSiteUrl, shouldNoIndexSite } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  const indexable = !shouldNoIndexSite();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      ...(indexable ? {} : { disallow: "/" })
    },
    sitemap: `${base}/sitemap.xml`
  };
}
