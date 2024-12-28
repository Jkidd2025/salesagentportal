import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface AmountRateInputsProps {
  form: UseFormReturn<any>;
}

export function AmountRateInputs({ form }: AmountRateInputsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Amount</label>
        <Input
          type="number"
          step="0.01"
          {...form.register("amount", { valueAsNumber: true })}
          placeholder="Enter amount"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Rate (%)</label>
        <Input
          type="number"
          step="0.1"
          {...form.register("rate", { valueAsNumber: true })}
          placeholder="Enter rate"
        />
      </div>
    </div>
  );
}