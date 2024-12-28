import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Account {
  id: string;
  name: string;
}

interface AccountFilterProps {
  accounts?: Account[];
  selectedAccount: string;
  onAccountChange: (value: string) => void;
  isLoading?: boolean;
}

export function AccountFilter({
  accounts,
  selectedAccount,
  onAccountChange,
  isLoading,
}: AccountFilterProps) {
  if (isLoading) {
    return <Skeleton className="h-10 w-[200px]" />;
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="w-[200px]">
        <Select value={selectedAccount} onValueChange={onAccountChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Accounts</SelectItem>
            {accounts?.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Filter data by selecting a specific account</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}