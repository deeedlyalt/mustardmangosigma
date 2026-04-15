import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ProgressProvider } from "@/context/ProgressContext";
import Index from "./pages/Index";
import ChapterPage from "./pages/ChapterPage";
import QuizPage from "./pages/QuizPage";
import ConnectionsPage from "./pages/ConnectionsPage";
import ProgressPage from "./pages/ProgressPage";
import ExamTipsPage from "./pages/ExamTipsPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import DuelPage from "./pages/DuelPage.tsx";
import SearchPage from "./pages/SearchPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoutes = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-2">🧬</p>
          <p className="text-muted-foreground text-sm font-semibold">Laddar...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <ProgressProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/chapter/:chapterId" element={<ChapterPage />} />
        <Route path="/quiz/:chapterId" element={<QuizPage />} />
        <Route path="/connections" element={<ConnectionsPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/tips" element={<ExamTipsPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/duel" element={<DuelPage />} />
        <Route path="/duel/:duelId" element={<DuelPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ProgressProvider>
  );
};

const AuthRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <AuthPage />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthRoute />} />
            <Route path="/*" element={<ProtectedRoutes />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;