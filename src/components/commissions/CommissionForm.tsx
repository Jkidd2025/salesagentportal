import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccountSelect } from "@/components/shared/AccountSelect";
import { AmountRateInputs } from "@/components/shared/AmountRateInputs";
import { DatePickerField } from "@/components/shared/DatePickerField";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { commissionSchema, type CommissionFormValues } from "@/lib/validations/commission";

interface CommissionFormProps {
  initialData?: CommissionFormValues | null;
  onSuccess: () => void;
}

export function CommissionForm({ initialData, onSuccess }: CommissionFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<CommissionFormValues>({
    resolver: zodResolver(commissionSchema),
    defaultValues: initialData || {
      accountId: "",
      amount: 0,
      rate: 0,
      transactionDate: new Date(),
    },
  });

  const onSubmit = async (data: CommissionFormValues) => {
    setLoading(true);

    try {
      // Check for duplicates
      const { data: existingCommissions } = await supabase
        .from("commissions")
        .select("*")
        .eq("account_id", data.accountId)
        .eq("amount", data.amount)
        .eq("rate", data.rate)
        .eq("transaction_date", data.transactionDate.toISOString().split("T")[0]);

      if (existingCommissions && existingCommissions.length > 0) {
        toast({
          title: "Duplicate Commission",
          description: "A commission with these exact details already exists.",
          variant: "destructive",
        });
        return;
      }

      if (initialData) {
        const { error } = await supabase
          .from("commissions")
          .update({
            account_id: data.accountId,
            amount: data.amount,
            rate: data.rate,
            transaction_date: data.transactionDate.toISOString().split("T")[0],
          })
          .eq("id", initialData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("commissions").insert([{
          account_id: data.accountId,
          amount: data.amount,
          rate: data.rate,
          transaction_date: data.transactionDate.toISOString().split("T")[0],
        }]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Commission ${initialData ? "updated" : "created"} successfully`,
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="accountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <AccountSelect form={form} {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <AmountRateInputs form={form} />

        <FormField
          control={form.control}
          name="transactionDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Date</FormLabel>
              <DatePickerField
                form={form}
                name="transactionDate"
                label="Transaction Date"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update Commission" : "Add Commission"}
        </Button>
      </form>
    </Form>
  );
}