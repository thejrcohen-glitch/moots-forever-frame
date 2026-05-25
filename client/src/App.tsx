import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { useEffect } from "react";
import { Route, Switch } from "wouter";
import { IS_STATIC_SITE } from "./const";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { appendUrlPath, parseAllowedHosts, parseTrustedUrl } from "./lib/urlSafety";
import Home from "./pages/Home";
import Community from "@/pages/Community";
import Engineering from "@/pages/Engineering";
import Dealers from "@/pages/Dealers";
import BuildConfigurator from "@/pages/BuildConfigurator";
import Admin from "@/pages/Admin";
import Comparison from "@/pages/Comparison";
import Bikes from "@/pages/Bikes";
import Races from "@/pages/Races";

const ANALYTICS_ENDPOINT = import.meta.env.VITE_ANALYTICS_ENDPOINT;
const ANALYTICS_WEBSITE_ID = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;
const ANALYTICS_ALLOWED_HOSTS = parseAllowedHosts(import.meta.env.VITE_ANALYTICS_ALLOWED_HOSTS);
const ANALYTICS_ENDPOINT_URL = parseTrustedUrl(ANALYTICS_ENDPOINT, {
  allowedHosts: ANALYTICS_ALLOWED_HOSTS,
  allowHttpLocalhost: import.meta.env.DEV,
});

/**
 * Injects the Umami analytics script at runtime only when both env vars are
 * defined, non-empty, and the endpoint is a valid https:// URL.  This keeps
 * the static GitHub Pages build free of broken script tags when those optional
 * vars are absent from CI.
 */
function AnalyticsScript() {
  // ANALYTICS_ENDPOINT and ANALYTICS_WEBSITE_ID are module-level constants
  // evaluated once from import.meta.env — they never change at runtime, so
  // the empty dependency array is intentional.
  useEffect(() => {
    if (!ANALYTICS_ENDPOINT || !ANALYTICS_WEBSITE_ID) return;
    if (!ANALYTICS_ENDPOINT_URL) return;
    const SCRIPT_ID = "umami-analytics";
    if (document.getElementById(SCRIPT_ID)) return;
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.defer = true;
    script.src = appendUrlPath(ANALYTICS_ENDPOINT_URL, "umami").toString();
    script.dataset.websiteId = ANALYTICS_WEBSITE_ID;
    document.head.appendChild(script);
  }, []);
  return null;
}

function StaticUnavailablePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center" style={{ background: "oklch(0.22 0.01 60)" }}>
      <div className="max-w-xl">
        <h1 className="font-display text-3xl font-bold mb-4" style={{ color: "oklch(0.945 0.018 78)" }}>Feature Not Available on Static Hosting</h1>
        <p className="font-mono-custom text-sm leading-relaxed" style={{ color: "oklch(0.52 0.04 65)" }}>
          This page requires backend APIs and is not available on the GitHub Pages deployment.
        </p>
      </div>
    </div>
  );
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/community"} component={IS_STATIC_SITE ? StaticUnavailablePage : Community} />
      <Route path={"/engineering"} component={Engineering} />
      <Route path={"/dealers"} component={Dealers} />
      <Route path={"/build"} component={BuildConfigurator} />
      <Route path={"/admin"} component={IS_STATIC_SITE ? StaticUnavailablePage : Admin} />
      <Route path={"/comparison"} component={Comparison} />
      <Route path={"/bikes"} component={Bikes} />
      <Route path={"/races"} component={Races} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <AnalyticsScript />
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
