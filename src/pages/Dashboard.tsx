import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { startOfMonth, subMonths, format } from "date-fns";

interface DashboardStats {
  totalCommissions: number;
  totalResiduals: number;
  activeAccounts: number;
  monthlyCommissions: { month: string; amount: number }[];
  monthlyResiduals: { month: string; amount: number }[];
  yearOverYear: {
    commissions: { currentYear: number; previousYear: number };
    residuals: { currentYear: number; previousYear: number };
  };
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCommissions: 0,
    totalResiduals: 0,
    activeAccounts: 0,
    monthlyCommissions: [],
    monthlyResiduals: [],
    yearOverYear: {
      commissions: { currentYear: 0, previousYear: 0 },
      residuals: { currentYear: 0, previousYear: 0 }
    }
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Fetch active accounts
      const { data: accounts } = await supabase
        .from("accounts")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("status", "active");

      const accountIds = accounts?.map(a => a.id) || [];

      // Fetch total commissions and residuals
      const { data: commissions } = await supabase
        .from("commissions")
        .select("amount, transaction_date")
        .in("account_id", accountIds);

      const { data: residuals } = await supabase
        .from("residuals")
        .select("amount, period_start, period_end")
        .in("account_id", accountIds);

      // Calculate monthly data for the last 6 months
      const months = Array.from({ length: 6 }, (_, i) => subMonths(new Date(), i));
      const monthlyCommissions = months.map(month => {
        const monthStart = startOfMonth(month);
        const monthTotal = commissions?.reduce((sum, c) => {
          const date = new Date(c.transaction_date);
          return date.getMonth() === monthStart.getMonth() && 
                 date.getFullYear() === monthStart.getFullYear() 
                 ? sum + Number(c.amount) 
                 : sum;
        }, 0) || 0;

        return {
          month: format(monthStart, "MMM yyyy"),
          amount: monthTotal
        };
      }).reverse();

      const monthlyResiduals = months.map(month => {
        const monthStart = startOfMonth(month);
        const monthTotal = residuals?.reduce((sum, r) => {
          const startDate = new Date(r.period_start);
          return startDate.getMonth() === monthStart.getMonth() && 
                 startDate.getFullYear() === monthStart.getFullYear() 
                 ? sum + Number(r.amount) 
                 : sum;
        }, 0) || 0;

        return {
          month: format(monthStart, "MMM yyyy"),
          amount: monthTotal
        };
      }).reverse();

      // Calculate year-over-year comparison
      const currentYear = new Date().getFullYear();
      const yearOverYear = {
        commissions: {
          currentYear: commissions?.reduce((sum, c) => 
            new Date(c.transaction_date).getFullYear() === currentYear 
              ? sum + Number(c.amount) 
              : sum, 0) || 0,
          previousYear: commissions?.reduce((sum, c) => 
            new Date(c.transaction_date).getFullYear() === currentYear - 1 
              ? sum + Number(c.amount) 
              : sum, 0) || 0
        },
        residuals: {
          currentYear: residuals?.reduce((sum, r) => 
            new Date(r.period_start).getFullYear() === currentYear 
              ? sum + Number(r.amount) 
              : sum, 0) || 0,
          previousYear: residuals?.reduce((sum, r) => 
            new Date(r.period_start).getFullYear() === currentYear - 1 
              ? sum + Number(r.amount) 
              : sum, 0) || 0
        }
      };

      setStats({
        totalCommissions: commissions?.reduce((sum, c) => sum + Number(c.amount), 0) || 0,
        totalResiduals: residuals?.reduce((sum, r) => sum + Number(r.amount), 0) || 0,
        activeAccounts: accounts?.length || 0,
        monthlyCommissions,
        monthlyResiduals,
        yearOverYear
      });
    };

    fetchStats();
  }, []);

  const chartConfig = {
    commissions: { color: "#22c55e" },
    residuals: { color: "#3b82f6" }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      
      {/* Summary Statistics */}
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
            <p className="text-2xl font-semibold">{formatCurrency(stats.totalCommissions)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Residuals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatCurrency(stats.totalResiduals)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Commissions</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={chartConfig}>
              <BarChart data={stats.monthlyCommissions}>
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]}
                />
                <Bar dataKey="amount" fill={chartConfig.commissions.color} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Residuals</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={chartConfig}>
              <BarChart data={stats.monthlyResiduals}>
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]}
                />
                <Bar dataKey="amount" fill={chartConfig.residuals.color} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Year-over-Year Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Year-over-Year Commissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Year</p>
                <p className="text-xl font-semibold">
                  {formatCurrency(stats.yearOverYear.commissions.currentYear)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Previous Year</p>
                <p className="text-xl font-semibold">
                  {formatCurrency(stats.yearOverYear.commissions.previousYear)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Year-over-Year Change</p>
                <p className="text-xl font-semibold">
                  {((stats.yearOverYear.commissions.currentYear / 
                     stats.yearOverYear.commissions.previousYear - 1) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Year-over-Year Residuals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Year</p>
                <p className="text-xl font-semibold">
                  {formatCurrency(stats.yearOverYear.residuals.currentYear)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Previous Year</p>
                <p className="text-xl font-semibold">
                  {formatCurrency(stats.yearOverYear.residuals.previousYear)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Year-over-Year Change</p>
                <p className="text-xl font-semibold">
                  {((stats.yearOverYear.residuals.currentYear / 
                     stats.yearOverYear.residuals.previousYear - 1) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;