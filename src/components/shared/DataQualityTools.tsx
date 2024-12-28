import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  cleanupDuplicateCommissions,
  cleanupDuplicateResiduals,
  validateAccountData,
} from "@/utils/data-cleanup";

export function DataQualityTools() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleCleanupDuplicates = async () => {
    setLoading(true);
    try {
      const [commissionsResult, residualsResult] = await Promise.all([
        cleanupDuplicateCommissions(),
        cleanupDuplicateResiduals(),
      ]);

      toast({
        title: "Cleanup Complete",
        description: `Removed ${commissionsResult.removed} duplicate commissions and ${residualsResult.removed} duplicate residuals.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleValidateData = async () => {
    setLoading(true);
    try {
      const issues = await validateAccountData();

      if (issues.length === 0) {
        toast({
          title: "Validation Complete",
          description: "No data quality issues found.",
        });
      } else {
        toast({
          title: "Validation Issues Found",
          description: `Found ${issues.length} data quality issues. Check the console for details.`,
          variant: "destructive",
        });
        console.log("Data Quality Issues:", issues);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Quality Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleCleanupDuplicates}
            disabled={loading}
            variant="outline"
          >
            Clean Up Duplicates
          </Button>
          <Button
            onClick={handleValidateData}
            disabled={loading}
            variant="outline"
          >
            Validate Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}