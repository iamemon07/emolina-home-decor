/**
 * Uploads public/brand/logo.png to Cloudinary and sets it as the store logo,
 * so it displays in emails (which can't load images from localhost).
 *
 *   npm run upload:logo
 */
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";
import { Settings } from "../src/models/Settings";

function cloudinary() {
  const url = process.env.CLOUDINARY_URL;
  let cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  let apiKey = process.env.CLOUDINARY_API_KEY;
  let apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (url) {
    const u = new URL(url);
    cloudName ||= u.hostname;
    apiKey ||= decodeURIComponent(u.username);
    apiSecret ||= decodeURIComponent(u.password);
  }
  if (!cloudName || !apiKey || !apiSecret || apiKey.startsWith("<")) throw new Error("Cloudinary is not configured in .env.local");
  return { cloudName, apiKey, apiSecret };
}

async function main() {
  const { cloudName, apiKey, apiSecret } = cloudinary();
  const file = await readFile(path.join(process.cwd(), "public", "brand", "logo.png"));

  const timestamp = Math.floor(Date.now() / 1000);
  const params = { overwrite: "true", public_id: "emoline/brand/logo", timestamp: String(timestamp) };
  const toSign = Object.entries(params).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${v}`).join("&");
  const signature = createHash("sha1").update(toSign + apiSecret).digest("hex");

  const body = new FormData();
  body.append("file", new Blob([file], { type: "image/png" }), "logo.png");
  body.append("api_key", apiKey);
  body.append("signature", signature);
  for (const [k, v] of Object.entries(params)) body.append(k, v);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body });
  const json = (await res.json()) as { secure_url?: string; error?: { message: string } };
  if (!json.secure_url) throw new Error(json.error?.message || "Upload failed");
  const logoUrl = json.secure_url.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
  console.log("✓ Uploaded:", logoUrl);

  await mongoose.connect(process.env.MONGODB_URI!);
  await Settings.updateOne({ key: "site" }, { $set: { logo: logoUrl } });
  console.log("✓ Store logo updated in settings");
  await mongoose.disconnect();
}

main().catch(async (e) => {
  console.error("✗", e.message);
  await mongoose.disconnect();
  process.exit(1);
});
