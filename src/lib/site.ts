/**
 * Site-wide business constants shared by client UI and server-side code.
 * Money is never taken from the client: prices come from the DB and the
 * delivery fee is per product (see src/lib/delivery.ts).
 */

/** Display form of the business phone number. */
export const SITE_PHONE = "+385 95 204 4414";

/** `tel:` link form of the business phone number. */
export const SITE_PHONE_HREF = "tel:+385952044414";
