/**
 * Site-wide business constants shared by client UI and server-side
 * recomputation. The server NEVER trusts client-submitted money values;
 * it recomputes them from these constants + DB prices.
 */

/** Flat delivery fee (EUR) for "delivery" orders within Zagreb. */
export const DELIVERY_FEE = 10;

/** Display form of the business phone number. */
export const SITE_PHONE = "+385 95 204 4414";

/** `tel:` link form of the business phone number. */
export const SITE_PHONE_HREF = "tel:+385952044414";
