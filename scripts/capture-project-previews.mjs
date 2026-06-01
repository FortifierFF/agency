/**
 * One-off: capture homepage screenshots + favicon/logo for portfolio collages.
 * Run: node scripts/capture-project-previews.mjs
 * Requires: npx playwright install chromium (first time)
 */
import { chromium } from "playwright";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "public", "projects");

const ALL_SITES = [
  { slug: "medboard", url: "https://medboard.bg/", scrollY: 0, locale: "bg-BG" },
  { slug: "pal-recruitment", url: "https://palrecruitment.com/", scrollY: 400, locale: "bg-BG" },
  { slug: "pal-credit-consult", url: "https://palcreditconsult.com/", scrollY: 600 },
  { slug: "pitchfork-games", url: "https://pitchforkgames.com/", scrollY: 500 },
];

const VIEWPORT = { width: 1440, height: 900 };
const COLLAGE_W = 1600;
const COLLAGE_H = 1200;
const WEBP_QUALITY_COLLAGE = 92;
const WEBP_QUALITY_POSTER = 92;

/** Prefer accept/decline labels seen on BG + EN cookie banners (OneTrust, Cookiebot, custom). */
const COOKIE_CLICK_IDS = [
  "onetrust-accept-btn-handler",
  "onetrust-reject-all-handler",
  "CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll",
  "CybotCookiebotDialogBodyButtonDecline",
  "cookiescript_accept",
  "cookiescript_reject",
];

const COOKIE_LABEL_PATTERNS = [
  /приеми\s*всички/i,
  /приемане\s*на\s*всички/i,
  /отхвърляне\s*на\s*всички/i,
  /приемам\s*всички/i,
  /приемам/i,
  /accept\s*all/i,
  /^accept$/i,
  /allow\s*all/i,
  /agree/i,
  /съгласен/i,
  /разреш/i,
  /^ok$/i,
  /отхвърлям\s*всички/i,
  /отхвърлям/i,
  /само\s*необходим/i,
  /reject\s*all/i,
  /^reject$/i,
  /decline/i,
  /only\s*necessary/i,
  /необходимите\s*бисквитки/i,
];

