import type { Metadata } from "next";
import { BRAND } from "@/lib/data";
import { getConfiguredPublicSiteUrl } from "@/lib/siteUrl";

const siteUrl = getConfiguredPublicSiteUrl() ?? "https://example.com";
const siteName = BRAND.name;

const defaultOgImage = "/opengraph-image";

function isNoIndexEnabled() {
  const value = process.env.NEXT_PUBLIC_DEMO_NOINDEX?.toLowerCase();
  return value === "1" || value === "true";
}

export function getRobotsMetadata(): Metadata["robots"] {
  const indexable = !isNoIndexEnabled();

  return {
    index: indexable,
    follow: indexable,
    googleBot: {
      index: indexable,
      follow: indexable
    }
  };
}

export function buildPageMetadata({
  title,
  description,
  path
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const canonical = new URL(normalizedPath, siteUrl).toString();

  return {
    title: {
      absolute: title
    },
    description,
    robots: getRobotsMetadata(),
    alternates: {
      canonical
    },
    openGraph: {
      type: "website",
      siteName,
      title,
      description,
      url: canonical,
      images: [defaultOgImage]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultOgImage]
    }
  };
}

export function getSiteUrl() {
  return siteUrl;
}

export function shouldNoIndexSite() {
  return isNoIndexEnabled();
}
