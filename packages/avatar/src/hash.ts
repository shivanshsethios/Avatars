import { createHash } from "node:crypto";

/**
 * Hash an email address using SHA-256
 * Follows Gravatar's normalization: trim, lowercase, then hash
 */
export function hashEmail(email: string): string {
  return createHash("sha256")
    .update(email.trim().toLowerCase(), "utf8")
    .digest("hex");
}

/**
 * Hash any identifier (email, user ID, seed) using SHA-256
 */
export function avatarHash(identifier: string): string {
  return createHash("sha256")
    .update(identifier, "utf8")
    .digest("hex");
}

/**
 * Generate a color from a hash string
 * Takes first 6 hex chars and returns as #RRGGBB
 */
export function colorFromHash(hash: string): string {
  return `#${hash.slice(0, 6)}`;
}

/**
 * Generate a deterministic seed from identifier
 * Used for identicon and other generated avatars
 */
export function seedFromHash(hash: string): number {
  return parseInt(hash.slice(0, 8), 16);
}