const COOKIE_OVERLAY_SELECTORS = [
  "#cookie-information-template-wrapper",
  ".coi-banner__wrapper",
  "#onetrust-banner-sdk",
  "#onetrust-consent-sdk",
  "#CybotCookiebotDialog",
  "#cookiescript_injected",
  '[id*="cookie" i]',
  '[class*="cookie-banner" i]',
  '[class*="cookieconsent" i]',
  '[aria-label*="cookie" i]',
];

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function downloadBuffer(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "PAL-Web-Studio-Preview-Bot/1.0" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

/**
 * Dismiss cookie/GDPR overlays before screenshots (accept or reject — both close the modal).
 */
async function dismissCookieConsent(page, site) {
  await page.waitForTimeout(1200);

  /** Site-specific banners (Cookie Information on medboard, custom on palrecruitment). */
  if (site.slug === "medboard") {
    try {
      await page.locator("#declineButton, .coi-banner__decline").first().click({ timeout: 4000 });
      console.log("  cookies: medboard decline");
      await page.waitForTimeout(600);
    } catch {
      try {
        await page.locator(".coi-banner__accept").first().click({ timeout: 3000 });
        console.log("  cookies: medboard accept");
        await page.waitForTimeout(600);
      } catch {
        /* fall through */
      }
    }
  }

  if (site.slug === "pal-recruitment") {
    try {
      await page.getByRole("button", { name: /приеми\s*всички/i }).click({ timeout: 4000 });
      console.log("  cookies: pal-recruitment accept");
      await page.waitForTimeout(600);
    } catch {
      try {
        await page.getByRole("button", { name: /приемам\s*всички/i }).click({ timeout: 3000 });
        console.log("  cookies: pal-recruitment accept (alt)");
        await page.waitForTimeout(600);
      } catch {
        /* fall through */
      }
    }
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    const clicked = await page.evaluate(
      ({ ids, patterns }) => {
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el && el.offsetParent !== null) {
            el.click();
            return `id:${id}`;
          }
        }

        const clickables = [
          ...document.querySelectorAll(
            "button, a, [role='button'], input[type='button'], input[type='submit']"
          ),
        ].filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 2 && r.height > 2 && el.offsetParent !== null;
        });

        for (const source of patterns) {
          const pattern = new RegExp(source, "i");
          const match = clickables.find((el) => {
            const text = (el.textContent || el.value || el.getAttribute("aria-label") || "").trim();
            return pattern.test(text) && text.length < 80;
          });
          if (match) {
            match.click();
            return `label:${source}`;
          }
        }
        return null;
      },
      { ids: COOKIE_CLICK_IDS, patterns: COOKIE_LABEL_PATTERNS.map((p) => p.source) }
    );

    if (!clicked) break;
    console.log(`  cookies: dismissed (${clicked})`);
    await page.waitForTimeout(700);
  }

  // Playwright locators for site-specific wording (BG).
  const localeButtons = [
    page.getByRole("button", { name: /приемам/i }),
    page.getByRole("button", { name: /отхвърлям/i }),
    page.getByRole("button", { name: /accept/i }),
    page.getByRole("button", { name: /reject/i }),
    page.getByRole("button", { name: /decline/i }),
  ];
  for (const loc of localeButtons) {
    try {
      const btn = loc.first();
      if (await btn.isVisible({ timeout: 400 })) {
        await btn.click({ timeout: 2000 });
        console.log("  cookies: dismissed (role button)");
        await page.waitForTimeout(500);
        break;
      }
    } catch {
      /* not found */
    }
  }

  await page.evaluate((selectors) => {
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach((node) => {
        node.style.setProperty("display", "none", "important");
        node.style.setProperty("visibility", "hidden", "important");
        node.style.setProperty("pointer-events", "none", "important");
      });
    }
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
  }, COOKIE_OVERLAY_SELECTORS);

  await page.waitForTimeout(400);
}

async function pickLogo(page, slug, outDir) {
  const candidates = await page.evaluate(() => {
    const urls = [];
    const icon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
    if (icon?.href) urls.push(icon.href);
    const apple = document.querySelector('link[rel="apple-touch-icon"]');
    if (apple?.href) urls.push(apple.href);
    const og = document.querySelector('meta[property="og:image"]');
    if (og?.content) urls.push(og.content);
    const img = document.querySelector(
      'header img, .logo img, [class*="logo"] img, img[alt*="logo" i], img[alt*="Logo"]'
    );
    if (img?.src) urls.push(img.src);
    return [...new Set(urls)].slice(0, 5);
  });

  for (const raw of candidates) {
    try {
      const url = new URL(raw, page.url()).href;
      const buf = await downloadBuffer(url);
      const logoPath = path.join(outDir, "logo.png");
      await sharp(buf)
        .resize(280, 120, { fit: "inside", withoutEnlargement: true })
        .png()
        .toFile(logoPath);
      console.log(`  logo: ${url}`);
      return logoPath;
    } catch {
      /* try next */
    }
  }
  console.warn(`  logo: none found for ${slug}`);
  return null;
}

async function captureSite(browser, site) {
  const outDir = path.join(OUT, site.slug);
  await ensureDir(outDir);

  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    locale: site.locale ?? "en-US",
  });
  const page = await context.newPage();

  console.log(`\n→ ${site.url}`);
  try {
    await page.goto(site.url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await dismissCookieConsent(page, site);
    await page.waitForTimeout(800);

    await pickLogo(page, site.slug, outDir);

    await page.screenshot({
      path: path.join(outDir, "hero.png"),
      fullPage: false,
    });
    console.log("  hero.png");

    if (site.scrollY > 0) {
      await page.evaluate((y) => window.scrollTo(0, y), site.scrollY);
      await page.waitForTimeout(800);
      await page.screenshot({
        path: path.join(outDir, "detail.png"),
        fullPage: false,
      });
      console.log("  detail.png");
    } else {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.35));
      await page.waitForTimeout(800);
      await page.screenshot({
        path: path.join(outDir, "detail.png"),
        fullPage: false,
      });
      console.log("  detail.png (scrolled)");
    }

    await buildCollage(outDir);
  } catch (err) {
    console.error(`  FAILED: ${err.message}`);
  } finally {
    await context.close();
  }
}

