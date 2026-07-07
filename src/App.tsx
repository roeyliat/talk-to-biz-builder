import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateBoard = lazy(() => import("./pages/CreateBoard"));
const BoardDemo = lazy(() => import("./pages/BoardDemo"));
const AACBoard = lazy(() => import("./pages/AACBoard"));
const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const RouteFallback = () => <div className="min-h-screen bg-background" />;

const RequireApprovedUser = () => {
  const { user, loading, isAdmin, isApproved } = useAuth();

  if (loading) {
    return <RouteFallback />;
  }

  if (!user || user.is_anonymous) {
    return <Navigate to="/signin" replace />;
  }

  if (!isAdmin && !isApproved) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

const RequireAdminUser = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <RouteFallback />;
  }

  if (!user || user.is_anonymous || !isAdmin) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/demo" element={<BoardDemo />} />
              <Route path="/board" element={<AACBoard />} />
              <Route path="/board/:boardId" element={<AACBoard />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/signin" element={<Auth />} />
              <Route path="/signup" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route element={<RequireApprovedUser />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create" element={<CreateBoard />} />
              </Route>
              <Route element={<RequireAdminUser />}>
                <Route path="/admin/users" element={<AdminUsers />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
