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
  accounts?: Account[];
}

export function AccountSelect({ value, onChange, required, accounts }: AccountSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Account</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select an account" />
        </SelectTrigger>
        <SelectContent>
          {accounts?.map((account) => (
            <SelectItem key={account.id} value={account.id}>
              {account.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}