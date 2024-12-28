import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AccountTable } from "@/components/accounts/AccountTable";
import { AccountSearch } from "@/components/accounts/AccountSearch";
import { AccountMetrics } from "@/components/accounts/AccountMetrics";

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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Accounts</h1>
      </div>

      <AccountMetrics accounts={filteredAccounts || []} />

      <Card>
        <CardHeader>
          <CardTitle>Account List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <AccountSearch value={searchTerm} onChange={setSearchTerm} />
          </div>

          {isLoading ? (
            <div className="text-center py-4">Loading accounts...</div>
          ) : (
            <AccountTable accounts={filteredAccounts || []} onUpdate={refetch} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Accounts;