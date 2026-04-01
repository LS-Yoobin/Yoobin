"use client";

export type EventParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params?: EventParams) => void;
  }
}

function canTrack() {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

function trackEvent(eventName: string, params: EventParams) {
  if (!canTrack()) return;
  window.gtag?.("event", eventName, params);
}

export function trackCTA(cta_name: string, location: string, destination: string) {
  trackEvent("cta_click", { cta_name, location, destination });
}

export function trackProjectView(project_name: string, section: string, source: string) {
  trackEvent("project_view", { project_name, section, source });
}

export function trackExternalLink(link_name: string, url: string, location: string) {
  trackEvent("external_link_click", { link_name, url, location });
}

export function trackScrollDepth(percent_scrolled: number, page_name: string) {
  trackEvent("engaged_scroll", { percent_scrolled, page_name });
}

export function setupEngagedScrollTracking(page_name: string) {
  if (typeof window === "undefined") return () => {};

  const thresholds = [25, 50, 75, 90] as const;
  const fired = new Set<number>();

  const onScroll = () => {
    const root = document.documentElement;
    const maxScroll = root.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;

    const percent = Math.min(100, Math.round((window.scrollY / maxScroll) * 100));
    for (const threshold of thresholds) {
      if (percent >= threshold && !fired.has(threshold)) {
        fired.add(threshold);
        trackScrollDepth(threshold, page_name);
      }
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
  };
}
