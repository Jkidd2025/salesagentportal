import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommissionTable } from "@/components/commissions/CommissionTable";
import { CommissionForm } from "@/components/commissions/CommissionForm";
import { AccountFilter } from "@/components/shared/AccountFilter";
import { DateRangeFilter } from "@/components/shared/DateRangeFilter";

interface Commission {
  id: string;
  account_id: string;
  rate: number;
  amount: number;
  transaction_date: string;
}

const Commissions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);

  const { data: commissions, isLoading } = useQuery({
    queryKey: ["commissions", selectedAccountId, dateRange],
    queryFn: async () => {
      let query = supabase
        .from("commissions")
        .select("*")
        .order("transaction_date", { ascending: false });

      if (selectedAccountId) {
        query = query.eq("account_id", selectedAccountId);
      }

      if (dateRange) {
        query = query
          .gte("transaction_date", dateRange.from.toISOString())
          .lte("transaction_date", dateRange.to.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        toast({
          title: "Error fetching commissions",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data as Commission[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("commissions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commissions"] });
      toast({
        title: "Success",
        description: "Commission deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setSelectedCommission(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (commission: Commission) => {
    setSelectedCommission(commission);
    setIsFormOpen(true);
  };

  const handleDelete = (commission: Commission) => {
    setSelectedCommission(commission);
    setIsDeleteDialogOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedCommission(null);
  };

  const confirmDelete = () => {
    if (selectedCommission) {
      deleteMutation.mutate(selectedCommission.id);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Commissions</h1>
        <Button onClick={() => setIsFormOpen(true)}>Add Commission</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AccountFilter
            value={selectedAccountId}
            onChange={setSelectedAccountId}
          />
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commission List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading commissions...</div>
          ) : (
            <CommissionTable
              commissions={commissions || []}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCommission ? "Edit Commission" : "Add Commission"}
            </DialogTitle>
          </DialogHeader>
          <CommissionForm
            initialData={selectedCommission}
            onSuccess={handleFormClose}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              commission record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Commissions;