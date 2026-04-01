"use client";

import { useEffect } from "react";
import {
  setupEngagedScrollTracking,
  trackCTA,
  trackExternalLink,
  trackProjectView,
  trackScrollDepth,
} from "@/lib/analytics";

type IframeAnalyticsMessage = {
  type: "ga4_event";
  eventName: "cta_click" | "project_view" | "external_link_click" | "engaged_scroll";
  params?: Record<string, unknown>;
};

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export default function AnalyticsEventBridge() {
  useEffect(() => {
    const cleanupScroll = setupEngagedScrollTracking("home");

    const onMessage = (event: MessageEvent) => {
      const data = event.data as IframeAnalyticsMessage | null;
      if (!data || data.type !== "ga4_event") return;

      const params = data.params ?? {};

      switch (data.eventName) {
        case "cta_click":
          trackCTA(
            asString(params.cta_name, "unknown"),
            asString(params.location, "unknown"),
            asString(params.destination, ""),
          );
          break;
        case "project_view":
          trackProjectView(
            asString(params.project_name, "unknown"),
            asString(params.section, "unknown"),
            asString(params.source, "iframe"),
          );
          break;
        case "external_link_click":
          trackExternalLink(
            asString(params.link_name, "unknown"),
            asString(params.url, ""),
            asString(params.location, "unknown"),
          );
          break;
        case "engaged_scroll":
          trackScrollDepth(
            asNumber(params.percent_scrolled, 0),
            asString(params.page_name, "home"),
          );
          break;
      }
    };

    window.addEventListener("message", onMessage);
    return () => {
      cleanupScroll();
      window.removeEventListener("message", onMessage);
    };
  }, []);

  return null;
}
