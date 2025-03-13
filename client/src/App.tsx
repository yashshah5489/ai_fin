import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Investments from "@/pages/Investments";
import Budget from "@/pages/Budget";
import Reports from "@/pages/Reports";
import AIAdvisor from "@/pages/AIAdvisor";
import Forecasting from "@/pages/Forecasting";
import RiskAnalysis from "@/pages/RiskAnalysis";
import Profile from "@/pages/Profile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/investments" component={Investments} />
      <Route path="/budget" component={Budget} />
      <Route path="/reports" component={Reports} />
      <Route path="/ai-advisor" component={AIAdvisor} />
      <Route path="/forecasting" component={Forecasting} />
      <Route path="/risk-analysis" component={RiskAnalysis} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
