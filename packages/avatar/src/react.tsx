import React, { useMemo } from "react";
import { avatarUrl } from "./url";
import { AvatarOptions } from "./types";

interface AvatarProps extends AvatarOptions {
  /** Email or user ID */
  identifier: string;
  /** Alt text for the image */
  alt?: string;
  /** CSS class */
  className?: string;
  /** Style object */
  style?: React.CSSProperties;
}

/**
 * React Avatar Component
 *
 * Usage:
 * ```tsx
 * <Avatar identifier="me@shivanshsethi.in" size={48} />
 * <Avatar identifier="usr_123" size={96} style="identicon" />
 * ```
 */
export const Avatar = React.forwardRef<HTMLImageElement, AvatarProps>(
  (
    {
      identifier,
      size = 128,
      style,
      format,
      background,
      fallback,
      alt,
      className,
      ...htmlProps
    },
    ref
  ) => {
    const src = useMemo(
      () =>
        avatarUrl(identifier, {
          size,
          style,
          format,
          background,
          fallback,
        }),
      [identifier, size, style, format, background, fallback]
    );

    return (
      <img
        ref={ref}
        src={src}
        alt={alt || `Avatar for ${identifier}`}
        width={size}
        height={size}
        className={className}
        {...htmlProps}
      />
    );
  }
);

Avatar.displayName = "Avatar";
