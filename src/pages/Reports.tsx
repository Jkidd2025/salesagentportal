import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { startOfMonth, endOfMonth } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportDateRange } from "@/components/reports/ReportDateRange";
import { AccountSummary } from "@/components/reports/AccountSummary";
import { exportToCSV, exportToPDF } from "@/utils/export";
import { FileDown, FilePdf } from "lucide-react";

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const { data: accounts, isLoading } = useQuery({
    queryKey: ["accounts-summary", dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("accounts")
        .select(`
          id,
          name,
          total_commissions,
          total_residuals
        `)
        .gte("last_transaction_date", dateRange.from.toISOString())
        .lte("last_transaction_date", dateRange.to.toISOString());

      if (error) throw error;
      return data;
    },
  });

  const handleExportCSV = () => {
    if (!accounts) return;
    exportToCSV(accounts, `accounts-summary-${Date.now()}`);
  };

  const handleExportPDF = () => {
    if (!accounts) return;
    const columns = ["name", "total_commissions", "total_residuals"];
    exportToPDF(
      accounts,
      columns,
      `accounts-summary-${Date.now()}`,
      "Accounts Summary Report"
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <FileDown className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <FilePdf className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <ReportDateRange
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <Card>
        <CardHeader>
          <CardTitle>Account Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading accounts...</div>
          ) : (
            <AccountSummary accounts={accounts || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;