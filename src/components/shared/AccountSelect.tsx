import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Account {
  id: string;
  name: string;
}

interface AccountSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function AccountSelect({ value, onChange, required }: AccountSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Account</label>
      <Select value={value} onValueChange={onChange} required={required}>
        <SelectTrigger>
          <SelectValue placeholder="Select an account" />
        </SelectTrigger>
        <SelectContent>
          {/* Account options will be populated by parent */}
        </SelectContent>
      </Select>
    </div>
  );
}
