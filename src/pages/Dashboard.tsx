import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStats {
  totalCommissions: number;
  totalResiduals: number;
  activeAccounts: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCommissions: 0,
    totalResiduals: 0,
    activeAccounts: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: accounts } = await supabase
        .from("accounts")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("status", "active");

      const { data: commissions } = await supabase
        .from("commissions")
        .select("amount")
        .in("account_id", accounts?.map(a => a.id) || []);

      const { data: residuals } = await supabase
        .from("residuals")
        .select("amount")
        .in("account_id", accounts?.map(a => a.id) || []);

      setStats({
        totalCommissions: commissions?.reduce((sum, c) => sum + Number(c.amount), 0) || 0,
        totalResiduals: residuals?.reduce((sum, r) => sum + Number(r.amount), 0) || 0,
        activeAccounts: accounts?.length || 0,
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{stats.activeAccounts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">${stats.totalCommissions.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Residuals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">${stats.totalResiduals.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;