import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AccountEditDialog } from "./AccountEditDialog";

interface Account {
  id: string;
  name: string;
  status: string;
  total_commissions: number;
  total_residuals: number;
  last_transaction_date: string;
}

interface AccountTableProps {
  accounts: Account[];
  onUpdate: () => void;
}

export function AccountTable({ accounts, onUpdate }: AccountTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total Commissions</TableHead>
            <TableHead>Total Residuals</TableHead>
            <TableHead>Last Transaction</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts?.map((account) => (
            <TableRow key={account.id}>
              <TableCell>{account.name}</TableCell>
              <TableCell>
                <Badge
                  variant={account.status === "active" ? "default" : "secondary"}
                >
                  {account.status}
                </Badge>
              </TableCell>
              <TableCell>{formatCurrency(account.total_commissions)}</TableCell>
              <TableCell>{formatCurrency(account.total_residuals)}</TableCell>
              <TableCell>
                {account.last_transaction_date
                  ? new Date(account.last_transaction_date).toLocaleDateString()
                  : "No transactions"}
              </TableCell>
              <TableCell>
                <AccountEditDialog account={account} onUpdate={onUpdate} />
              </TableCell>
            </TableRow>
          ))}
          {accounts?.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No accounts found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}