import { avatarHash, hashEmail } from "./hash";
import { AvatarOptions } from "./types";

const BASE_URL = "https://avatar.shivanshsethi.in";

/**
 * Generate an avatar URL from a user ID
 */
export function avatarUrlFromUserId(
  userId: string,
  options?: AvatarOptions
): string {
  const params = new URLSearchParams();

  if (options?.size) {
    params.set("s", Math.min(options.size, 1024).toString());
  } else {
    params.set("s", "128");
  }

  if (options?.style && options.style !== "identicon") {
    params.set("style", options.style);
  }

  if (options?.format && options.format !== "svg") {
    params.set("format", options.format);
  }

  if (options?.background) {
    params.set("bg", options.background);
  }

  const query = params.toString();
  return `${BASE_URL}/u/${encodeURIComponent(userId)}${query ? `?${query}` : ""}`;
}

/**
 * Generate an avatar URL from an email address
 * Email is hashed to prevent exposing raw addresses
 */
export function avatarUrlFromEmail(
  email: string,
  options?: AvatarOptions
): string {
  const hash = hashEmail(email);
  const params = new URLSearchParams();

  if (options?.size) {
    params.set("s", Math.min(options.size, 1024).toString());
  } else {
    params.set("s", "128");
  }

  if (options?.style && options.style !== "identicon") {
    params.set("style", options.style);
  }

  if (options?.format && options.format !== "svg") {
    params.set("format", options.format);
  }

  if (options?.background) {
    params.set("bg", options.background);
  }

  const query = params.toString();
  return `${BASE_URL}/email/${hash}${query ? `?${query}` : ""}`;
}

/**
 * Generic avatar URL generator
 * Detects if input is an email or user ID
 */
export function avatarUrl(
  identifier: string,
  options?: AvatarOptions
): string {
  if (identifier.includes("@")) {
    return avatarUrlFromEmail(identifier, options);
  }
  return avatarUrlFromUserId(identifier, options);
}
