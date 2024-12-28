import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";

interface Commission {
  id: string;
  account_id: string;
  rate: number;
  amount: number;
  transaction_date: string;
}

interface CommissionTableProps {
  commissions: Commission[];
  onEdit: (commission: Commission) => void;
  onDelete: (commission: Commission) => void;
}

export const CommissionTable = ({ commissions, onEdit, onDelete }: CommissionTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction Date</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Commission</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {commissions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No commissions found
              </TableCell>
            </TableRow>
          ) : (
            commissions.map((commission) => (
              <TableRow key={commission.id}>
                <TableCell>
                  {new Date(commission.transaction_date).toLocaleDateString()}
                </TableCell>
                <TableCell>{commission.rate}%</TableCell>
                <TableCell>{formatCurrency(commission.amount)}</TableCell>
                <TableCell>
                  {formatCurrency((commission.amount * commission.rate) / 100)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(commission)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(commission)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};