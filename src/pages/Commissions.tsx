import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CommissionForm, CommissionFormValues } from "@/components/commissions/CommissionForm";
import { DateRangeFilter } from "@/components/shared/DateRangeFilter";
import { AccountFilter } from "@/components/shared/AccountFilter";
import { CommissionTable } from "@/components/commissions/CommissionTable";

const Commissions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedAccount, setSelectedAccount] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("accounts")
        .select("id, name")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const { data: commissions, isLoading } = useQuery({
    queryKey: ["commissions", sortBy, sortOrder, selectedAccount, dateRange],
    queryFn: async () => {
      let query = supabase
        .from("commissions")
        .select(`
          *,
          account:accounts(name)
        `)
        .gte("transaction_date", format(dateRange.from, "yyyy-MM-dd"))
        .lte("transaction_date", format(dateRange.to, "yyyy-MM-dd"))
        .order(sortBy === "date" ? "transaction_date" : "amount", {
          ascending: sortOrder === "asc",
        });

      if (selectedAccount !== "all") {
        query = query.eq("account_id", selectedAccount);
      }

      const { data, error } = await query;

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

  const createCommission = useMutation({
    mutationFn: async (values: CommissionFormValues) => {
      const { error } = await supabase.from("commissions").insert({
        account_id: values.accountId,
        amount: values.amount,
        rate: values.rate,
        transaction_date: format(values.transactionDate, "yyyy-MM-dd"),
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commissions"] });
      toast({
        title: "Success",
        description: "Commission created successfully",
      });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error creating commission",
        description: error.message,
        variant: "destructive",
      });
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

  const handleCreateCommission = async (values: CommissionFormValues) => {
    await createCommission.mutate(values);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Commissions</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Commission
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Commission</DialogTitle>
            </DialogHeader>
            <CommissionForm
              onSubmit={handleCreateCommission}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commission History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <AccountFilter
              accounts={accounts}
              selectedAccount={selectedAccount}
              onAccountChange={setSelectedAccount}
            />
            <DateRangeFilter
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-4">Loading commissions...</div>
          ) : (
            <CommissionTable
              commissions={commissions}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Commissions;