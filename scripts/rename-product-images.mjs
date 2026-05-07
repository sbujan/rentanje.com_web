#!/usr/bin/env node
/**
 * Backfill product image filenames in Supabase Storage to slug-based names
 * for SEO. Safe to run repeatedly — files already prefixed with the product
 * slug are skipped.
 *
 * Strategy per file: COPY new name → UPDATE row → DELETE old. If anything
 * fails before the row update, the old file is untouched and the page keeps
 * working. The newly-copied file becomes a one-off orphan (cheap to clean up
 * later).
 *
 * Usage:
 *   node scripts/rename-product-images.mjs           # dry run, prints plan
 *   node scripts/rename-product-images.mjs --apply   # actually rename
 *   node scripts/rename-product-images.mjs --apply --limit 3   # first 3 products
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// --- Load .env.local manually (no dotenv dep) -----------------------------
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.local");
try {
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const [, k, v] = m;
    if (!process.env[k]) process.env[k] = v.replace(/^["']|["']$/g, "");
  }
} catch {
  console.error("Could not read .env.local at", envPath);
  process.exit(1);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SECRET_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local");
  process.exit(1);
}

const BUCKET = "product-images";
const PUBLIC_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;

// --- CLI args -------------------------------------------------------------
const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const limitIdx = args.indexOf("--limit");
const LIMIT = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : Infinity;

// --- Helpers --------------------------------------------------------------
function safeSegment(input) {
  return input
    .toLowerCase()
    .replace(/[šŠ]/g, "s")
    .replace(/[čČćĆ]/g, "c")
    .replace(/[žŽ]/g, "z")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function nonce() {
  return Math.random().toString(36).slice(2, 8);
}

/** Returns the storage path (e.g. "products/foo.jpg") if the URL is in our
 *  bucket, otherwise null (external image — leave alone). */
function pathFromUrl(url) {
  if (!url || !url.startsWith(PUBLIC_PREFIX)) return null;
  return url.slice(PUBLIC_PREFIX.length).split("?")[0];
}

function extOf(path) {
  const m = path.match(/\.([a-z0-9]+)$/i);
  return m ? m[1].toLowerCase() : "jpg";
}

/** Already-renamed files start with `${slug}-` — skip those. */
function alreadyRenamed(path, slug) {
  const filename = path.split("/").pop() ?? "";
  return filename.startsWith(`${slug}-`);
}

// --- Main -----------------------------------------------------------------
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

console.log(APPLY ? "🚀 APPLY mode — files will be renamed" : "🔍 DRY RUN — pass --apply to execute");
console.log("");

const { data: products, error } = await supabase
  .from("products")
  .select("id, name, slug, hero_image_url, images")
  .order("created_at", { ascending: true });

if (error) {
  console.error("Failed to load products:", error.message);
  process.exit(1);
}

let totalProducts = 0;
let totalRenames = 0;
let totalSkippedExternal = 0;
let totalSkippedAlready = 0;
let totalErrors = 0;

for (const p of products) {
  if (totalProducts >= LIMIT) break;

  const slug = safeSegment(p.slug);
  if (!slug) {
    console.warn(`  ⚠️  ${p.id} has empty slug — skipping`);
    continue;
  }

  /** {oldPath, newPath, kind, idx?}[] */
  const moves = [];

  // Hero
  if (p.hero_image_url) {
    const oldPath = pathFromUrl(p.hero_image_url);
    if (!oldPath) totalSkippedExternal++;
    else if (alreadyRenamed(oldPath, slug)) totalSkippedAlready++;
    else {
      moves.push({
        kind: "hero",
        oldPath,
        newPath: `products/${slug}-hero-${nonce()}.${extOf(oldPath)}`,
      });
    }
  }

  // Gallery
  const gallery = Array.isArray(p.images) ? p.images : [];
  for (let i = 0; i < gallery.length; i++) {
    const url = gallery[i];
    const oldPath = pathFromUrl(url);
    if (!oldPath) {
      totalSkippedExternal++;
      continue;
    }
    if (alreadyRenamed(oldPath, slug)) {
      totalSkippedAlready++;
      continue;
    }
    moves.push({
      kind: "gallery",
      idx: i,
      oldPath,
      newPath: `products/${slug}-${i + 1}-${nonce()}.${extOf(oldPath)}`,
    });
  }

  if (moves.length === 0) continue;

  totalProducts++;
  console.log(`\n[${totalProducts}] ${p.name}  (slug: ${slug})`);
  for (const m of moves) {
    console.log(`    ${m.kind}${m.idx !== undefined ? `[${m.idx}]` : ""}: ${m.oldPath}  →  ${m.newPath}`);
  }

  if (!APPLY) {
    totalRenames += moves.length;
    continue;
  }

  // --- COPY phase: copy each old → new --------------------------------
  const copied = [];
  let hadCopyError = false;
  for (const m of moves) {
    const { error: copyErr } = await supabase.storage.from(BUCKET).copy(m.oldPath, m.newPath);
    if (copyErr) {
      console.error(`    ❌ copy failed: ${m.oldPath} — ${copyErr.message}`);
      hadCopyError = true;
      totalErrors++;
      break;
    }
    copied.push(m);
  }
  if (hadCopyError) {
    // Roll back: delete any copies we made so we don't leave orphans.
    if (copied.length) {
      await supabase.storage.from(BUCKET).remove(copied.map((m) => m.newPath));
    }
    continue;
  }

  // --- UPDATE row -----------------------------------------------------
  let newHero = p.hero_image_url;
  let newGallery = gallery.slice();
  for (const m of moves) {
    const newUrl = `${PUBLIC_PREFIX}${m.newPath}`;
    if (m.kind === "hero") newHero = newUrl;
    else newGallery[m.idx] = newUrl;
  }

  const { error: updateErr } = await supabase
    .from("products")
    .update({ hero_image_url: newHero, images: newGallery.length ? newGallery : null })
    .eq("id", p.id);

  if (updateErr) {
    console.error(`    ❌ DB update failed: ${updateErr.message}`);
    // Roll back: remove copies, leave old files in place.
    await supabase.storage.from(BUCKET).remove(copied.map((m) => m.newPath));
    totalErrors++;
    continue;
  }

  // --- DELETE old -----------------------------------------------------
  const { error: deleteErr } = await supabase.storage
    .from(BUCKET)
    .remove(moves.map((m) => m.oldPath));
  if (deleteErr) {
    // Non-fatal: the page is already serving from the new URLs. The old
    // files just become orphans — log so they can be cleaned up later.
    console.warn(`    ⚠️  could not delete old files (orphaned): ${deleteErr.message}`);
  }

  console.log(`    ✅ renamed ${moves.length} file(s)`);
  totalRenames += moves.length;
}

console.log("");
console.log("─".repeat(60));
console.log(`Products processed:    ${totalProducts}`);
console.log(`Files ${APPLY ? "renamed" : "would rename"}: ${totalRenames}`);
console.log(`Skipped (external):    ${totalSkippedExternal}`);
console.log(`Skipped (already ok):  ${totalSkippedAlready}`);
console.log(`Errors:                ${totalErrors}`);
if (!APPLY) console.log(`\nRe-run with --apply to execute.`);
