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
import UserManagement from "@/pages/admin/UserManagement";
import SystemSettings from "@/pages/admin/SystemSettings";
import ActivityLogs from "@/pages/admin/ActivityLogs";
import SystemBackups from "@/pages/admin/SystemBackups";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/auth/login" element={<LoginForm />} />
          <Route path="/auth/signup" element={<SignUpForm />} />
          
          <Route element={<AuthGuard><DashboardLayout /></AuthGuard>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/commissions" element={<Commissions />} />
            <Route path="/residuals" element={<Residuals />} />
            
            {/* Admin Routes */}
            <Route path="/admin/users" element={<AuthGuard requireAdmin={true}><UserManagement /></AuthGuard>} />
            <Route path="/admin/settings" element={<AuthGuard requireAdmin={true}><SystemSettings /></AuthGuard>} />
            <Route path="/admin/logs" element={<AuthGuard requireAdmin={true}><ActivityLogs /></AuthGuard>} />
            <Route path="/admin/backups" element={<AuthGuard requireAdmin={true}><SystemBackups /></AuthGuard>} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;