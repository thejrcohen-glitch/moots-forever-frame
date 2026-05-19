/**
 * Security: Localhost hostnames for development-only HTTP allowlist.
 * Production requires HTTPS; HTTP is only permitted for these hosts when
 * explicitly enabled via allowHttpLocalhost (typically import.meta.env.DEV).
 * This is intentional security validation, not debug code.
 */
const LOCALHOST_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

export function normalizeOptionalEnvVar(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  const lowered = trimmed.toLowerCase();
  if (lowered === "undefined" || lowered === "null") {
    return "";
  }
  return trimmed;
}

export function parseAllowedHosts(value: unknown): Set<string> {
  const normalized = normalizeOptionalEnvVar(value);
  if (!normalized) {
    return new Set();
  }
  return new Set(
    normalized
      .split(",")
      .map(host => host.trim().toLowerCase())
      .filter(Boolean),
  );
}

interface ParseTrustedUrlOptions {
  allowedHosts?: Iterable<string>;
  allowHttpLocalhost?: boolean;
}

export function parseTrustedUrl(value: unknown, options: ParseTrustedUrlOptions = {}): URL | null {
  const normalized = normalizeOptionalEnvVar(value);
  if (!normalized) {
    return null;
  }

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    return null;
  }

  const isHttps = parsed.protocol === "https:";
  const isLocalHttp = options.allowHttpLocalhost && parsed.protocol === "http:" && LOCALHOST_HOSTNAMES.has(parsed.hostname);
  if (!isHttps && !isLocalHttp) {
    return null;
  }

  if (options.allowedHosts) {
    const allowedHosts = new Set(Array.from(options.allowedHosts, host => host.toLowerCase()));
    if (allowedHosts.size > 0 && !allowedHosts.has(parsed.hostname.toLowerCase())) {
      return null;
    }
  }

  return parsed;
}

/**
 * Appends a relative path segment to a trusted base URL and intentionally
 * clears any existing query/hash from the base to avoid carrying forward
 * unexpected parameters into script/auth endpoints.
 */
export function appendUrlPath(baseUrl: URL, path: string): URL {
  const next = new URL(baseUrl.toString());
  const basePath = next.pathname.replace(/\/+$/, "");
  const pathSegment = path.replace(/^\/+/, "");
  next.pathname = `${basePath}/${pathSegment}`;
  next.search = "";
  next.hash = "";
  return next;
}
