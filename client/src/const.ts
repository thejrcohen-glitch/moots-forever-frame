export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { appendUrlPath, parseAllowedHosts, parseTrustedUrl } from "@/lib/urlSafety";
export const IS_STATIC_SITE = import.meta.env.VITE_STATIC_SITE === "true";
const OAUTH_PORTAL_ALLOWED_HOSTS = parseAllowedHosts(import.meta.env.VITE_OAUTH_PORTAL_ALLOWED_HOSTS);

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const oauthPortalBaseUrl = parseTrustedUrl(oauthPortalUrl, {
    allowedHosts: OAUTH_PORTAL_ALLOWED_HOSTS,
    allowHttpLocalhost: import.meta.env.DEV,
  });
  if (!oauthPortalBaseUrl) {
    throw new Error("Invalid VITE_OAUTH_PORTAL_URL: expected a trusted HTTPS URL.");
  }

  const url = appendUrlPath(oauthPortalBaseUrl, "app-auth");
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
