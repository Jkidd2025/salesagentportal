import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

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
  onEdit: (residual: Residual) => void;
  onDelete: (residual: Residual) => void;
}

export function ResidualTable({
  residuals,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
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
          <TableHead className="text-xs text-right">Actions</TableHead>
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
            <TableCell className="text-sm text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(residual)}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(residual)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {(!residuals || residuals.length === 0) && (
          <TableRow>
            <TableCell colSpan={5} className="text-sm text-center">
              No residuals found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}