import { filterXSS, getDefaultWhiteList, type IWhiteList } from "xss";

// Extend the xss default whitelist so every allowed tag may keep `class`.
// The previous DOMPurify config (USE_PROFILES.html) only stripped inline
// `style` and event-handler attributes — `class` was preserved.
const whiteList: IWhiteList = {};
for (const [tag, attrs] of Object.entries(getDefaultWhiteList())) {
  whiteList[tag] = [...(attrs ?? []), "class"];
}

/**
 * Sanitize untrusted HTML before rendering it via dangerouslySetInnerHTML.
 *
 * Replaces the former isomorphic-dompurify call. isomorphic-dompurify pulls in
 * jsdom, whose dependency tree contains CommonJS modules that require() ESM-only
 * packages (@exodus/bytes, parse5, @csstools/css-calc, …). Vercel's serverless
 * function runtime has no require(ESM) support, so every route importing it
 * crashed at module load with ERR_REQUIRE_ESM. `xss` is pure CommonJS with no
 * such landmines and runs on any Node runtime.
 *
 * Equivalent to the old DOMPurify config:
 *   - allow standard HTML tags (xss default whitelist)
 *   - drop script/style/iframe/object/embed/form (not whitelisted)
 *   - strip event-handler attributes (onerror/onload/onclick/…)
 *   - strip inline `style` attributes (css: false)
 */
export function sanitizeHtml(dirty: string): string {
  return filterXSS(dirty, {
    whiteList,
    css: false, // strip inline style attributes
    stripIgnoreTag: true, // drop non-whitelisted tags, keep their text
    stripIgnoreTagBody: ["script", "style"], // drop script/style tag + contents
  });
}
