import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", session.user.id)
          .single();
        
        setIsAdmin(!!profile?.is_admin);
      }
    };

    checkAdmin();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold">Sales Agent Portal</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/accounts")}
                >
                  Accounts
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/commissions")}
                >
                  Commissions
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/residuals")}
                >
                  Residuals
                </Button>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/admin")}
                  >
                    Admin
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};