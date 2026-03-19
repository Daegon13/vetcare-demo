const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);

function normalizeAbsoluteUrl(value?: string | null) {
  if (!value) return null;

  try {
    const url = new URL(value);
    url.pathname = url.pathname.replace(/\/$/, "");
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function getConfiguredPublicSiteUrl() {
  return normalizeAbsoluteUrl(process.env.NEXT_PUBLIC_SITE_URL);
}

export function getBrowserOrigin() {
  if (typeof window === "undefined") return null;
  return normalizeAbsoluteUrl(window.location.origin);
}

export function isLocalOrigin(url: string | null) {
  if (!url) return false;

  try {
    return LOCAL_HOSTNAMES.has(new URL(url).hostname);
  } catch {
    return false;
  }
}

export function resolvePublicSiteUrl() {
  return getConfiguredPublicSiteUrl() ?? getBrowserOrigin();
}
