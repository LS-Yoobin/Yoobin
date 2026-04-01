import { readFileSync } from "node:fs";
import path from "node:path";

export default function HomePage() {
  const legacyHeroPath = path.join(
    process.cwd(),
    ".superpowers",
    "brainstorm",
    "851-1774956399",
    "hero-h-space.html",
  );

  let legacyHeroHtml = "";
  try {
    legacyHeroHtml = readFileSync(legacyHeroPath, "utf8");
  } catch {
    legacyHeroHtml =
      "<!doctype html><html><body style='margin:0;background:#000;color:#8fffd1;font-family:monospace;display:grid;place-items:center;height:100vh;'>Legacy hero file not found.</body></html>";
  }

  const analyticsBridgeScript = `
<script>
  (function () {
    if (window.__ga4BridgeInstalled) return;
    window.__ga4BridgeInstalled = true;

    var firedScroll = {};
    var firedProjectViews = {};

    function postEvent(eventName, params) {
      try {
        window.parent.postMessage(
          { type: "ga4_event", eventName: eventName, params: params || {} },
          "*"
        );
      } catch (error) {
        void error;
      }
    }

    function safeText(element, fallback) {
      if (!element) return fallback;
      var text = (element.textContent || "").trim();
      return text || fallback;
    }

    function sectionName(element) {
      if (!element || !element.closest) return "legacy_iframe";
      var section = element.closest("section");
      if (section && section.id) return section.id;
      return "legacy_iframe";
    }

    function isExternalHref(href) {
      return href.indexOf("http://") === 0 || href.indexOf("https://") === 0 || href.indexOf("mailto:") === 0;
    }

    function friendlyLinkName(href, fallbackText) {
      var lowerHref = href.toLowerCase();
      if (lowerHref.indexOf("linkedin.com") !== -1) return "LinkedIn";
      if (lowerHref.indexOf("instagram.com") !== -1) return "Instagram";
      if (lowerHref.indexOf("github.com") !== -1) return "GitHub";
      if (lowerHref.indexOf("testflight.apple.com") !== -1) return "TestFlight";
      if (lowerHref.indexOf("apps.apple.com") !== -1 || lowerHref.indexOf("appstore") !== -1) return "App Store";
      if (lowerHref.indexOf("mailto:") === 0) return "Email";
      return fallbackText || "external_link";
    }

    function bindCtaClick(element, ctaName, location, destination) {
      if (!element || element.__ga4CtaBound) return;
      element.__ga4CtaBound = true;
      element.addEventListener("click", function () {
        postEvent("cta_click", {
          cta_name: ctaName,
          location: location,
          destination: destination
        });
      });
    }

    function trackCtaClicks() {
      var ctaTargets = [
        { selector: ".hero-beta-link", name: "BLOGGO BETA LINK", location: "hero", destination: "https://testflight.apple.com/join/RMzfPzCf" },
        { selector: ".scroll-hint", name: "CLICK TO EXPLORE", location: "hero", destination: "#section-intro" },
        { selector: ".bloggo-link.primary", name: "TRY BETA TODAY", location: "bloggo", destination: "https://testflight.apple.com/join/RMzfPzCf" },
        { selector: ".bloggo-link.secondary", name: "VISIT WEBSITE", location: "bloggo", destination: "https://bloggo.linkedspaces.com/" },
        { selector: "#nav-resume", name: "RESUME LINK", location: "top_nav", destination: "#section-experience" },
        { selector: "#nav-work", name: "VIEW CASE STUDY", location: "top_nav", destination: "#section-work" }
      ];

      ctaTargets.forEach(function (cta) {
        bindCtaClick(document.querySelector(cta.selector), cta.name, cta.location, cta.destination);
      });

      var workCards = document.querySelectorAll(".work-card");
      workCards.forEach(function (card) {
        var projectName = safeText(card.querySelector(".wc-title"), "project_card");
        bindCtaClick(card, "VIEW CASE STUDY", "work_grid", projectName);
      });

      var contactForm = document.querySelector(".contact-form");
      if (contactForm) {
        contactForm.addEventListener("submit", function () {
          postEvent("cta_click", {
            cta_name: "CONTACT form",
            location: "contact",
            destination: "mailto:bloggo@linkedspaces.com"
          });
        });
      }

      document.addEventListener("click", function (event) {
        var target = event.target && event.target.closest ? event.target.closest("a,button,[role='button']") : null;
        if (!target) return;

        var rawText = safeText(target, "").toLowerCase();
        var href = target.getAttribute && target.getAttribute("href") ? target.getAttribute("href") : "";
        if (isExternalHref(href)) return;

        var ctaName = "";
        if (rawText.indexOf("join beta") !== -1) ctaName = "JOIN BETA";
        else if (rawText.indexOf("download") !== -1) ctaName = "DOWNLOAD";
        else if (rawText.indexOf("case study") !== -1) ctaName = "VIEW CASE STUDY";
        else if (rawText.indexOf("contact") !== -1) ctaName = "CONTACT";
        else if (rawText.indexOf("resume") !== -1) ctaName = "RESUME LINK";

        if (!ctaName) return;

        postEvent("cta_click", {
          cta_name: ctaName,
          location: sectionName(target),
          destination: href || target.id || "internal_navigation"
        });
      });
    }

    function trackExternalLinks() {
      var links = document.querySelectorAll("a[href]");
      links.forEach(function (link) {
        var href = link.getAttribute("href") || "";
        if (!isExternalHref(href)) return;

        link.addEventListener("click", function () {
          var name = friendlyLinkName(href, safeText(link, "external_link"));
          postEvent("external_link_click", {
            link_name: name,
            url: href,
            location: sectionName(link)
          });
        });
      });
    }

    function trackProjectViews() {
      var cards = document.querySelectorAll(".ej-card");
      if (!cards.length || !("IntersectionObserver" in window)) return;

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.6) return;
          var key = entry.target.getAttribute("data-ej-theme") || safeText(entry.target.querySelector(".ej-role"), "project");
          if (firedProjectViews[key]) return;
          firedProjectViews[key] = true;
          postEvent("project_view", {
            project_name: safeText(entry.target.querySelector(".ej-role"), key),
            section: "experience_timeline",
            source: "legacy_iframe"
          });
        });
      }, { threshold: [0.6] });

      cards.forEach(function (card) {
        observer.observe(card);
      });

      var workCards = document.querySelectorAll(".work-card");
      workCards.forEach(function (card) {
        card.addEventListener("click", function () {
          postEvent("project_view", {
            project_name: safeText(card.querySelector(".wc-title"), "work_project"),
            section: "work_grid",
            source: "legacy_iframe_click"
          });
        });
      });
    }

    function trackScrollDepth() {
      var thresholds = [25, 50, 75, 90];
      function onScroll() {
        var root = document.documentElement;
        var maxScroll = root.scrollHeight - window.innerHeight;
        if (maxScroll <= 0) return;
        var percent = Math.round((window.scrollY / maxScroll) * 100);
        thresholds.forEach(function (threshold) {
          if (percent >= threshold && !firedScroll[threshold]) {
            firedScroll[threshold] = true;
            postEvent("engaged_scroll", {
              percent_scrolled: threshold,
              page_name: "home"
            });
          }
        });
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    trackCtaClicks();
    trackExternalLinks();
    trackProjectViews();
    trackScrollDepth();
  })();
</script>`;

  const trackedLegacyHeroHtml = legacyHeroHtml.includes("</body>")
    ? legacyHeroHtml.replace("</body>", analyticsBridgeScript + "</body>")
    : legacyHeroHtml + analyticsBridgeScript;

  return (
    <main className="h-screen w-screen overflow-hidden bg-black">
      <iframe
        title="Legacy Hero Experience"
        srcDoc={trackedLegacyHeroHtml}
        allow="autoplay"
        className="h-full w-full border-0"
      />
    </main>
  );
}
