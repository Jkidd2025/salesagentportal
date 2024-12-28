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

interface AccountFilterProps {
  value: string;
  onChange: (value: string) => void;
  accounts?: Account[];
}

export function AccountFilter({
  value,
  onChange,
  accounts,
}: AccountFilterProps) {
  return (
    <div className="w-[200px]">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by account" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Accounts</SelectItem>
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