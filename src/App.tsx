import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { AppProvider } from "@/context/AppContext";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Interviews from "./pages/Interviews";
import Reminders from "./pages/Reminders";
import Analytics from "./pages/Analytics";
import CalendarView from "./pages/CalendarView";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/interviews" element={<Interviews />} />
              <Route path="/reminders" element={<Reminders />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
