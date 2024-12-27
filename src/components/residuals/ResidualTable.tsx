import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Residual {
  id: string;
  account: { name: string };
  period_start: string;
  period_end: string;
  amount: number;
  rate: number;
}

interface ResidualTableProps {
  residuals?: Residual[];
  sortBy: "date" | "amount";
  sortOrder: "asc" | "desc";
  onSort: (column: "date" | "amount") => void;
}

export function ResidualTable({
  residuals,
  sortBy,
  sortOrder,
  onSort,
}: ResidualTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-xs">Account</TableHead>
          <TableHead 
            className="text-xs cursor-pointer"
            onClick={() => onSort("date")}
          >
            Period {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
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
        {residuals?.map((residual) => (
          <TableRow key={residual.id}>
            <TableCell className="text-sm">{residual.account?.name || "N/A"}</TableCell>
            <TableCell className="text-sm">
              {format(new Date(residual.period_start), "MMM d, yyyy")} -{" "}
              {format(new Date(residual.period_end), "MMM d, yyyy")}
            </TableCell>
            <TableCell className="text-sm text-right">
              ${residual.amount.toFixed(2)}
            </TableCell>
            <TableCell className="text-sm text-right">
              {(residual.rate * 100).toFixed(1)}%
            </TableCell>
          </TableRow>
        ))}
        {(!residuals || residuals.length === 0) && (
          <TableRow>
            <TableCell colSpan={4} className="text-sm text-center">
              No residuals found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}