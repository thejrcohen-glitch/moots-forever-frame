import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Community from "@/pages/Community";
import Engineering from "@/pages/Engineering";
import Dealers from "@/pages/Dealers";
import BuildConfigurator from "@/pages/BuildConfigurator";
import Admin from "@/pages/Admin";
import Comparison from "@/pages/Comparison";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/community"} component={Community} />
      <Route path={"/engineering"} component={Engineering} />
      <Route path={"/dealers"} component={Dealers} />
      <Route path={"/build"} component={BuildConfigurator} />
      <Route path={"/admin"} component={Admin} />
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
