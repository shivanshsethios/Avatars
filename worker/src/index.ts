import { avatarUrl } from "@shivanshos/avatar";

interface Env {
  DB: D1Database;
  AVATARS: R2Bucket;
  KV: KVNamespace;
}

/**
 * GET /u/:userId - Serve avatar by user ID
 */
async function handleUserAvatar(
  userId: string,
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const size = Math.min(Number(url.searchParams.get("s") ?? 128), 1024);
  const style = url.searchParams.get("style") ?? "identicon";
  const format = url.searchParams.get("format") ?? "svg";

  // Try to fetch from R2 cache first
  const cacheKey = `${userId}/v/1/${size}_${style}.${format}`;

  try {
    const cached = await env.AVATARS.get(cacheKey);
    if (cached) {
      return new Response(cached.body, {
        headers: {
          "Content-Type": `image/${format === "svg" ? "svg+xml" : format}`,
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
          "ETag": `"${cached.httpEtag}"`,
          "X-Content-Type-Options": "nosniff",
        },
      });
    }
  } catch (e) {
    console.error("R2 cache lookup failed:", e);
  }

  // Generate default avatar (identicon SVG for now)
  const { generateIdenticon } = await import("@shivanshos/avatar");
  const svg = generateIdenticon(userId, size);

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/**
 * GET /email/:hash - Serve avatar by email hash
 */
async function handleEmailAvatar(
  hash: string,
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const size = Math.min(Number(url.searchParams.get("s") ?? 128), 1024);

  // Similar to user avatar, but use email hash as seed
  const { generateIdenticon } = await import("@shivanshos/avatar");
  const svg = generateIdenticon(hash, size);

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/**
 * POST /api/avatar - Upload custom avatar (Auth0 protected)
 */
async function handleAvatarUpload(
  request: Request,
  env: Env
): Promise<Response> {
  // TODO: Implement Auth0 token validation
  // TODO: Validate MIME type and file signature
  // TODO: Resize and convert to WebP
  // TODO: Store in R2
  // TODO: Update D1 metadata

  return new Response(JSON.stringify({ error: "Not implemented" }), {
    status: 501,
  });
}

/**
 * Main fetch handler
 */
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Route matching
    if (pathname === "/health") {
      return new Response("OK");
    }

    const userMatch = pathname.match(/^\/u\/([^/]+)$/);
    if (userMatch && request.method === "GET") {
      return handleUserAvatar(userMatch[1], request, env);
    }

    const emailMatch = pathname.match(/^\/email\/([^/]+)$/);
    if (emailMatch && request.method === "GET") {
      return handleEmailAvatar(emailMatch[1], request, env);
    }

    if (pathname === "/api/avatar" && request.method === "POST") {
      return handleAvatarUpload(request, env);
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
    });
  },
};
