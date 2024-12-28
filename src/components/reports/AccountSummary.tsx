import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AccountSummaryProps {
  accounts: {
    id: string;
    name: string;
    total_commissions: number;
    total_residuals: number;
  }[];
}

export function AccountSummary({ accounts }: AccountSummaryProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Account Name</TableHead>
          <TableHead className="text-right">Total Commissions</TableHead>
          <TableHead className="text-right">Total Residuals</TableHead>
          <TableHead className="text-right">Total Revenue</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {accounts.map((account) => (
          <TableRow key={account.id}>
            <TableCell>{account.name}</TableCell>
            <TableCell className="text-right">
              {formatCurrency(account.total_commissions)}
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(account.total_residuals)}
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(account.total_commissions + account.total_residuals)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}