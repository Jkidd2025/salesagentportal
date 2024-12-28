import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";

interface CommissionHeaderProps {
  onNewClick: () => void;
  onImportClick: () => void;
}

export const CommissionHeader = ({ onNewClick, onImportClick }: CommissionHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Commissions</h1>
      <div className="space-x-2">
        <Button variant="outline" onClick={onImportClick}>
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>
        <Button onClick={onNewClick}>
          <Plus className="mr-2 h-4 w-4" />
          New Commission
        </Button>
      </div>
    </div>
  );
};