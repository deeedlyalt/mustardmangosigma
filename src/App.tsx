import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProgressProvider } from "@/context/ProgressContext";
import Index from "./pages/Index";
import ChapterPage from "./pages/ChapterPage";
import QuizPage from "./pages/QuizPage";
import ConnectionsPage from "./pages/ConnectionsPage";
import ProgressPage from "./pages/ProgressPage";
import ExamTipsPage from "./pages/ExamTipsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProgressProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chapter/:chapterId" element={<ChapterPage />} />
            <Route path="/quiz/:chapterId" element={<QuizPage />} />
            <Route path="/connections" element={<ConnectionsPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/tips" element={<ExamTipsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ProgressProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
