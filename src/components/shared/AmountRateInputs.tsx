import { Input } from "@/components/ui/input";

interface AmountRateInputsProps {
  amount: number;
  onAmountChange: (value: number) => void;
  rate: number;
  onRateChange: (value: number) => void;
}

export function AmountRateInputs({ 
  amount, 
  onAmountChange, 
  rate, 
  onRateChange 
}: AmountRateInputsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Amount</label>
        <Input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
          placeholder="Enter amount"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Rate (%)</label>
        <Input
          type="number"
          step="0.1"
          value={rate}
          onChange={(e) => onRateChange(parseFloat(e.target.value) || 0)}
          placeholder="Enter rate"
        />
      </div>
    </div>
  );
}