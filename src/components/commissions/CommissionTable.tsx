import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Commission {
  id: string;
  account: { name: string };
  transaction_date: string;
  amount: number;
  rate: number;
}

interface CommissionTableProps {
  commissions?: Commission[];
  sortBy: "date" | "amount";
  sortOrder: "asc" | "desc";
  onSort: (column: "date" | "amount") => void;
}

export function CommissionTable({
  commissions,
  sortBy,
  sortOrder,
  onSort,
}: CommissionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-xs">Account</TableHead>
          <TableHead 
            className="text-xs cursor-pointer"
            onClick={() => onSort("date")}
          >
            Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
          </TableHead>
          <TableHead 
            className="text-xs cursor-pointer text-right"
            onClick={() => onSort("amount")}
          >
            Amount {sortBy === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
          </TableHead>
          <TableHead className="text-xs text-right">Rate</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {commissions?.map((commission) => (
          <TableRow key={commission.id}>
            <TableCell className="text-sm">{commission.account?.name || "N/A"}</TableCell>
            <TableCell className="text-sm">
              {format(new Date(commission.transaction_date), "MMM d, yyyy")}
            </TableCell>
            <TableCell className="text-sm text-right">
              ${commission.amount.toFixed(2)}
            </TableCell>
            <TableCell className="text-sm text-right">
              {(commission.rate * 100).toFixed(1)}%
            </TableCell>
          </TableRow>
        ))}
        {(!commissions || commissions.length === 0) && (
          <TableRow>
            <TableCell colSpan={4} className="text-sm text-center">
              No commissions found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}