import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import Dashboard from "@/pages/Dashboard";
import Accounts from "@/pages/Accounts";
import Commissions from "@/pages/Commissions";
import Residuals from "@/pages/Residuals";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/auth/login" element={<LoginForm />} />
          <Route path="/auth/signup" element={<SignUpForm />} />
          
          <Route element={<AuthGuard>
            <DashboardLayout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/commissions" element={<Commissions />} />
                <Route path="/residuals" element={<Residuals />} />
              </Routes>
            </DashboardLayout>
          </AuthGuard>} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;