/** Bento collage: logo + hero + detail into one WebP (optional; cards use poster for sharpness). */
async function buildCollage(outDir) {
  const heroPath = path.join(outDir, "hero.png");
  const detailPath = path.join(outDir, "detail.png");
  const logoPath = path.join(outDir, "logo.png");

  const hero = await sharp(heroPath)
    .resize(1080, 680, { fit: "cover", position: "top" })
    .toBuffer();
  const detailExists = await fs
    .access(detailPath)
    .then(() => true)
    .catch(() => false);
  const detail = detailExists
    ? await sharp(detailPath).resize(520, 360, { fit: "cover", position: "top" }).toBuffer()
    : hero;

  const base = sharp({
    create: {
      width: COLLAGE_W,
      height: COLLAGE_H,
      channels: 3,
      background: { r: 15, g: 23, b: 42 },
    },
  });

  const composites = [
    { input: hero, left: 48, top: 140 },
    { input: detail, left: 960, top: 440 },
  ];

  const logoExists = await fs
    .access(logoPath)
    .then(() => true)
    .catch(() => false);
  if (logoExists) {
    const logo = await sharp(logoPath)
      .resize(220, 88, { fit: "inside" })
      .png()
      .toBuffer();
    composites.unshift({ input: logo, left: 64, top: 44 });
  }

  await base
    .composite(composites)
    .webp({ quality: WEBP_QUALITY_COLLAGE })
    .toFile(path.join(outDir, "collage.webp"));

  await sharp(heroPath)
    .webp({ quality: WEBP_QUALITY_POSTER })
    .toFile(path.join(outDir, "hero.webp"));

  console.log(`  collage.webp + hero.webp (${WEBP_QUALITY_POSTER}% quality)`);
}

async function rebuildFromPng(slug) {
  const outDir = path.join(OUT, slug);
  await buildCollage(outDir);
}

async function bumpPreviewAssetVersion() {
  const stamp = Date.now();
  const file = path.join(ROOT, "src", "data", "projectPreviewAssetVersion.ts");
  await fs.writeFile(
    file,
    `/** Auto-updated by npm run capture:projects */\nexport const PROJECT_PREVIEW_ASSET_VERSION = ${stamp};\n`
  );
  console.log(`\nAsset cache version → ${stamp}`);
}

async function main() {
  const args = process.argv.slice(2);
  const rebuildOnly = args.includes("--rebuild");

  if (rebuildOnly) {
    const slugs = args.filter((a) => a !== "--rebuild");
    const list = slugs.length ? slugs : ALL_SITES.map((s) => s.slug);
    console.log("Re-exporting WebP from PNG…", list.join(", "));
    for (const slug of list) {
      await rebuildFromPng(slug);
    }
    await bumpPreviewAssetVersion();
    return;
  }

  const only = args;
  const sites =
    only.length > 0
      ? ALL_SITES.filter((s) => only.includes(s.slug))
      : ALL_SITES;

  if (sites.length === 0) {
    console.error("No matching slugs. Use: medboard pal-recruitment …");
    process.exit(1);
  }

  console.log("Capturing project previews…", sites.map((s) => s.slug).join(", "));
  const browser = await chromium.launch({ headless: true });
  for (const site of sites) {
    await captureSite(browser, site);
  }
  await browser.close();
  await bumpPreviewAssetVersion();
  console.log("\nDone. Assets in public/projects/{slug}/");
  console.log("Hard-refresh the site (Ctrl+Shift+R) if previews still look old.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
