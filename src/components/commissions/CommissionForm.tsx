import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CommissionFormFields } from "./CommissionFormFields";
import { checkDuplicateCommission } from "@/lib/utils/commission-validation";
import { submitCommissionForm } from "@/lib/utils/commission-submission";
import { commissionSchema, type CommissionFormValues } from "@/lib/validations/commission";

interface CommissionFormProps {
  initialData?: (CommissionFormValues & { id?: string }) | null;
  onSuccess: () => void;
}

export function CommissionForm({ initialData, onSuccess }: CommissionFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<CommissionFormValues>({
    resolver: zodResolver(commissionSchema),
    defaultValues: initialData || {
      accountId: "",
      amount: 0,
      rate: 0,
      transactionDate: new Date(),
    },
  });

  const onSubmit = async (data: CommissionFormValues) => {
    setLoading(true);

    try {
      const isDuplicate = await checkDuplicateCommission(data);
      
      if (isDuplicate) {
        toast({
          title: "Duplicate Commission",
          description: "A commission with these exact details already exists.",
          variant: "destructive",
        });
        return;
      }

      await submitCommissionForm(data, initialData);

      toast({
        title: "Success",
        description: `Commission ${initialData ? "updated" : "created"} successfully`,
      });
      onSuccess();
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CommissionFormFields form={form} />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update Commission" : "Add Commission"}
        </Button>
      </form>
    </Form>
  );
}