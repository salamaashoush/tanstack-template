export interface JWTPayload {
  // Common JWT claims
  iss?: string; // issuer
  sub?: string; // subject
  aud?: string; // audience
  exp?: number; // expiration time
  nbf?: number; // not before
  iat?: number; // issued at
  jti?: string; // JWT ID
}

class JWTParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JWTParseError";
  }
}

/**
 * Parses a JWT token and returns its payload
 * @param token - The JWT token string to parse
 * @returns The decoded JWT payload
 * @throws {JWTParseError} If the token is invalid or cannot be parsed
 */
export function parseJwt(token: string): JWTPayload {
  try {
    // Validate token format
    if (!token || typeof token !== "string") {
      throw new JWTParseError(
        "Invalid token: Token must be a non-empty string",
      );
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new JWTParseError(
        "Invalid token format: JWT must have three parts",
      );
    }

    const [, base64Payload] = parts;
    if (!base64Payload) {
      throw new JWTParseError("Invalid token: Missing payload");
    }

    // Replace Base64Url characters with Base64 characters
    const base64 = base64Payload.replace(/-/g, "+").replace(/_/g, "/");

    // Add padding if necessary
    const padding = "=".repeat((4 - (base64.length % 4)) % 4);
    const paddedBase64 = base64 + padding;

    // Decode Base64 to binary string
    let decodedBinary: string;
    try {
      decodedBinary = atob(paddedBase64);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
      throw new JWTParseError("Invalid token: Unable to decode Base64");
    }

    // Convert binary string to percent-encoded string
    const percentEncoded = decodedBinary
      .split("")
      .map((char) => `%${("00" + char.charCodeAt(0).toString(16)).slice(-2)}`)
      .join("");

    // Decode percent-encoded string and parse JSON
    const jsonPayload = decodeURIComponent(percentEncoded);
    const payload = JSON.parse(jsonPayload) as JWTPayload;

    return payload;
  } catch (error) {
    if (error instanceof JWTParseError) {
      throw error;
    }
    throw new JWTParseError(`Failed to parse JWT: ${(error as Error).message}`);
  }
}

export function isJwtExpired(payload: JWTPayload | string): boolean {
  if (typeof payload === "string") {
    payload = parseJwt(payload);
  }
  return payload.exp ? Date.now() >= payload.exp * 1000 : false;
}
