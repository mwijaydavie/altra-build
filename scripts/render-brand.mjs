/**
 * Raster brand kit: SVG -> PNG via libvips (sharp), plus favicons, PWA icons
 * and the social card. Run after scripts/build-brand-assets.py.
 *
 *   npm run brand
 */
import { readFile, writeFile } from "node:fs/promises";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const BRAND = path.join(ROOT, "public", "brand");
const APP = path.join(ROOT, "app");

mkdirSync(BRAND, { recursive: true });
mkdirSync(APP, { recursive: true });

const INK = "#0F1117";
const GOLD = "#F7BC32";
const CREAM = "#FFF3E7";

const svg = (name) => readFile(path.join(BRAND, name));

async function renderSvg(name, out, width) {
  const file = path.join(BRAND, name);
  if (!existsSync(file)) throw new Error(`Missing ${file} — run the python tracer first.`);
  const data = await sharp(await readFile(file), { density: 1400 })
    .resize({ width, fit: "inside" })
    .png()
    .toBuffer();
  await sharp(data).toFile(out);
  console.log(`saved ${path.relative(ROOT, out)}`);
  return data;
}

/* ------------------------------------------------------------------ */
/* 1. Vector-derived raster marks                                      */
/* ------------------------------------------------------------------ */
const mark1024 = await renderSvg("altra-mark.svg", path.join(BRAND, "altra-mark.png"), 1024);
await renderSvg("altra-logo.svg", path.join(BRAND, "altra-logo.png"), 1600);
const markInverse = await renderSvg(
  "altra-mark-inverse.svg",
  path.join(BRAND, "altra-mark-inverse.png"),
  512,
);

const markMeta = await sharp(mark1024).metadata();
const markHeight = Math.round((1024 * markMeta.height) / markMeta.width);

/* ------------------------------------------------------------------ */
/* 2. App icons (cream tile, rounded, safe-area emblem)                */
/* ------------------------------------------------------------------ */
async function tileIcon(size, background, emblem, inset = 0.86) {
  const emblemWidth = Math.round(size * inset);
  const resized = await sharp(emblem).resize({ width: emblemWidth }).png().toBuffer();
  const meta = await sharp(resized).metadata();
  const rounded = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${Math.round(
      size * 0.22,
    )}" fill="${background}"/></svg>`,
  );
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${Math.round(
      size * 0.22,
    )}" fill="#fff"/></svg>`,
  );

  return sharp(rounded)
    .composite([
      {
        input: resized,
        top: Math.round((size - (meta.height ?? size)) / 2),
        left: Math.round((size - (meta.width ?? size)) / 2),
      },
      { input: mask, blend: "dest-in" },
    ])
    .png()
    .toBuffer();
}

await writeFile(path.join(APP, "icon.png"), await tileIcon(512, CREAM, mark1024));
await writeFile(path.join(APP, "apple-icon.png"), await tileIcon(180, CREAM, mark1024, 0.8));
console.log("saved app/icon.png, app/apple-icon.png");

await writeFile(path.join(BRAND, "icon-192.png"), await tileIcon(192, INK, markInverse, 0.68));
await writeFile(path.join(BRAND, "icon-512.png"), await tileIcon(512, INK, markInverse, 0.68));
console.log("saved PWA icons (192, 512)");

/* ------------------------------------------------------------------ */
/* 3. Print / email lockup on cream with clear space                   */
/* ------------------------------------------------------------------ */
const lockup = await sharp(await readFile(path.join(BRAND, "altra-logo.svg")), { density: 1400 })
  .resize({ width: 1400 })
  .png()
  .toBuffer();
const lockMeta = await sharp(lockup).metadata();
await sharp({ create: { width: 2000, height: 760, channels: 4, background: CREAM } })
  .composite([
    {
      input: lockup,
      top: Math.round((760 - (lockMeta.height ?? 400)) / 2),
      left: Math.round((2000 - 1400) / 2),
    },
  ])
  .jpeg({ quality: 92 })
  .toFile(path.join(BRAND, "altra-lockup.jpg"));
console.log("saved public/brand/altra-lockup.jpg");

/* ------------------------------------------------------------------ */
/* 4. Social card — photo right, obsidian brand panel left            */
/* ------------------------------------------------------------------ */
const W = 1200;
const H = 630;
const photo = await sharp(path.join(ROOT, "public", "images", "hero-construction.jpg"))
  .resize({ width: 760, height: H, fit: "cover", position: "right" })
  .modulate({ brightness: 0.82, saturation: 0.95 })
  .toBuffer();

const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${INK}" stop-opacity="1"/>
      <stop offset="0.45" stop-color="${INK}" stop-opacity="0.85"/>
      <stop offset="1" stop-color="${INK}" stop-opacity="0.15"/>
    </linearGradient>
    <linearGradient id="bottom" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.55" stop-color="${INK}" stop-opacity="0"/>
      <stop offset="1" stop-color="${INK}" stop-opacity="0.85"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#fade)"/>
  <rect width="${W}" height="${H}" fill="url(#bottom)"/>
  <rect x="80" y="196" width="86" height="5" fill="${GOLD}"/>
  <rect x="80" y="540" width="86" height="5" fill="${GOLD}"/>
  <g fill="${GOLD}">
    <rect x="80" y="556" width="5" height="5"/>
    <rect x="94" y="556" width="5" height="5" opacity="0.55"/>
    <rect x="108" y="556" width="5" height="5" opacity="0.25"/>
  </g>
</svg>`);

const logoInverse = await sharp(await readFile(path.join(BRAND, "altra-logo-inverse.svg")), {
  density: 1400,
})
  .resize({ width: 420 })
  .png()
  .toBuffer();
const logoMeta = await sharp(logoInverse).metadata();

const og = await sharp({ create: { width: W, height: H, channels: 3, background: INK } })
  .composite([
    { input: photo, top: 0, left: 440 },
    { input: overlay, top: 0, left: 0 },
    {
      input: logoInverse,
      top: 300,
      left: 80,
    },
  ])
  .png()
  .toBuffer();

await sharp(og).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(BRAND, "og-image.png"));
console.log(`saved public/brand/og-image.png (logo ${logoMeta.width}x${logoMeta.height})`);

/* ------------------------------------------------------------------ */
/* 5. Discoverability manifest for the brand folder                    */
/* ------------------------------------------------------------------ */
const palette = JSON.parse(await readFile(path.join(BRAND, "palette.json"), "utf8"));
const geometry = JSON.parse(await readFile(path.join(BRAND, "geometry.json"), "utf8"));
await writeFile(
  path.join(BRAND, "manifest.json"),
  JSON.stringify(
    {
      brand: "Altra Build",
      palette,
      geometry,
      assets: {
        lockup: "/brand/altra-logo.svg",
        lockupInverse: "/brand/altra-logo-inverse.svg",
        emblem: "/brand/altra-mark.svg",
        emblemInverse: "/brand/altra-mark-inverse.svg",
        wordmark: "/brand/altra-wordmark.svg",
        mono: "/brand/altra-logo-mono-ink.svg",
        print: "/brand/altra-lockup.jpg",
        social: "/brand/og-image.png",
      },
    },
    null,
    2,
  ) + "\n",
);
console.log("saved public/brand/manifest.json");
