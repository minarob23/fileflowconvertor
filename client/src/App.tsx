
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Privacy from "@/pages/Privacy";
import Features from "@/pages/Features";
import Terms from "@/pages/Terms";
import Contact from "@/pages/Contact";

// Main App component with routing
function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show minimal loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/pricing" component={NotFound} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/features" component={Features} />
      <Route path="/terms" component={Terms} />
      <Route path="/contact" component={Contact} />
      <Route path="/">
        {isAuthenticated ? <Dashboard /> : <Landing />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
