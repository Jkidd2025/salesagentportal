import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { AdminNav } from "@/components/dashboard/AdminNav";
import { SignOutButton } from "@/components/dashboard/SignOutButton";

export const DashboardLayout = () => {
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

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border">
        <div className="h-full flex flex-col">
          <div className="p-4">
            <h2 className="text-base font-medium text-sidebar-foreground">Portal</h2>
          </div>
          <nav className="flex-1 p-2 space-y-1">
            <SidebarNav />
            {isAdmin && <AdminNav />}
          </nav>
          <div className="p-4 border-t border-sidebar-border">
            <SignOutButton />
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