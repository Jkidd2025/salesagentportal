import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "commissions" | "residuals";
}

export const BulkImportDialog = ({
  open,
  onOpenChange,
  type,
}: BulkImportDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a CSV file",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const { data, error: uploadError } = await supabase
        .storage
        .from('imports')
        .upload(`${type}/${Date.now()}-${file.name}`, file);

      if (uploadError) throw uploadError;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      formData.append("path", data.path);

      const response = await fetch("/api/process-import", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to import data");
      }

      toast({
        title: "Success",
        description: `Successfully imported ${result.count} records`,
      });

      queryClient.invalidateQueries({ queryKey: [type] });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Import {type}</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import multiple records at once. The CSV should
            include the following columns:
            {type === "commissions" ? (
              <ul className="list-disc list-inside mt-2">
                <li>account_id (UUID)</li>
                <li>rate (number)</li>
                <li>amount (number)</li>
                <li>transaction_date (YYYY-MM-DD)</li>
              </ul>
            ) : (
              <ul className="list-disc list-inside mt-2">
                <li>account_id (UUID)</li>
                <li>rate (number)</li>
                <li>amount (number)</li>
                <li>period_start (YYYY-MM-DD)</li>
                <li>period_end (YYYY-MM-DD)</li>
              </ul>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full"
          >
            {isUploading ? "Uploading..." : "Upload and Import"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};