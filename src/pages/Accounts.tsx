import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AccountEditDialog } from "@/components/accounts/AccountEditDialog";

interface Account {
  id: string;
  name: string;
  status: string;
  created_at: string;
  total_commissions: number;
  total_residuals: number;
  last_transaction_date: string;
}

const Accounts = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: accounts, isLoading, refetch } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error fetching accounts",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data as Account[];
    },
  });

  const filteredAccounts = accounts?.filter((account) =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Accounts</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-4">Loading accounts...</div>
          ) : (
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
                  {filteredAccounts?.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={account.status === "active" ? "default" : "secondary"}
                        >
                          {account.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(account.total_commissions)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(account.total_residuals)}
                      </TableCell>
                      <TableCell>
                        {account.last_transaction_date
                          ? new Date(account.last_transaction_date).toLocaleDateString()
                          : "No transactions"}
                      </TableCell>
                      <TableCell>
                        <AccountEditDialog account={account} onUpdate={refetch} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredAccounts?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No accounts found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Accounts;