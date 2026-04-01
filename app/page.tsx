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

  return (
    <main className="h-screen w-screen overflow-hidden bg-black">
      <iframe
        title="Legacy Hero Experience"
        srcDoc={legacyHeroHtml}
        className="h-full w-full border-0"
      />
    </main>
  );
}
