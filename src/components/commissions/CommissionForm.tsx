import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { AccountSelect } from "@/components/shared/AccountSelect";
import { AmountRateInputs } from "@/components/shared/AmountRateInputs";
import { DatePickerField } from "@/components/shared/DatePickerField";

interface CommissionFormProps {
  onSubmit: (values: CommissionFormValues) => Promise<void>;
  onCancel: () => void;
}

export interface CommissionFormValues {
  accountId: string;
  amount: number;
  rate: number;
  transactionDate: Date;
}

export function CommissionForm({ onSubmit, onCancel }: CommissionFormProps) {
  const form = useForm<CommissionFormValues>();

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <AccountSelect form={form} accounts={accounts} />
        <AmountRateInputs form={form} />
        <DatePickerField
          form={form}
          name="transactionDate"
          label="Transaction Date"
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Create Commission</Button>
        </div>
      </form>
    </Form>
  );
}