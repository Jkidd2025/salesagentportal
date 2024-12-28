import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResidualTable } from "@/components/residuals/ResidualTable";

interface ResidualListProps {
  residuals: any[];
  isLoading: boolean;
  sortBy: "date" | "amount";
  sortOrder: "asc" | "desc";
  onSort: (column: "date" | "amount") => void;
  onEdit: (residual: any) => void;
  onDelete: (residual: any) => void;
}

export const ResidualList = ({
  residuals,
  isLoading,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
}: ResidualListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Residual List</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading residuals...</div>
        ) : (
          <ResidualTable
            residuals={residuals}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={onSort}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </CardContent>
    </Card>
  );
};