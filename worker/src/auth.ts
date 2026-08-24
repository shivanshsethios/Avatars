/**
 * Auth0 integration
 */

export interface Auth0Config {
  domain: string;
  audience: string;
  issuer: string;
}

export const auth0Config: Auth0Config = {
  domain: "login.shivanshsethi.in",
  audience: "https://avatar.shivanshsethi.in",
  issuer: "https://login.shivanshsethi.in/",
};

/**
 * Validate Auth0 JWT token
 * TODO: Implement full JWT validation with JWKS
 */
export async function validateAuth0Token(
  token: string
): Promise<{ valid: boolean; userId?: string; error?: string }> {
  // TODO: Fetch JWKS from Auth0
  // TODO: Verify signature
  // TODO: Check iss and aud claims
  // TODO: Verify exp

  return { valid: false, error: "Not implemented" };
}

/**
 * Extract Bearer token from Authorization header
 */
export function extractBearerToken(authHeader: string): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7);
}
