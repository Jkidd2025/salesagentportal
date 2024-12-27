import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const Commissions = () => {
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: commissions, isLoading } = useQuery({
    queryKey: ["commissions", sortBy, sortOrder],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("commissions")
        .select(`
          *,
          account:accounts(name)
        `)
        .order(sortBy === "date" ? "transaction_date" : "amount", {
          ascending: sortOrder === "asc",
        });

      if (error) {
        toast({
          title: "Error fetching commissions",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  const handleSort = (column: "date" | "amount") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Commissions</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commission History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading commissions...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort("date")}
                  >
                    Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-right"
                    onClick={() => handleSort("amount")}
                  >
                    Amount {sortBy === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissions?.map((commission) => (
                  <TableRow key={commission.id}>
                    <TableCell>{commission.account?.name || "N/A"}</TableCell>
                    <TableCell>
                      {format(new Date(commission.transaction_date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      ${commission.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {(commission.rate * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
                {commissions?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No commissions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Commissions;