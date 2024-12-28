import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Account {
  id: string;
  name: string;
  status: string;
  total_commissions: number;
  total_residuals: number;
}

interface AccountMetricsProps {
  accounts: Account[];
}

export function AccountMetrics({ accounts }: AccountMetricsProps) {
  const totalCommissions = accounts?.reduce(
    (sum, account) => sum + (account.total_commissions || 0),
    0
  );

  const totalResiduals = accounts?.reduce(
    (sum, account) => sum + (account.total_residuals || 0),
    0
  );

  const activeAccounts = accounts?.filter(
    (account) => account.status === "active"
  ).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeAccounts}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalCommissions)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Residuals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalResiduals)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}