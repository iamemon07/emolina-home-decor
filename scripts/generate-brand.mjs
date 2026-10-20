// Renders the placeholder brand assets (public/brand/logo.png, banner.png) from inline SVG.
// Replace them with your designer's files any time — or upload a new logo in Admin → Site Settings.
// Usage: npm run brand:assets
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const OLIVE = "#2e3b32";
const CLAY = "#c08a5e";
const LINEN = "#f7f4ee";
const SAND = "#ddd3c0";
const SERIF = "Georgia, 'Times New Roman', serif";

const logo = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <circle cx="512" cy="512" r="512" fill="${OLIVE}"/>
  <circle cx="512" cy="512" r="468" fill="none" stroke="${CLAY}" stroke-width="6"/>
  <!-- arched doorway -->
  <path d="M332 790 V470 a180 180 0 0 1 360 0 V790" fill="none" stroke="${LINEN}" stroke-width="22" stroke-linecap="round"/>
  <line x1="292" y1="790" x2="732" y2="790" stroke="${LINEN}" stroke-width="22" stroke-linecap="round"/>
  <text x="512" y="700" text-anchor="middle" font-family="${SERIF}" font-size="330" fill="${LINEN}">E</text>
  <!-- leaf sprig -->
  <path d="M512 228 q38 -40 0 -92 q-38 52 0 92z" fill="${CLAY}"/>
</svg>`;

const banner = `
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <rect width="1920" height="1080" fill="${LINEN}"/>
  <path d="M1120 1080 V560 a300 300 0 0 1 600 0 V1080z" fill="${SAND}"/>
  <path d="M1220 1080 V600 a200 200 0 0 1 400 0 V1080z" fill="#ebe4d6"/>
  <!-- vase -->
  <path d="M1380 1080 c-90 -40 -110 -170 -60 -250 c25 -40 30 -70 20 -110 h120 c-10 40 -5 70 20 110 c50 80 30 210 -60 250z" fill="${CLAY}"/>
  <path d="M1420 720 c-10 -120 -80 -200 -170 -240 M1420 720 c20 -140 90 -230 190 -270 M1420 720 c0 -150 -10 -250 -30 -330"
        fill="none" stroke="${OLIVE}" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="1250" cy="480" rx="38" ry="16" transform="rotate(-35 1250 480)" fill="${OLIVE}"/>
  <ellipse cx="1610" cy="450" rx="38" ry="16" transform="rotate(30 1610 450)" fill="${OLIVE}"/>
  <ellipse cx="1390" cy="390" rx="16" ry="38" fill="${OLIVE}"/>
  <text x="200" y="470" font-family="${SERIF}" font-size="150" letter-spacing="30" fill="${OLIVE}">EMOLINE</text>
  <text x="208" y="545" font-family="${SERIF}" font-size="34" letter-spacing="22" fill="${CLAY}">HOME DECOR</text>
  <text x="204" y="660" font-family="${SERIF}" font-style="italic" font-size="52" fill="#4a5a4e">Where every corner feels like home</text>
</svg>`;

await mkdir("public/brand", { recursive: true });
await sharp(Buffer.from(logo)).resize(512, 512).png().toFile("public/brand/logo.png");
await sharp(Buffer.from(banner)).png({ compressionLevel: 9 }).toFile("public/brand/banner.png");
console.log("✓ public/brand/logo.png and public/brand/banner.png generated");
