import { UseFormReturn } from "react-hook-form";
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
  form: UseFormReturn<any>;
  accounts?: Account[];
}

export function AccountSelect({ form, accounts }: AccountSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Account</label>
      <Select 
        value={form.watch("accountId")} 
        onValueChange={(value) => form.setValue("accountId", value)}
      >
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