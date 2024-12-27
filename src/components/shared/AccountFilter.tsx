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
  accounts?: Account[];
  selectedAccount: string;
  onAccountChange: (value: string) => void;
}

export function AccountFilter({
  accounts,
  selectedAccount,
  onAccountChange,
}: AccountFilterProps) {
  return (
    <div className="w-[200px]">
      <Select value={selectedAccount} onValueChange={onAccountChange}>
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