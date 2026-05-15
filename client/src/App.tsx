import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { IS_STATIC_SITE } from "./const";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Community from "@/pages/Community";
import Engineering from "@/pages/Engineering";
import Dealers from "@/pages/Dealers";
import BuildConfigurator from "@/pages/BuildConfigurator";
import Admin from "@/pages/Admin";
import Comparison from "@/pages/Comparison";

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
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
