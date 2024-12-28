import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountFilter } from "@/components/shared/AccountFilter";
import { DateRangeFilter } from "@/components/shared/DateRangeFilter";

interface ResidualFiltersProps {
  selectedAccount: string;
  onAccountChange: (value: string) => void;
  dateRange: { from: Date; to: Date };
  onDateRangeChange: (value: { from: Date; to: Date }) => void;
}

export const ResidualFilters = ({
  selectedAccount,
  onAccountChange,
  dateRange,
  onDateRangeChange,
}: ResidualFiltersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AccountFilter
          selectedAccount={selectedAccount}
          onAccountChange={onAccountChange}
        />
        <DateRangeFilter
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
        />
      </CardContent>
    </Card>
  );
};