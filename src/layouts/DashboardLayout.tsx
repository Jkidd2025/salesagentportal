import { useState, useEffect } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LayoutDashboard, Users, DollarSign, LineChart, LogOut } from "lucide-react";

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      setIsAdmin(profile?.is_admin || false);
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });

      navigate("/auth/login");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border">
        <div className="h-full flex flex-col">
          <div className="p-4">
            <h2 className="text-base font-medium text-sidebar-foreground">Portal</h2>
          </div>
          <nav className="flex-1 p-2 space-y-1">
            <Link
              to="/dashboard"
              className="flex items-center px-3 py-2 text-sm text-sidebar-foreground rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
            >
              <LayoutDashboard className="w-4 h-4 mr-3" />
              Dashboard
            </Link>
            {isAdmin && (
              <Link
                to="/accounts"
                className="flex items-center px-3 py-2 text-sm text-sidebar-foreground rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
              >
                <Users className="w-4 h-4 mr-3" />
                Accounts
              </Link>
            )}
            <Link
              to="/commissions"
              className="flex items-center px-3 py-2 text-sm text-sidebar-foreground rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
            >
              <DollarSign className="w-4 h-4 mr-3" />
              Commissions
            </Link>
            <Link
              to="/residuals"
              className="flex items-center px-3 py-2 text-sm text-sidebar-foreground rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
            >
              <LineChart className="w-4 h-4 mr-3" />
              Residuals
            </Link>
          </nav>
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-sidebar-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};