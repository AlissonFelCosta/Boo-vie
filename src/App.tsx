
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";

// Pages
import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/MoviesPage";
import BooksPage from "./pages/BooksPage";
import ChatPage from "./pages/ChatPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import FeedPage from "./pages/FeedPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import EmailConfirmationPage from "./pages/EmailConfirmationPage";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
};

// Public route - redirects to home if logged in
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }
  
  if (currentUser) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

// Wrap all routes with AuthProvider
const AppRoutes = () => (
  <AuthProvider>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movies" element={<MoviesPage />} />
      <Route path="/books" element={<BooksPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/feed" element={<FeedPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/email-confirmation" element={<EmailConfirmationPage />} />
      <Route path="/recommendations" element={
        <ProtectedRoute>
          <RecommendationsPage />
        </ProtectedRoute>
      } />

      <Route path="/movie/:id" element={<ItemDetailPage />} />
      <Route path="/book/:id" element={<ItemDetailPage />} />
      <Route path="/game/:id" element={<ItemDetailPage />} />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      
      <Route path="/auth" element={
        <PublicRoute>
          <AuthPage />
        </PublicRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </AuthProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
