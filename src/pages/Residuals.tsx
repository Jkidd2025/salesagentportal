import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth } from "date-fns";
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
import { ResidualForm } from "@/components/residuals/ResidualForm";
import { ResidualHeader } from "@/components/residuals/ResidualHeader";
import { ResidualFilters } from "@/components/residuals/ResidualFilters";
import { ResidualList } from "@/components/residuals/ResidualList";
import { BulkImportDialog } from "@/components/shared/BulkImportDialog";

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
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedResidual, setSelectedResidual] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  const deleteResidual = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("residuals")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residuals"] });
      toast({
        title: "Success",
        description: "Residual deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setSelectedResidual(null);
    },
    onError: (error) => {
      toast({
        title: "Error deleting residual",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateResidual = async (values: any) => {
    const { error } = await supabase
      .from('residuals')
      .insert([values]);
    
    if (error) throw error;
    
    queryClient.invalidateQueries({ queryKey: ['residuals'] });
    setIsDialogOpen(false);
  };

  const handleUpdateResidual = async (values: any) => {
    if (!selectedResidual) return;
    
    const { error } = await supabase
      .from('residuals')
      .update(values)
      .eq('id', selectedResidual.id);
    
    if (error) throw error;
    
    queryClient.invalidateQueries({ queryKey: ['residuals'] });
    setIsDialogOpen(false);
    setSelectedResidual(null);
  };

  const handleSort = (column: "date" | "amount") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const handleEditResidual = (residual: any) => {
    setSelectedResidual({
      ...residual,
      periodStart: new Date(residual.period_start),
      periodEnd: new Date(residual.period_end),
      accountId: residual.account_id,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (residual: any) => {
    setSelectedResidual(residual);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedResidual) return;
    await deleteResidual.mutate(selectedResidual.id);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <ResidualHeader
        onNewClick={() => setIsDialogOpen(true)}
        onImportClick={() => setIsImportDialogOpen(true)}
      />

      <ResidualFilters
        selectedAccount={selectedAccount}
        onAccountChange={setSelectedAccount}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <ResidualList
        residuals={residuals || []}
        isLoading={isLoading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onEdit={handleEditResidual}
        onDelete={handleDeleteClick}
      />

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setSelectedResidual(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedResidual ? "Edit Residual" : "Create New Residual"}
            </DialogTitle>
          </DialogHeader>
          <ResidualForm
            onSubmit={selectedResidual ? handleUpdateResidual : handleCreateResidual}
            onCancel={() => {
              setIsDialogOpen(false);
              setSelectedResidual(null);
            }}
            initialValues={selectedResidual}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the residual record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BulkImportDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        type="residuals"
      />
    </div>
  );
};

export default Residuals;
