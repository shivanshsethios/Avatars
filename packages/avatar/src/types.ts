/**
 * Avatar generation options
 */
export type AvatarStyle =
  | "initials"
  | "identicon"
  | "pixel"
  | "gradient"
  | "bot";

export type AvatarFormat = "svg" | "png" | "webp";

export type AvatarFallback = "initials" | "identicon" | "404";

export interface AvatarOptions {
  /** Size in pixels (default: 128) */
  size?: number;
  /** Avatar style (default: 'identicon') */
  style?: AvatarStyle;
  /** Background color hex (optional) */
  background?: string;
  /** Image format (default: 'svg') */
  format?: AvatarFormat;
  /** Fallback strategy (default: 'identicon') */
  fallback?: AvatarFallback;
}

export interface Avatar {
  identifier: string;
  hash: string;
  url: string;
  style: AvatarStyle;
}
