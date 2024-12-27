import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface AmountRateInputsProps {
  form: UseFormReturn<any>;
}

export function AmountRateInputs({ form }: AmountRateInputsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amount</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter amount"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="rate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rate (%)</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.1"
                placeholder="Enter rate"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) / 100)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}