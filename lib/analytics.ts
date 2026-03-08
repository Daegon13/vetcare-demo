"use client";

type TrackEventPayload = Record<string, string | number | boolean | undefined>;
type AnalyticsEvent = {
  name: string;
  payload: TrackEventPayload;
  ts: string;
  path?: string;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (command: "event", name: string, params?: Record<string, unknown>) => void;
  }
}

export function trackEvent(name: string, payload: TrackEventPayload = {}) {
  if (typeof window === "undefined") return;

  try {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[analytics]", name, payload);
    }

    if (typeof window.gtag === "function") {
      window.gtag("event", name, payload);
    }

    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: name, ...payload });
    }

    if (process.env.NODE_ENV === "production" && typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const event: AnalyticsEvent = {
        name,
        payload,
        ts: new Date().toISOString(),
        path: window.location?.pathname
      };
      const body = new Blob([JSON.stringify(event)], { type: "application/json" });
      navigator.sendBeacon("/api/analytics", body);
    }
  } catch {
    // Never break app flow for analytics.
  }
}
