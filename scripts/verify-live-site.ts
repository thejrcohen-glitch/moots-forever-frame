import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const pages = [
  "https://mootsframe.com",
  "https://mootsframe.com/build",
  "https://mootsframe.com/comparison",
  "https://mootsframe.com/community",
  "https://mootsframe.com/races",
];

const approvedBikeImages = new Set([
  "https://moots.com/cdn/shop/files/RouttRSLStanley01.jpg",
  "https://cdn.shopify.com/s/files/1/0049/1612/files/Screenshot2025-10-16at3.32.05PM.png?v=1760650375",
  "https://cdn.shopify.com/s/files/1/0049/1612/files/YBB_UDH.jpg?v=1762966604",
  "https://moots.com/cdn/shop/files/VaMootsRCSAPEX01.jpg",
]);

const requiredTerms = [
  "Texas",
  "Arkansas",
  "Oklahoma",
  "Houston",
  "Dallas",
  "Fort Worth",
  "Austin",
  "San Antonio",
  "Tulsa",
  "Little Rock",
  "Bentonville",
  "Whistler",
];

const suspiciousImageTerms = [
  "cloudfront",
  "hero-main",
  "placeholder",
  "generated",
  "ai",
];

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function normalizeSrc(src: string): string {
  try {
    const url = new URL(src);
    return url.href;
  } catch {
    return src;
  }
}

async function main() {
  const screenshotDir = "verification-screenshots";
  const reportDir = "verification";
  ensureDir(screenshotDir);
  ensureDir(reportDir);

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

  const rows: string[] = [];
  const failures: string[] = [];

  rows.push("# MootsFrame Live Site Verification Report\n");
  rows.push(`Generated: ${new Date().toISOString()}\n`);

  for (const url of pages) {
    rows.push(`\n## ${url}\n`);

    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });

      const title = await page.title();
      const text = await page.locator("body").innerText();
      const imgs = await page.locator("img").evaluateAll((nodes) =>
        nodes.map((img) => ({
          src: (img as HTMLImageElement).src,
          alt: (img as HTMLImageElement).alt,
        }))
      );

      const slug = url.replace("https://mootsframe.com", "home").replace(/[^\w]+/g, "-");
      const screenshotPath = path.join(screenshotDir, `${slug}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });

      rows.push(`Title: ${title}\n`);
      rows.push(`Screenshot: ${screenshotPath}\n`);

      rows.push("\n### Images Found\n");
      if (imgs.length === 0) {
        rows.push("No images found.\n");
      }

      for (const img of imgs) {
        const src = normalizeSrc(img.src);
        const approved = approvedBikeImages.has(src);
        const suspicious = suspiciousImageTerms.some((term) =>
          src.toLowerCase().includes(term)
        );

        rows.push(`- src: ${src}\n`);
        rows.push(`  - alt: ${img.alt || "N/A"}\n`);
        rows.push(`  - approved bike image: ${approved ? "YES" : "NO"}\n`);
        rows.push(`  - suspicious source: ${suspicious ? "YES" : "NO"}\n`);

        if (suspicious && !approved) {
          failures.push(`Suspicious unapproved image on ${url}: ${src}`);
        }
      }

      rows.push("\n### Territory / Content Terms\n");
      for (const term of requiredTerms) {
        const present = text.includes(term);
        rows.push(`- ${term}: ${present ? "YES" : "NO"}\n`);

        if (!present) {
          failures.push(`Missing required content term on ${url}: ${term}`);
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(`Failed to verify ${url}: ${message}`);
      rows.push(`ERROR: ${message}\n`);
    }
  }

  rows.push("\n## Summary\n");
  if (failures.length === 0) {
    rows.push("PASS: No suspicious unapproved bike images found and all required terms were present.\n");
  } else {
    rows.push("FAILURES:\n");
    for (const failure of failures) rows.push(`- ${failure}\n`);
  }

  const reportPath = path.join(reportDir, "live-site-report.md");
  fs.writeFileSync(reportPath, rows.join(""), "utf8");

  await browser.close();

  console.log(`Live site report written to ${reportPath}`);

  if (failures.length > 0) {
    console.error(failures.join("\n"));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
