import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ResidualForm, ResidualFormValues } from "@/components/residuals/ResidualForm";

const Residuals = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedAccount, setSelectedAccount] = useState<string>("");
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

      if (selectedAccount) {
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
            <div className="w-[200px]">
              <Select
                value={selectedAccount}
                onValueChange={setSelectedAccount}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Accounts</SelectItem>
                  {accounts?.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[300px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      setDateRange({ from: range.from, to: range.to });
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {isLoading ? (
            <div className="text-center py-4">Loading residuals...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort("date")}
                  >
                    Period {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
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
                {residuals?.map((residual) => (
                  <TableRow key={residual.id}>
                    <TableCell>{residual.account?.name || "N/A"}</TableCell>
                    <TableCell>
                      {format(new Date(residual.period_start), "MMM d, yyyy")} -{" "}
                      {format(new Date(residual.period_end), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      ${residual.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {(residual.rate * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
                {(!residuals || residuals.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No residuals found
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

export default Residuals;