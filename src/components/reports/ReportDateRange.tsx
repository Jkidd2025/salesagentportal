import { DateRangeFilter } from "@/components/shared/DateRangeFilter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReportDateRangeProps {
  dateRange: { from: Date; to: Date };
  onDateRangeChange: (range: { from: Date; to: Date }) => void;
}

export function ReportDateRange({ dateRange, onDateRangeChange }: ReportDateRangeProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Date Range</CardTitle>
      </CardHeader>
      <CardContent>
        <DateRangeFilter
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
        />
      </CardContent>
    </Card>
  );
}