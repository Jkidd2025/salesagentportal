import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const AuthGuard = ({ children, requireAdmin = false }: AuthGuardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to access this page",
          variant: "destructive",
        });
        navigate("/auth/login");
        return;
      }

      if (requireAdmin) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", session.user.id)
          .single();

        if (!profile?.is_admin) {
          toast({
            title: "Access denied",
            description: "Admin privileges required",
            variant: "destructive",
          });
          navigate("/dashboard");
        }
      }
    };

    checkAuth();
  }, [navigate, requireAdmin, toast]);

  return <>{children}</>;
};