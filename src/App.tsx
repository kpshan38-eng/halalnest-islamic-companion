import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import BlossomButton from "./components/BlossomButton";
import PrayerTimes from "./pages/PrayerTimes";
import Quran from "./pages/Quran";
import ChapterReader from "./pages/ChapterReader";
import Calculators from "./pages/Calculators";
import Articles from "./pages/Articles";
import Community from "./pages/Community";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import InvestmentCalculator from "./pages/InvestmentCalculator";
import DateConverter from "./pages/DateConverter";
import QiblaFinder from "./pages/QiblaFinder";
import InheritanceCalculator from "./pages/InheritanceCalculator";
import ScholarAssistant from "./pages/ScholarAssistant";
import Resources from "./pages/Resources";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="halalnest-ui-theme">
      <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navigation />
          <BlossomButton />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/prayer-times" element={<PrayerTimes />} />
            <Route path="/quran" element={<Quran />} />
            <Route path="/quran/chapter/:chapterNumber" element={<ChapterReader />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/calculators/investment" element={<InvestmentCalculator />} />
            <Route path="/calculators/date-converter" element={<DateConverter />} />
            <Route path="/calculators/qibla-finder" element={<QiblaFinder />} />
            <Route path="/calculators/inheritance" element={<InheritanceCalculator />} />
            <Route path="/scholar-assistant" element={<ScholarAssistant />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/community" element={<Community />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
