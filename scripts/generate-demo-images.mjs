// Renders illustrated placeholder photos for the demo catalogue into public/demo/.
// They exist only so the store looks complete before you upload real product photos.
// Usage: node scripts/generate-demo-images.mjs
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const OLIVE = "#2e3b32";
const SAGE = "#7d8b6a";
const CLAY = "#c08a5e";
const TERRA = "#a8693f";
const SAND = "#ddd3c0";
const LINEN = "#f7f4ee";
const WALNUT = "#6b4f3a";

// Three backdrop/accent palettes so products in the same category don't look identical.
const VARIANTS = [
  { wall: "#efe9de", floor: "#ddd3c0", a: CLAY, b: OLIVE },
  { wall: "#e6e8dd", floor: "#cfd3c0", a: SAGE, b: WALNUT },
  { wall: "#f3e7dc", floor: "#e4cdb8", a: TERRA, b: "#3c4a40" },
];

const scenes = {
  "vases-planters": ({ a, b }) => `
    <path d="M250 1000 V520 a150 150 0 0 1 300 0 V1000z" fill="#ffffff" opacity=".35"/>
    <path d="M400 900 c-110 -30 -130 -190 -70 -280 c25 -40 30 -70 20 -110 h100 c-10 40 -5 70 20 110 c60 90 40 250 -70 280z" fill="${a}"/>
    <path d="M400 510 c-10 -120 -70 -190 -150 -230 M400 510 c15 -140 80 -210 170 -250 M400 510 c0 -140 -10 -230 -25 -300" fill="none" stroke="${b}" stroke-width="7" stroke-linecap="round"/>
    <ellipse cx="250" cy="280" rx="34" ry="14" transform="rotate(-35 250 280)" fill="${b}"/>
    <ellipse cx="570" cy="260" rx="34" ry="14" transform="rotate(30 570 260)" fill="${b}"/>
    <ellipse cx="375" cy="210" rx="14" ry="34" fill="${b}"/>
    <path d="M590 900 c-40 0 -55 -60 -40 -100 h80 c15 40 0 100 -40 100z" fill="${b}" opacity=".85"/>`,
  "wall-decor": ({ a, b }) => `
    <rect x="170" y="220" width="250" height="330" fill="${LINEN}" stroke="${WALNUT}" stroke-width="16"/>
    <circle cx="295" cy="350" r="70" fill="${a}"/><rect x="215" y="420" width="160" height="90" fill="${b}" opacity=".8"/>
    <rect x="460" y="280" width="180" height="230" fill="${LINEN}" stroke="${WALNUT}" stroke-width="14"/>
    <path d="M480 490 q70 -160 140 0z" fill="${b}"/>
    <rect x="460" y="550" width="180" height="140" fill="${LINEN}" stroke="${WALNUT}" stroke-width="14"/>
    <path d="M480 670 l50 -80 l40 50 l25 -30 l25 60z" fill="${a}"/>
    <rect x="120" y="860" width="560" height="26" rx="6" fill="${WALNUT}"/>`,
  lighting: ({ a, b }) => `
    <circle cx="400" cy="330" r="230" fill="#ffffff" opacity=".45"/>
    <path d="M280 250 h240 l60 190 h-360z" fill="${a}"/>
    <rect x="390" y="440" width="20" height="200" fill="${b}"/>
    <path d="M330 640 h140 c20 0 30 20 30 40 v150 c0 25 -20 40 -45 40 h-110 c-25 0 -45 -15 -45 -40 v-150 c0 -20 10 -40 30 -40z" fill="${b}"/>
    <rect x="160" y="870" width="480" height="24" rx="6" fill="${WALNUT}"/>`,
  "cushions-throws": ({ a, b }) => `
    <rect x="90" y="560" width="620" height="230" rx="40" fill="${b}"/>
    <rect x="60" y="500" width="110" height="320" rx="40" fill="${b}"/>
    <rect x="630" y="500" width="110" height="320" rx="40" fill="${b}"/>
    <rect x="170" y="420" width="200" height="190" rx="30" transform="rotate(-6 270 515)" fill="${a}"/>
    <rect x="390" y="430" width="200" height="180" rx="30" transform="rotate(5 490 520)" fill="${LINEN}"/>
    <path d="M420 470 l140 120 M560 470 l-140 120" stroke="${a}" stroke-width="8"/>
    <rect x="130" y="820" width="30" height="80" fill="${WALNUT}"/><rect x="640" y="820" width="30" height="80" fill="${WALNUT}"/>`,
  tableware: ({ a, b }) => `
    <rect x="80" y="700" width="640" height="300" fill="${WALNUT}" opacity=".85"/>
    <ellipse cx="330" cy="690" rx="200" ry="50" fill="${LINEN}"/><ellipse cx="330" cy="670" rx="200" ry="50" fill="${a}"/>
    <ellipse cx="330" cy="650" rx="200" ry="50" fill="${LINEN}"/><ellipse cx="330" cy="650" rx="120" ry="28" fill="${SAND}"/>
    <path d="M510 520 h150 v120 c0 40 -30 60 -75 60 s-75 -20 -75 -60z" fill="${b}"/>
    <path d="M660 550 c50 0 50 70 0 70" fill="none" stroke="${b}" stroke-width="16"/>
    <path d="M560 480 q15 -30 0 -60 M600 480 q15 -30 0 -60" fill="none" stroke="${b}" stroke-width="6" opacity=".5" stroke-linecap="round"/>`,
  "candles-fragrance": ({ a, b }) => `
    <circle cx="400" cy="420" r="260" fill="#ffffff" opacity=".4"/>
    <rect x="290" y="480" width="220" height="300" rx="24" fill="${a}"/>
    <rect x="290" y="580" width="220" height="110" fill="${LINEN}"/>
    <text x="400" y="648" text-anchor="middle" font-family="Georgia, serif" font-size="34" letter-spacing="6" fill="${b}">EMOLINE</text>
    <rect x="396" y="420" width="8" height="60" fill="${b}"/>
    <path d="M400 330 c40 50 25 95 0 95 s-40 -45 0 -95z" fill="#e8a64a"/>
    <rect x="560" y="660" width="90" height="120" rx="14" fill="${b}"/><rect x="598" y="620" width="14" height="40" fill="${b}"/>
    <rect x="120" y="780" width="560" height="24" rx="6" fill="${WALNUT}"/>`,
  mirrors: ({ a, b }) => `
    <path d="M230 900 V400 a170 170 0 0 1 340 0 V900z" fill="${a}"/>
    <path d="M260 880 V405 a140 140 0 0 1 280 0 V880z" fill="#dfe5e4"/>
    <path d="M300 860 L520 480 V560 L340 860z" fill="#ffffff" opacity=".55"/>
    <rect x="160" y="900" width="480" height="24" rx="6" fill="${b}"/>`,
  "decor-accents": ({ a, b }) => `
    <rect x="150" y="700" width="300" height="50" fill="${b}"/><rect x="170" y="650" width="270" height="50" fill="${a}"/>
    <rect x="160" y="600" width="250" height="50" fill="${SAND}" stroke="${b}" stroke-width="4"/>
    <circle cx="290" cy="530" r="70" fill="none" stroke="${b}" stroke-width="20"/>
    <path d="M500 750 c0 -80 40 -100 80 -100 s80 20 80 100z" fill="${a}"/>
    <ellipse cx="580" cy="620" rx="40" ry="50" fill="${b}"/>
    <rect x="100" y="750" width="600" height="24" rx="6" fill="${WALNUT}"/>`,
};

await mkdir("public/demo", { recursive: true });
for (const [slug, draw] of Object.entries(scenes)) {
  for (const [i, v] of VARIANTS.entries()) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
      <rect width="800" height="1000" fill="${v.wall}"/>
      <rect y="880" width="800" height="120" fill="${v.floor}"/>
      ${draw(v)}
    </svg>`;
    await sharp(Buffer.from(svg)).jpeg({ quality: 82, mozjpeg: true }).toFile(`public/demo/${slug}-${i + 1}.jpg`);
  }
  console.log(`✓ ${slug}`);
}
