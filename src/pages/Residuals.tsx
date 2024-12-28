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
import { ResidualForm, ResidualFormValues } from "@/components/residuals/ResidualForm";
import { DateRangeFilter } from "@/components/shared/DateRangeFilter";
import { AccountFilter } from "@/components/shared/AccountFilter";
import { ResidualTable } from "@/components/residuals/ResidualTable";

const Residuals = () => {
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

  const { data: residuals, isLoading } = useQuery({
    queryKey: ["residuals", sortBy, sortOrder, selectedAccount, dateRange],
    queryFn: async () => {
      let query = supabase
        .from("residuals")
        .select(`
          *,
          account:accounts(name)
        `)
        .gte("period_start", format(dateRange.from, "yyyy-MM-dd"))
        .lte("period_end", format(dateRange.to, "yyyy-MM-dd"))
        .order(sortBy === "date" ? "period_start" : "amount", {
          ascending: sortOrder === "asc",
        });

      if (selectedAccount !== "all") {
        query = query.eq("account_id", selectedAccount);
      }

      const { data, error } = await query;

      if (error) {
        toast({
          title: "Error fetching residuals",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  const createResidual = useMutation({
    mutationFn: async (values: ResidualFormValues) => {
      const { error } = await supabase.from("residuals").insert({
        account_id: values.accountId,
        amount: values.amount,
        rate: values.rate,
        period_start: format(values.periodStart, "yyyy-MM-dd"),
        period_end: format(values.periodEnd, "yyyy-MM-dd"),
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residuals"] });
      toast({
        title: "Success",
        description: "Residual created successfully",
      });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error creating residual",
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

  const handleCreateResidual = async (values: ResidualFormValues) => {
    await createResidual.mutate(values);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Residuals</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Residual
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Residual</DialogTitle>
            </DialogHeader>
            <ResidualForm
              onSubmit={handleCreateResidual}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Residual History</CardTitle>
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
            <div className="text-center py-4">Loading residuals...</div>
          ) : (
            <ResidualTable
              residuals={residuals}
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

export default Residuals;