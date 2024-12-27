import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import Dashboard from "@/pages/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/auth/login" element={<div className="min-h-screen flex items-center justify-center bg-gray-100"><LoginForm /></div>} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <AuthGuard>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </AuthGuard>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <AuthGuard requireAdmin>
              <DashboardLayout>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              </DashboardLayout>
            </AuthGuard>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;