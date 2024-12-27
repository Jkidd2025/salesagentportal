import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

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
    <FormField
      control={form.control}
      name="accountId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Account</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {accounts?.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}