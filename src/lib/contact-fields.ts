import { z } from "zod";

/**
 * Shared validators for the free-text identity fields on the public forms
 * (inquiry + contact). Both are reflected into outbound e-mail: the name
 * into the customer's own confirmation mail (sent to an address the
 * submitter chose) and both into the admin notification. Everything is
 * HTML-escaped on output already; these rules additionally stop the forms
 * from being used as a relay for arbitrary text or URLs under our domain.
 */

// Letters from any script (č ć ž š đ included), combining marks, spaces,
// hyphen, straight or typographic apostrophe, and a period for initials.
// Built with the constructor so the `u` flag compiles regardless of TS target.
export const NAME_RE = new RegExp("^[\\p{L}\\p{M}][\\p{L}\\p{M} .'’-]*$", "u");

// Digits with the usual separators. The `+` may only lead.
export const PHONE_RE = /^\+?[0-9 ()./-]+$/;

export const NAME_ERROR =
  "Ime smije sadržavati samo slova, razmake, crtice i apostrofe.";
export const PHONE_ERROR = "Unesite ispravan broj telefona.";

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Unesite ime i prezime.")
  .max(80, "Ime je predugačko.")
  .regex(NAME_RE, NAME_ERROR);

export const phoneSchema = z
  .string()
  .trim()
  .min(8, PHONE_ERROR)
  .max(40, PHONE_ERROR)
  .regex(PHONE_RE, PHONE_ERROR)
  .refine((v) => (v.match(/\d/g) ?? []).length >= 6, PHONE_ERROR);
