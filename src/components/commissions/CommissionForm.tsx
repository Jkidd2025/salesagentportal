import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AccountSelect } from "@/components/shared/AccountSelect";
import { AmountRateInputs } from "@/components/shared/AmountRateInputs";
import { DatePickerField } from "@/components/shared/DatePickerField";

interface Commission {
  id: string;
  account_id: string;
  rate: number;
  amount: number;
  transaction_date: string;
}

interface CommissionFormProps {
  initialData?: Commission | null;
  onSuccess: () => void;
}

export const CommissionForm = ({ initialData, onSuccess }: CommissionFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [accountId, setAccountId] = useState(initialData?.account_id || "");
  const [rate, setRate] = useState(initialData?.rate || 0);
  const [amount, setAmount] = useState(initialData?.amount || 0);
  const [transactionDate, setTransactionDate] = useState<Date>(
    initialData ? new Date(initialData.transaction_date) : new Date()
  );

  const mutation = useMutation({
    mutationFn: async (data: Omit<Commission, "id">) => {
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
    setLoading(true);

    try {
      await mutation.mutateAsync({
        account_id: accountId,
        rate,
        amount,
        transaction_date: transactionDate.toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AccountSelect
        value={accountId}
        onChange={(value) => setAccountId(value)}
        required
      />
      <AmountRateInputs
        amount={amount}
        onAmountChange={setAmount}
        rate={rate}
        onRateChange={setRate}
      />
      <DatePickerField
        label="Transaction Date"
        value={transactionDate}
        onChange={setTransactionDate}
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : initialData ? "Update Commission" : "Add Commission"}
      </Button>
    </form>
  );
};