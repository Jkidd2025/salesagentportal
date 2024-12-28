import { supabase } from "@/integrations/supabase/client";
import type { CommissionFormValues } from "@/lib/validations/commission";

export const submitCommissionForm = async (
  data: CommissionFormValues,
  initialData?: CommissionFormValues & { id?: string }
) => {
  if (initialData?.id) {
    const { error } = await supabase
      .from("commissions")
      .update({
        account_id: data.accountId,
        amount: data.amount,
        rate: data.rate,
        transaction_date: data.transactionDate.toISOString().split("T")[0],
      })
      .eq("id", initialData.id);

    if (error) throw error;
  } else {
    const { error } = await supabase.from("commissions").insert([{
      account_id: data.accountId,
      amount: data.amount,
      rate: data.rate,
      transaction_date: data.transactionDate.toISOString().split("T")[0],
    }]);

    if (error) throw error;
  }
};