import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AccountSelect } from "@/components/shared/AccountSelect";
import { AmountRateInputs } from "@/components/shared/AmountRateInputs";
import { DatePickerField } from "@/components/shared/DatePickerField";
import type { CommissionFormValues } from "@/lib/validations/commission";

interface CommissionFormFieldsProps {
  form: UseFormReturn<CommissionFormValues>;
}

export function CommissionFormFields({ form }: CommissionFormFieldsProps) {
  return (
    <>
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
    </>
  );
}