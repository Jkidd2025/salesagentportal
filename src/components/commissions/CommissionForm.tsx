import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AccountSelect } from "@/components/shared/AccountSelect";
import { AmountRateInputs } from "@/components/shared/AmountRateInputs";
import { DatePickerField } from "@/components/shared/DatePickerField";
import { Commission } from "@/types";
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

interface CommissionFormProps {
  initialData?: Commission | null;
  onSuccess: () => void;
}

export const CommissionForm = ({ initialData, onSuccess }: CommissionFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    accountId: initialData?.account_id || "",
    rate: initialData?.rate || 0,
    amount: initialData?.amount || 0,
    transactionDate: initialData ? new Date(initialData.transaction_date) : new Date(),
  });

  const mutation = useMutation({
    mutationFn: async (data: Omit<Commission, "id" | "created_at">) => {
      if (initialData) {
        const { error } = await supabase
          .from("commissions")
          .update(data)
          .eq("id", initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("commissions").insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commissions"] });
      toast({
        title: "Success",
        description: `Commission ${initialData ? "updated" : "added"} successfully`,
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    setShowConfirmation(false);

    try {
      await mutation.mutateAsync({
        account_id: formData.accountId,
        rate: formData.rate,
        amount: formData.amount,
        transaction_date: formData.transactionDate.toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AccountSelect
          form={{
            watch: () => formData.accountId,
            setValue: (_, value) => setFormData({ ...formData, accountId: value }),
          }}
        />
        <AmountRateInputs
          form={{
            register: () => ({
              value: formData.amount,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, amount: Number(e.target.value) }),
            }),
            watch: () => ({ amount: formData.amount, rate: formData.rate }),
          }}
        />
        <DatePickerField
          form={{
            watch: () => formData.transactionDate,
            setValue: (_, value) =>
              setFormData({ ...formData, transactionDate: value }),
          }}
          name="transactionDate"
          label="Transaction Date"
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update Commission" : "Add Commission"}
        </Button>
      </form>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {initialData ? "update" : "add"} this commission?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {initialData ? "Update" : "Add"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};